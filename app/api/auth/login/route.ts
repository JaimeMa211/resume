import { NextResponse } from "next/server";

import { isValidMainlandPhone, normalizePhone } from "@/lib/auth-identity";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

type LoginRequestBody = {
  phone?: string;
  password?: string;
};

function getProfilesErrorMessage(errorMessage: string): string {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("relation") && normalized.includes("profiles") && normalized.includes("does not exist")) {
    return "Supabase 中缺少 profiles 表，请先执行 supabase/profiles.sql。";
  }

  if (normalized.includes("column") && normalized.includes("email") && normalized.includes("profiles")) {
    return "profiles 表缺少 email 字段，请重新执行 supabase/profiles.sql。";
  }

  if (normalized.includes("column") && normalized.includes("phone") && normalized.includes("profiles")) {
    return "profiles 表缺少 phone 字段，请重新执行 supabase/profiles.sql。";
  }

  return `账户资料表访问失败：${errorMessage}`;
}

function validateLoginBody(body: LoginRequestBody) {
  const phone = normalizePhone(body.phone ?? "");
  const password = body.password ?? "";

  if (!phone || password.trim().length === 0) {
    return { error: "请填写手机号和密码" } as const;
  }

  if (!isValidMainlandPhone(phone)) {
    return { error: "请输入有效的 11 位手机号" } as const;
  }

  return { phone, password } as const;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "请求体格式不正确" }, { status: 400 });
  }

  const validated = validateLoginBody(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: profile, error: lookupError } = await admin
    .from("profiles")
    .select("email")
    .eq("phone", validated.phone)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: getProfilesErrorMessage(lookupError.message) }, { status: 500 });
  }

  if (!profile?.email) {
    return NextResponse.json({ error: "手机号或密码错误，请重试" }, { status: 401 });
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: validated.password,
  });

  if (error || !data.session) {
    return NextResponse.json({ error: "手机号或密码错误，请重试" }, { status: 401 });
  }

  return NextResponse.json({
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    },
  });
}
