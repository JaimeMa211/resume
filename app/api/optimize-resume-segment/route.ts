import { NextResponse } from "next/server";

import { RESUME_SEGMENT_OPTIMIZER_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

type SegmentOptimizePayload = {
  sectionTitle: string;
  fieldLabel: string;
  persona: string;
  text: string;
  mode: "concise" | "results";
};

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

function buildUserPrompt(input: SegmentOptimizePayload) {
  const modeInstruction =
    input.mode === "concise"
      ? "本次优化目标：压缩表达、减少空话、保留关键信息，让这段更干净利落。"
      : "本次优化目标：更强调动作、结果、影响和产出，让这段更像投递用简历表达。";

  return [
    "请只优化下面这一段简历内容。",
    "保持事实不变，只优化表达，更适合求职投递。",
    modeInstruction,
    "不要生成多版，不要解释，不要补造数字。",
    "",
    `【当前身份】\n${input.persona || "未提供"}`,
    `【模块】\n${input.sectionTitle || "未提供"}`,
    `【字段】\n${input.fieldLabel || "未提供"}`,
    `【待优化内容】\n${input.text}`,
  ].join("\n");
}

async function callOpenAICompatibleApi(input: SegmentOptimizePayload): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY or DEEPSEEK_API_KEY.");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL ?? process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
  const endpoint = `${baseUrl}/chat/completions`;

  const messages = [
    { role: "system", content: RESUME_SEGMENT_OPTIMIZER_SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(input) },
  ];

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(endpoint, {
    method: "POST",
    headers,
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
      headers,
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
  const parsed = JSON.parse(jsonText) as { optimizedText?: unknown };
  const optimizedText = typeof parsed.optimizedText === "string" ? parsed.optimizedText.trim() : "";

  if (!optimizedText) {
    throw new Error("Model output is empty.");
  }

  return optimizedText;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sectionTitle?: unknown;
      fieldLabel?: unknown;
      persona?: unknown;
      text?: unknown;
      mode?: unknown;
    };

    const payload: SegmentOptimizePayload = {
      sectionTitle: typeof body.sectionTitle === "string" ? body.sectionTitle.trim() : "",
      fieldLabel: typeof body.fieldLabel === "string" ? body.fieldLabel.trim() : "",
      persona: typeof body.persona === "string" ? body.persona.trim() : "",
      text: typeof body.text === "string" ? body.text.trim() : "",
      mode: body.mode === "concise" ? "concise" : "results",
    };

    if (!payload.text) {
      return NextResponse.json({ error: "text is required." }, { status: 400 });
    }

    const optimizedText = await callOpenAICompatibleApi(payload);
    return NextResponse.json({ optimizedText });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to optimize segment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
