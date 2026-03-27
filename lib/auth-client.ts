"use client";

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import { isValidEmail, isValidMainlandPhone, normalizeEmail, normalizePhone } from "@/lib/auth-identity";
import { clearAuthStoragePersistence, createClient, setAuthStoragePersistence } from "@/lib/supabase/client";

export type AuthSession = {
  userId: string;
  name: string;
  phone: string;
  email: string;
  loginAt: string;
};

export type AccountPlan = "free" | "monthly" | "yearly" | "buyout";
type LegacyAccountPlan = AccountPlan | "pro" | "lifetime";

export type AccountMeta = {
  plan: AccountPlan;
  monthlyQuota: number | null;
  monthlyUsed: number;
  updatedAt: string;
};

type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type LoginPayload = {
  phone: string;
  password: string;
  remember: boolean;
};

type UpdateProfilePayload = {
  name: string;
};

type ChangePasswordPayload = {
  password: string;
};

type RawAccountMeta = {
  plan?: LegacyAccountPlan | string | null;
  monthly_quota?: number | null;
  monthly_used?: number | null;
  updated_at?: string | null;
};

type AuthApiSessionPayload = {
  accessToken: string;
  refreshToken: string;
};

type RegisterApiPayload = {
  ok?: boolean;
  session?: AuthApiSessionPayload;
};

const AUTH_CHANGE_EVENT = "resume-auth-change";

let currentSession: AuthSession | null = null;
let currentAccountMeta: AccountMeta | null = null;
let initPromise: Promise<void> | null = null;
let authSubscriptionStarted = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error("尚未配置 Supabase 环境变量，请先补全 .env.local");
  }
}

function emitAuthChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function formatPhoneForDisplay(raw: string | null | undefined): string {
  return normalizePhone(raw ?? "");
}

function getMonthlyQuotaByPlan(plan: AccountPlan): number | null {
  if (plan === "free") return 3;
  if (plan === "monthly") return 120;
  if (plan === "yearly") return 240;
  return null;
}

function createDefaultAccountMeta(plan: AccountPlan = "free"): AccountMeta {
  return {
    plan,
    monthlyQuota: getMonthlyQuotaByPlan(plan),
    monthlyUsed: 0,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeAccountMeta(raw: RawAccountMeta | null | undefined): AccountMeta {
  const plan =
    raw?.plan === "monthly" ||
    raw?.plan === "yearly" ||
    raw?.plan === "buyout" ||
    raw?.plan === "pro" ||
    raw?.plan === "lifetime"
      ? raw.plan
      : "free";

  const normalizedPlan: AccountPlan =
    plan === "pro" ? "monthly" : plan === "lifetime" ? "buyout" : plan;
  const monthlyQuota =
    typeof raw?.monthly_quota === "number" || raw?.monthly_quota === null
      ? raw.monthly_quota
      : getMonthlyQuotaByPlan(normalizedPlan);
  const monthlyUsed =
    typeof raw?.monthly_used === "number" && Number.isFinite(raw.monthly_used)
      ? Math.max(0, Math.floor(raw.monthly_used))
      : 0;

  return {
    plan: normalizedPlan,
    monthlyQuota,
    monthlyUsed: monthlyQuota === null ? monthlyUsed : Math.min(monthlyUsed, monthlyQuota),
    updatedAt: typeof raw?.updated_at === "string" ? raw.updated_at : new Date().toISOString(),
  };
}

function mapUserToSession(user: User): AuthSession {
  const metadata = user.user_metadata as { name?: string; phone?: string; email?: string } | undefined;
  const name = typeof metadata?.name === "string" && metadata.name.trim().length >= 2 ? metadata.name.trim() : "用户";
  const phone = formatPhoneForDisplay(user.phone ?? metadata?.phone);
  const email =
    typeof user.email === "string" && user.email.trim()
      ? user.email.trim().toLowerCase()
      : normalizeEmail(metadata?.email ?? "");

  return {
    userId: user.id,
    name,
    phone,
    email,
    loginAt: user.last_sign_in_at ?? new Date().toISOString(),
  };
}

async function readAccountMeta(userId: string): Promise<AccountMeta> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("plan, monthly_quota, monthly_used, updated_at")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return createDefaultAccountMeta();
    }

    throw new Error("读取用户资料失败，请检查 profiles 表是否已创建");
  }

  return normalizeAccountMeta(data);
}

