"use client";

type StoredUser = {
  id: string;
  name: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export type AuthSession = {
  userId: string;
  name: string;
  phone: string;
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

type RawAccountMeta = {
  plan?: LegacyAccountPlan;
  monthlyQuota?: number | null;
  monthlyUsed?: number;
  updatedAt?: string;
};

type RegisterPayload = {
  name: string;
  phone: string;
  password: string;
};

type LoginPayload = {
  phone: string;
  password: string;
  remember: boolean;
};

type AccountMetaMap = Record<string, AccountMeta>;

const USERS_KEY = "resume_app_users_v1";
const SESSION_KEY = "resume_app_session_v1";
const ACCOUNT_META_KEY = "resume_app_account_meta_v1";
const AUTH_CHANGE_EVENT = "resume-auth-change";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("86")) {
    return digits.slice(2);
  }

  return digits;
}

function isValidMainlandPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

function readJson<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown): void {
  storage.setItem(key, JSON.stringify(value));
}

function emitAuthChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
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
    typeof raw?.monthlyQuota === "number" || raw?.monthlyQuota === null ? raw.monthlyQuota : getMonthlyQuotaByPlan(normalizedPlan);
  const monthlyUsed = typeof raw?.monthlyUsed === "number" && Number.isFinite(raw.monthlyUsed) ? Math.max(0, Math.floor(raw.monthlyUsed)) : 0;

  return {
    plan: normalizedPlan,
    monthlyQuota,
    monthlyUsed: monthlyQuota === null ? monthlyUsed : Math.min(monthlyUsed, monthlyQuota),
    updatedAt: typeof raw?.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
  };
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  const users = readJson<StoredUser[]>(window.localStorage, USERS_KEY);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users: StoredUser[]): void {
  if (!isBrowser()) return;
  writeJson(window.localStorage, USERS_KEY, users);
}

function readAccountMetaMap(): AccountMetaMap {
  if (!isBrowser()) return {};

  const raw = readJson<AccountMetaMap>(window.localStorage, ACCOUNT_META_KEY);
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const result: AccountMetaMap = {};
  Object.entries(raw).forEach(([userId, meta]) => {
    if (!userId) return;
    result[userId] = normalizeAccountMeta(meta);
  });

  return result;
}

function saveAccountMetaMap(metaMap: AccountMetaMap): void {
  if (!isBrowser()) return;
  writeJson(window.localStorage, ACCOUNT_META_KEY, metaMap);
}

function ensureUserAccountMeta(userId: string): AccountMeta {
  if (!isBrowser()) {
    return createDefaultAccountMeta();
  }

  const metaMap = readAccountMetaMap();
  const existing = metaMap[userId];
  if (existing) {
    return existing;
  }

  const created = createDefaultAccountMeta();
  metaMap[userId] = created;
  saveAccountMetaMap(metaMap);
  return created;
}

function setUserAccountMeta(userId: string, nextMeta: AccountMeta): void {
  if (!isBrowser()) return;

  const metaMap = readAccountMetaMap();
  metaMap[userId] = normalizeAccountMeta(nextMeta);
  saveAccountMetaMap(metaMap);
}

function saveSession(session: AuthSession, remember: boolean): void {
  if (!isBrowser()) return;

  if (remember) {
    writeJson(window.localStorage, SESSION_KEY, session);
    window.sessionStorage.removeItem(SESSION_KEY);
    emitAuthChange();
    return;
  }

  writeJson(window.sessionStorage, SESSION_KEY, session);
  window.localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

function createSession(user: StoredUser): AuthSession {
  return {
    userId: user.id,
    name: user.name,
    phone: user.phone,
    loginAt: new Date().toISOString(),
  };
}

function fallbackHash(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return `f${Math.abs(hash).toString(16)}`;
}

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const input = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", input);
    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  }

  return fallbackHash(password);
}

function validateRegisterPayload(payload: RegisterPayload): void {
  if (payload.name.trim().length < 2) {
    throw new Error("昵称至少 2 个字符");
  }

  const phone = normalizePhone(payload.phone);
  if (!isValidMainlandPhone(phone)) {
    throw new Error("请输入有效的 11 位手机号");
  }

  if (payload.password.length < 8) {
    throw new Error("密码至少 8 位");
  }
}

export async function registerWithPhone(payload: RegisterPayload): Promise<AuthSession> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持注册");
  }

  validateRegisterPayload(payload);

  const users = readUsers();
  const phone = normalizePhone(payload.phone);
  const existed = users.some((user) => user.phone === phone);
  if (existed) {
    throw new Error("该手机号已注册，请直接登录");
  }

  const user: StoredUser = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name: payload.name.trim(),
    phone,
    passwordHash: await hashPassword(payload.password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  ensureUserAccountMeta(user.id);

  const session = createSession(user);
  saveSession(session, true);
  return session;
}

export async function loginWithPhone(payload: LoginPayload): Promise<AuthSession> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持登录");
  }

  const phone = normalizePhone(payload.phone);
  if (!phone || payload.password.trim().length === 0) {
    throw new Error("请填写手机号和密码");
  }

  const users = readUsers();
  const targetUser = users.find((user) => user.phone === phone);

  if (!targetUser) {
    throw new Error("账户不存在，请先注册");
  }

  const passwordHash = await hashPassword(payload.password);
  if (passwordHash !== targetUser.passwordHash) {
    throw new Error("密码错误，请重试");
  }

  ensureUserAccountMeta(targetUser.id);

  const session = createSession(targetUser);
  saveSession(session, payload.remember);
  return session;
}

export function getCurrentSession(): AuthSession | null {
  if (!isBrowser()) return null;

  const localSession = readJson<AuthSession>(window.localStorage, SESSION_KEY);
  if (localSession) return localSession;

  const sessionSession = readJson<AuthSession>(window.sessionStorage, SESSION_KEY);
  return sessionSession ?? null;
}

export function getCurrentAccountMeta(): AccountMeta | null {
  if (!isBrowser()) return null;

  const session = getCurrentSession();
  if (!session) {
    return null;
  }

  return ensureUserAccountMeta(session.userId);
}

export function setCurrentPlan(plan: AccountPlan): AccountMeta | null {
  if (!isBrowser()) return null;

  const session = getCurrentSession();
  if (!session) {
    return null;
  }

  const currentMeta = ensureUserAccountMeta(session.userId);
  const nextMeta: AccountMeta = {
    ...currentMeta,
    plan,
    monthlyQuota: getMonthlyQuotaByPlan(plan),
    updatedAt: new Date().toISOString(),
  };

  if (nextMeta.monthlyQuota !== null && nextMeta.monthlyUsed > nextMeta.monthlyQuota) {
    nextMeta.monthlyUsed = nextMeta.monthlyQuota;
  }

  setUserAccountMeta(session.userId, nextMeta);
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

export function logout(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

export function subscribeAuthChange(listener: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleAuthChange = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY || event.key === ACCOUNT_META_KEY) {
      listener();
    }
  };

  window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.removeEventListener("storage", handleStorage);
  };
}
