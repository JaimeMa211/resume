import { NextResponse } from "next/server";

import { isValidEmail, isValidMainlandPhone, normalizeEmail, normalizePhone } from "@/lib/auth-identity";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

type RegisterRequestBody = {
  name?: string;
  phone?: string;
  email?: string;
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

function getMonthlyQuotaByPlan(plan: "free" | "monthly" | "yearly" | "buyout"): number | null {
  if (plan === "free") return 3;
  if (plan === "monthly") return 120;
  if (plan === "yearly") return 240;
  return null;
}

function validateRegisterBody(body: RegisterRequestBody) {
  const name = body.name?.trim() ?? "";
  const phone = normalizePhone(body.phone ?? "");
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  if (name.length < 2) {
    return { error: "昵称至少需要 2 个字符" } as const;
  }

  if (!isValidMainlandPhone(phone)) {
    return { error: "请输入有效的 11 位手机号" } as const;
  }

  if (!isValidEmail(email)) {
    return { error: "请输入有效的邮箱地址" } as const;
  }

  if (password.length < 6) {
    return { error: "密码至少 6 位" } as const;
  }

  return { name, phone, email, password } as const;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterRequestBody | null;
  if (!body) {
    return NextResponse.json({ error: "请求体格式不正确" }, { status: 400 });
  }

  const validated = validateRegisterBody(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const admin = createAdminClient();

  const [
    { data: existingPhoneProfile, error: phoneLookupError },
    { data: existingEmailProfile, error: emailLookupError },
  ] = await Promise.all([
    admin.from("profiles").select("id").eq("phone", validated.phone).maybeSingle(),
    admin.from("profiles").select("id").eq("email", validated.email).maybeSingle(),
  ]);

  if (phoneLookupError) {
    return NextResponse.json({ error: getProfilesErrorMessage(phoneLookupError.message) }, { status: 500 });
  }

  if (emailLookupError) {
    return NextResponse.json({ error: getProfilesErrorMessage(emailLookupError.message) }, { status: 500 });
  }

  if (existingPhoneProfile) {
    return NextResponse.json({ error: "该手机号已注册，请直接登录" }, { status: 409 });
  }

  if (existingEmailProfile) {
    return NextResponse.json({ error: "该邮箱已注册，请直接登录或更换邮箱" }, { status: 409 });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: validated.email,
    password: validated.password,
    email_confirm: true,
    user_metadata: {
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
    },
  });

  if (error || !data.user) {
    const normalizedMessage = error?.message.toLowerCase() ?? "";

    if (normalizedMessage.includes("already") || normalizedMessage.includes("duplicate")) {
      return NextResponse.json({ error: "该邮箱已注册，请直接登录或更换邮箱" }, { status: 409 });
    }

    return NextResponse.json({ error: error?.message ?? "注册失败，请稍后再试" }, { status: 400 });
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    name: validated.name,
    phone: validated.phone,
    email: validated.email,
    plan: "free",
    monthly_quota: getMonthlyQuotaByPlan("free"),
    monthly_used: 0,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);

    if (profileError.message.includes("profiles_phone_key")) {
      return NextResponse.json({ error: "该手机号已注册，请直接登录" }, { status: 409 });
    }

    if (profileError.message.includes("profiles_email_key")) {
      return NextResponse.json({ error: "该邮箱已注册，请直接登录或更换邮箱" }, { status: 409 });
    }

    return NextResponse.json({ error: getProfilesErrorMessage(profileError.message) }, { status: 500 });
  }

  const publicClient = createPublicClient();
  const { data: signInData, error: signInError } = await publicClient.auth.signInWithPassword({
    email: validated.email,
    password: validated.password,
  });

  if (signInError || !signInData.session) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({
    ok: true,
    session: {
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
    },
  });
}