async function syncFromSession(session: Session | null): Promise<void> {
  if (!session?.user) {
    currentSession = null;
    currentAccountMeta = null;
    emitAuthChange();
    return;
  }

  currentSession = mapUserToSession(session.user);

  try {
    currentAccountMeta = await readAccountMeta(session.user.id);
  } catch {
    currentAccountMeta = createDefaultAccountMeta();
  }

  emitAuthChange();
}

function ensureAuthSubscription(): void {
  if (!isBrowser() || authSubscriptionStarted || !isSupabaseConfigured()) {
    return;
  }

  const supabase = createClient();
  supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    void syncFromSession(session);
  });
  authSubscriptionStarted = true;
}

async function refreshAuthState(): Promise<void> {
  if (!isBrowser()) {
    return;
  }

  if (!isSupabaseConfigured()) {
    currentSession = null;
    currentAccountMeta = null;
    emitAuthChange();
    return;
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("读取登录状态失败，请稍后重试");
  }

  await syncFromSession(data.session ?? null);
}

async function parseApiError(response: Response, fallbackMessage: string): Promise<never> {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  throw new Error(payload?.error ?? fallbackMessage);
}

async function applyAuthSession(payload: AuthApiSessionPayload, remember: boolean): Promise<void> {
  setAuthStoragePersistence(remember);

  const supabase = createClient();
  const { error } = await supabase.auth.setSession({
    access_token: payload.accessToken,
    refresh_token: payload.refreshToken,
  });

  if (error) {
    throw new Error("登录成功，但同步浏览器会话失败，请重新登录");
  }
}

function validateRegisterPayload(payload: RegisterPayload): void {
  if (payload.name.trim().length < 2) {
    throw new Error("昵称至少需要 2 个字符");
  }

  const phone = normalizePhone(payload.phone);
  if (!isValidMainlandPhone(phone)) {
    throw new Error("请输入有效的 11 位手机号");
  }

  const email = normalizeEmail(payload.email);
  if (!isValidEmail(email)) {
    throw new Error("请输入有效的邮箱地址");
  }

  if (payload.password.length < 6) {
    throw new Error("密码至少 6 位");
  }
}

export function initializeAuth(): Promise<void> {
  if (!isBrowser()) {
    return Promise.resolve();
  }

  ensureAuthSubscription();

  if (!initPromise) {
    initPromise = refreshAuthState().finally(() => {
      initPromise = null;
    });
  }

  return initPromise;
}

export async function registerWithPhone(payload: RegisterPayload): Promise<AuthSession> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持注册");
  }

  assertSupabaseConfigured();
  validateRegisterPayload(payload);

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      phone: normalizePhone(payload.phone),
      email: normalizeEmail(payload.email),
      password: payload.password,
    }),
  });

  if (!response.ok) {
    await parseApiError(response, "注册失败，请稍后再试");
  }

  const payloadData = (await response.json().catch(() => null)) as RegisterApiPayload | null;
  if (payloadData?.session?.accessToken && payloadData.session.refreshToken) {
    await applyAuthSession(payloadData.session, true);
    await refreshAuthState();

    if (!currentSession) {
      throw new Error("注册成功，但未能读取登录状态");
    }

    return currentSession;
  }

  return loginWithPhone({
    phone: normalizePhone(payload.phone),
    password: payload.password,
    remember: true,
  });
}

export async function loginWithPhone(payload: LoginPayload): Promise<AuthSession> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持登录");
  }

  assertSupabaseConfigured();

  const phone = normalizePhone(payload.phone);
  if (!phone || payload.password.trim().length === 0) {
    throw new Error("请填写手机号和密码");
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      password: payload.password,
    }),
  });

  if (!response.ok) {
    await parseApiError(response, "登录失败，请稍后重试");
  }

  const payloadData = (await response.json()) as { session?: AuthApiSessionPayload };
  if (!payloadData.session?.accessToken || !payloadData.session?.refreshToken) {
    throw new Error("登录成功，但未获取到有效会话，请重试");
  }

  await applyAuthSession(payloadData.session, payload.remember);
  await refreshAuthState();

  if (!currentSession) {
    throw new Error("登录成功，但未能读取登录状态");
  }

  return currentSession;
}

