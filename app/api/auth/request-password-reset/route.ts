import { NextResponse } from "next/server";

import { isValidMainlandPhone, normalizePhone } from "@/lib/auth-identity";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

type PasswordResetRequestBody = {
  phone?: string;
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

function validateBody(body: PasswordResetRequestBody) {
  const phone = normalizePhone(body.phone ?? "");

  if (!isValidMainlandPhone(phone)) {
    return { error: "请输入有效的 11 位手机号" } as const;
  }

  return { phone } as const;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as PasswordResetRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "请求体格式不正确" }, { status: 400 });
  }

  const validated = validateBody(body);
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
    return NextResponse.json({ ok: true });
  }

  const supabase = createPublicClient();
  const redirectTo = new URL("/reset-password", request.url).toString();
  const { error } = await supabase.auth.resetPasswordForEmail(profile.email, { redirectTo });

  if (error) {
    return NextResponse.json({ error: error.message || "发送重置邮件失败，请稍后再试" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
