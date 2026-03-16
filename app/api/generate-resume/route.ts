import { NextResponse } from "next/server";

import type { ResumePersona } from "@/components/templates/types";
import { normalizeResumeData } from "@/lib/resume-data";
import { RESUME_BUILDER_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

function normalizePersona(value: unknown): ResumePersona {
  return value === "intern" || value === "graduate" || value === "experienced" ? value : "graduate";
}

function buildUserPrompt(input: {
  persona: ResumePersona;
  sourceText: string;
  targetRole: string;
  jdText: string;
  notes: string;
}) {
  return [
    "请根据系统要求，将输入信息整理成结构化简历 JSON。",
    "只输出 JSON 对象，不要输出解释。",
    "",
    "要求：",
    "1. 如果用户已选择身份预设，请围绕该身份安排内容重点。",
    "2. 应届或实习阶段优先强调教育、实习、校园经历、项目、证书。",
    "3. 职场人士优先强调工作经历、项目经验、专业技能和量化成果。",
    "4. 没有把握的信息留空，不要虚构。",
    "",
    `【身份预设】\n${input.persona}`,
    `【目标岗位】\n${input.targetRole || "未提供"}`,
    `【原始简历文本】\n${input.sourceText || "未提供"}`,
    `【岗位描述 JD】\n${input.jdText || "未提供"}`,
    `【补充说明】\n${input.notes || "未提供"}`,
  ].join("\n");
}

function normalizeMessageContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const textParts = content
      .filter((item): item is { text?: unknown } => !!item && typeof item === "object")
      .map((item) => (typeof item.text === "string" ? item.text : ""))
      .filter(Boolean);

    if (textParts.length > 0) {
      return textParts.join("\n");
    }
  }

  throw new Error("Model did not return text content.");
}

function extractJsonText(content: unknown): string {
  const normalized = normalizeMessageContent(content);
  const trimmed = normalized.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model output does not contain valid JSON object.");
  }

  return trimmed.slice(start, end + 1);
}

async function callOpenAICompatibleApi(input: {
  persona: ResumePersona;
  sourceText: string;
  targetRole: string;
  jdText: string;
  notes: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY or DEEPSEEK_API_KEY.");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL ?? process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
  const endpoint = `${baseUrl}/chat/completions`;

  const messages = [
    { role: "system", content: RESUME_BUILDER_SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(input) },
  ];

  const commonHeaders = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(endpoint, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" as const },
      messages,
    }),
  });

  if (!response.ok && response.status === 400) {
    response = await fetch(endpoint, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages,
      }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model API request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const jsonText = extractJsonText(data.choices?.[0]?.message?.content);
  const normalized = normalizeResumeData(JSON.parse(jsonText) as unknown);

  return {
    ...normalized,
    persona: normalized.persona || input.persona,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      persona?: unknown;
      sourceText?: unknown;
      targetRole?: unknown;
      jdText?: unknown;
      notes?: unknown;
    };

    const persona = normalizePersona(body.persona);
    const sourceText = typeof body.sourceText === "string" ? body.sourceText.trim() : "";
    const targetRole = typeof body.targetRole === "string" ? body.targetRole.trim() : "";
    const jdText = typeof body.jdText === "string" ? body.jdText.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!sourceText && !targetRole && !jdText && !notes) {
      return NextResponse.json({ error: "At least one input field is required." }, { status: 400 });
    }

    const result = await callOpenAICompatibleApi({
      persona,
      sourceText,
      targetRole,
      jdText,
      notes,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate resume draft.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