export function getCurrentSession(): AuthSession | null {
  return currentSession;
}

export function getCurrentAccountMeta(): AccountMeta | null {
  return currentAccountMeta;
}

export async function updateCurrentProfile(payload: UpdateProfilePayload): Promise<AuthSession> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持修改资料");
  }

  assertSupabaseConfigured();
  await initializeAuth();

  if (!currentSession) {
    throw new Error("请先登录后再修改资料");
  }

  const name = payload.name.trim();
  if (name.length < 2) {
    throw new Error("昵称至少需要 2 个字符");
  }

  const supabase = createClient();
  const { error: userError } = await supabase.auth.updateUser({
    data: {
      name,
      phone: currentSession.phone,
      email: currentSession.email,
    },
  });

  if (userError) {
    throw new Error(userError.message || "更新账户资料失败，请稍后再试");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: currentSession.userId,
    name,
    phone: currentSession.phone,
    email: currentSession.email,
    plan: currentAccountMeta?.plan ?? "free",
    monthly_quota: currentAccountMeta?.monthlyQuota ?? getMonthlyQuotaByPlan("free"),
    monthly_used: currentAccountMeta?.monthlyUsed ?? 0,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    throw new Error("更新账户资料失败，请检查 profiles 表和 RLS 策略");
  }

  await refreshAuthState();

  if (!currentSession) {
    throw new Error("资料已更新，但未能同步最新登录状态");
  }

  return currentSession;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持修改密码");
  }

  assertSupabaseConfigured();
  await initializeAuth();

  if (!currentSession) {
    throw new Error("请先登录后再修改密码");
  }

  if (payload.password.length < 6) {
    throw new Error("密码至少 6 位");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: payload.password });

  if (error) {
    throw new Error(error.message || "修改密码失败，请稍后再试");
  }
}

export async function setCurrentPlan(plan: AccountPlan): Promise<AccountMeta | null> {
  if (!isBrowser()) return null;

  assertSupabaseConfigured();
  await initializeAuth();

  if (!currentSession) {
    return null;
  }

  const supabase = createClient();
  const nextMeta: AccountMeta = {
    plan,
    monthlyQuota: getMonthlyQuotaByPlan(plan),
    monthlyUsed: currentAccountMeta?.monthlyUsed ?? 0,
    updatedAt: new Date().toISOString(),
  };

  if (nextMeta.monthlyQuota !== null && nextMeta.monthlyUsed > nextMeta.monthlyQuota) {
    nextMeta.monthlyUsed = nextMeta.monthlyQuota;
  }

  const { error } = await supabase.from("profiles").upsert({
    id: currentSession.userId,
    name: currentSession.name,
    phone: currentSession.phone,
    email: currentSession.email,
    plan: nextMeta.plan,
    monthly_quota: nextMeta.monthlyQuota,
    monthly_used: nextMeta.monthlyUsed,
    updated_at: nextMeta.updatedAt,
  });

  if (error) {
    throw new Error("更新套餐失败，请检查 profiles 表和 RLS 策略");
  }

  currentAccountMeta = nextMeta;
  emitAuthChange();
  return nextMeta;
}

export function getPlanDisplayName(plan: AccountPlan): string {
  if (plan === "monthly") return "月付版";
  if (plan === "yearly") return "年付版";
  if (plan === "buyout") return "买断版";
  return "免费版";
}

export function getQuotaDisplay(meta: AccountMeta): string {
  if (meta.monthlyQuota === null) {
    return "不限次数";
  }

  const remaining = Math.max(0, meta.monthlyQuota - meta.monthlyUsed);
  return `${remaining} / ${meta.monthlyQuota} 次`;
}

export async function logout(): Promise<void> {
  if (!isBrowser() || !isSupabaseConfigured()) return;

  const supabase = createClient();
  await supabase.auth.signOut();
  clearAuthStoragePersistence();
  currentSession = null;
  currentAccountMeta = null;
  emitAuthChange();
}

export function subscribeAuthChange(listener: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  ensureAuthSubscription();

  const handleAuthChange = () => listener();
  window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  };
}
