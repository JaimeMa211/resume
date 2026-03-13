import { NextResponse } from "next/server";

import { RESUME_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

type OptimizedExperience = {
  company: string;
  role: string;
  details: string[];
};

type OptimizeResult = {
  match_score: number;
  optimizations: string[];
  new_experiences: OptimizedExperience[];
};

function buildUserPrompt(resumeText: string, jdText: string) {
  return [
    "请根据系统要求进行 ATS 导向的简历重写，并严格按 JSON 返回。",
    "仅输出 JSON 对象，不要附加任何解释。",
    "",
    "任务重点：",
    "1. 先识别 JD 的硬性要求、加分项和高频关键词。",
    "2. 优先重写与 JD 最相关的经历，弱化不相关内容。",
    "3. 每条经历优先体现结果与影响（效率、质量、成本、增长等）。",
    "4. 严禁虚构，缺失的量化信息请用“可补充：xxx”提示。",
    "",
    "【原简历文本 - 开始】",
    resumeText,
    "【原简历文本 - 结束】",
    "",
    "【JD 文本 - 开始】",
    jdText,
    "【JD 文本 - 结束】",
  ].join("\n");
}

function normalizeMessageContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const textParts = content
      .filter((item): item is { type?: unknown; text?: unknown } => !!item && typeof item === "object")
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

function normalizeResult(raw: unknown): OptimizeResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Model JSON is not an object.");
  }

  const obj = raw as Record<string, unknown>;

  const scoreValue = Number(obj.match_score);
  const safeScore = Number.isFinite(scoreValue)
    ? Math.max(0, Math.min(100, Math.round(scoreValue)))
    : 0;

  const optimizations = Array.isArray(obj.optimizations)
    ? obj.optimizations.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];

  const newExperiences = Array.isArray(obj.new_experiences)
    ? obj.new_experiences
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => {
          const details = Array.isArray(item.details)
            ? item.details.filter((d): d is string => typeof d === "string").map((d) => d.trim()).filter(Boolean)
            : [];

          return {
            company: typeof item.company === "string" ? item.company.trim() : "",
            role: typeof item.role === "string" ? item.role.trim() : "",
            details,
          };
        })
        .filter((item) => item.company || item.role || item.details.length > 0)
    : [];

  return {
    match_score: safeScore,
    optimizations,
    new_experiences: newExperiences,
  };
}

async function callOpenAICompatibleApi(input: {
  resumeText: string;
  jdText: string;
}): Promise<OptimizeResult> {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY or DEEPSEEK_API_KEY.");
  }

  const baseUrl = (
    process.env.OPENAI_BASE_URL ??
    process.env.DEEPSEEK_BASE_URL ??
    "https://api.deepseek.com"
  ).replace(/\/$/, "");

  const model =
    process.env.OPENAI_MODEL ?? process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  const endpoint = `${baseUrl}/chat/completions`;

  const messages = [
    { role: "system", content: RESUME_SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(input.resumeText, input.jdText) },
  ];

  const payloadWithJsonMode = {
    model,
    temperature: 0.2,
    response_format: { type: "json_object" as const },
    messages,
  };

  const commonHeaders = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(endpoint, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify(payloadWithJsonMode),
  });

  if (!response.ok && response.status === 400) {
    const fallbackPayload = {
      model,
      temperature: 0.2,
      messages,
    };

    response = await fetch(endpoint, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify(fallbackPayload),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model API request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  const jsonText = extractJsonText(content);
  const parsed = JSON.parse(jsonText) as unknown;

  return normalizeResult(parsed);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      resumeText?: unknown;
      jdText?: unknown;
    };

    const resumeText =
      typeof body.resumeText === "string" ? body.resumeText.trim() : "";
    const jdText = typeof body.jdText === "string" ? body.jdText.trim() : "";

    if (!resumeText || !jdText) {
      return NextResponse.json(
        { error: "resumeText and jdText are required." },
        { status: 400 }
      );
    }

    const result = await callOpenAICompatibleApi({ resumeText, jdText });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to optimize resume.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

