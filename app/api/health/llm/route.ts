import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CheckLevel = "ok" | "warning" | "error";

type HealthCheck = {
  status: CheckLevel;
  message: string;
};

type HealthResponse = {
  status: CheckLevel;
  baseUrl: string;
  model: string;
  keyPresent: boolean;
  keyHint: string;
  checks: {
    env: HealthCheck;
    network: HealthCheck;
    auth: HealthCheck;
  };
};

function maskKey(apiKey: string | undefined) {
  if (!apiKey) return "(missing)";
  if (apiKey.length <= 8) return "(too-short)";
  return `${apiKey.slice(0, 4)}***${apiKey.slice(-4)}`;
}

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    done: () => clearTimeout(timer),
  };
}

function mergeStatus(items: CheckLevel[]): CheckLevel {
  if (items.includes("error")) return "error";
  if (items.includes("warning")) return "warning";
  return "ok";
}

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.DEEPSEEK_API_KEY;

  const baseUrl = (
    process.env.OPENAI_BASE_URL ??
    process.env.DEEPSEEK_BASE_URL ??
    "https://api.deepseek.com"
  ).replace(/\/$/, "");

  const model =
    process.env.OPENAI_MODEL ?? process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  const result: HealthResponse = {
    status: "ok",
    baseUrl,
    model,
    keyPresent: Boolean(apiKey),
    keyHint: maskKey(apiKey),
    checks: {
      env: apiKey
        ? { status: "ok", message: "已读取到 API Key。" }
        : { status: "error", message: "缺少 OPENAI_API_KEY/DEEPSEEK_API_KEY。" },
      network: { status: "warning", message: "尚未检测网络连通性。" },
      auth: { status: "warning", message: "尚未验证鉴权。" },
    },
  };

  if (!apiKey) {
    result.status = "error";
    return NextResponse.json(result, { status: 200 });
  }

  const endpoint = `${baseUrl}/models`;
  const timeout = withTimeout(12000);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: timeout.signal,
    });

    result.checks.network = {
      status: "ok",
      message: `可连通 ${baseUrl}。`,
    };

    if (response.ok) {
      result.checks.auth = {
        status: "ok",
        message: "鉴权通过，API 可用。",
      };
    } else if (response.status === 401) {
      result.checks.auth = {
        status: "error",
        message: "401 Unauthorized：API Key 无效或已失效。",
      };
    } else if (response.status === 403) {
      result.checks.auth = {
        status: "error",
        message: "403 Forbidden：当前 Key 无权限访问该 API。",
      };
    } else {
      const text = await response.text();
      result.checks.auth = {
        status: "warning",
        message: `模型服务返回 ${response.status}：${text.slice(0, 180)}`,
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    result.checks.network = {
      status: "error",
      message: `网络连接失败：${message}`,
    };

    result.checks.auth = {
      status: "warning",
      message: "鉴权未执行（网络失败）。",
    };
  } finally {
    timeout.done();
  }

  result.status = mergeStatus([
    result.checks.env.status,
    result.checks.network.status,
    result.checks.auth.status,
  ]);

  return NextResponse.json(result, { status: 200 });
}
