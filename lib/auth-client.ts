"use client";

import { isValidEmail, isValidMainlandPhone, normalizeEmail, normalizePhone } from "@/lib/auth-identity";

export type AuthSession = {
  userId: string;
  name: string;
  phone: string;
  email: string;
  loginAt: string;
};

export type AccountPlan = "free" | "monthly" | "yearly" | "buyout";

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

const AUTH_CHANGE_EVENT = "resume-auth-change";
const STORAGE_KEY_USERS = "resume_users";
const STORAGE_KEY_SESSION = "resume_session";

let currentSession: AuthSession | null = null;
let currentAccountMeta: AccountMeta | null = null;
let initPromise: Promise<void> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'pwd_' + Math.abs(hash).toString(36) + password.length.toString(36);
}

function getUsers(): Record<string, { user: AuthSession; passwordHash: string; accountMeta: AccountMeta }> {
  if (!isBrowser()) return {};
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : {};
}

function saveUsers(users: Record<string, { user: AuthSession; passwordHash: string; accountMeta: AccountMeta }>): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function getSession(): AuthSession | null {
  if (!isBrowser()) return null;
  const data = localStorage.getItem(STORAGE_KEY_SESSION);
  return data ? JSON.parse(data) : null;
}

function saveSession(session: AuthSession | null): void {
  if (!isBrowser()) return;
  if (session) {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }
}

function emitAuthChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function getMonthlyQuotaByPlan(plan: AccountPlan): number | null {
  if (plan === "free") return 1;
  if (plan === "monthly") return 10;
  if (plan === "yearly") return 50;
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

function syncFromSession(): void {
  const session = getSession();
  if (!session) {
    currentSession = null;
    currentAccountMeta = null;
  } else {
    currentSession = session;
    const users = getUsers();
    currentAccountMeta = users[session.userId]?.accountMeta || createDefaultAccountMeta();
  }
  emitAuthChange();
}

export function initializeAuth(): Promise<void> {
  if (!isBrowser()) {
    return Promise.resolve();
  }

  if (!initPromise) {
    initPromise = Promise.resolve().then(() => {
      syncFromSession();
      initPromise = null;
    });
  }

  return initPromise;
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

export async function registerWithPhone(payload: RegisterPayload): Promise<AuthSession> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持注册");
  }

  validateRegisterPayload(payload);

  const phone = normalizePhone(payload.phone);
  const email = normalizeEmail(payload.email);
  const users = getUsers();

  const existingUser = Object.values(users).find(u => u.user.phone === phone);
  if (existingUser) {
    throw new Error("该手机号已注册，请直接登录");
  }

  const existingEmail = Object.values(users).find(u => u.user.email === email);
  if (existingEmail) {
    throw new Error("该邮箱已注册，请直接登录");
  }

  const userId = generateUserId();
  const session: AuthSession = {
    userId,
    name: payload.name.trim(),
    phone,
    email,
    loginAt: new Date().toISOString(),
  };

  users[userId] = {
    user: session,
    passwordHash: hashPassword(payload.password),
    accountMeta: createDefaultAccountMeta(),
  };

  saveUsers(users);
  saveSession(session);
  currentSession = session;
  currentAccountMeta = users[userId].accountMeta;
  emitAuthChange();

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

  if (!isValidMainlandPhone(phone)) {
    throw new Error("请输入有效的 11 位手机号");
  }

  const users = getUsers();
  const found = Object.values(users).find(u => u.user.phone === phone);

  if (!found) {
    throw new Error("手机号或密码错误，请重试");
  }

  if (found.passwordHash !== hashPassword(payload.password)) {
    throw new Error("手机号或密码错误，请重试");
  }

  found.user.loginAt = new Date().toISOString();
  saveUsers(users);
  saveSession(found.user);
  currentSession = found.user;
  currentAccountMeta = found.accountMeta;
  emitAuthChange();

  return found.user;
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

  if (!currentSession) {
    throw new Error("请先登录后再修改资料");
  }

  const name = payload.name.trim();
  if (name.length < 2) {
    throw new Error("昵称至少需要 2 个字符");
  }

  const users = getUsers();
  if (!users[currentSession.userId]) {
    throw new Error("用户不存在");
  }

  users[currentSession.userId].user.name = name;
  saveUsers(users);

  currentSession = users[currentSession.userId].user;
  saveSession(currentSession);
  emitAuthChange();

  return currentSession;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  if (!isBrowser()) {
    throw new Error("当前环境不支持修改密码");
  }

  if (!currentSession) {
    throw new Error("请先登录后再修改密码");
  }

  if (payload.password.length < 6) {
    throw new Error("密码至少 6 位");
  }

  const users = getUsers();
  if (!users[currentSession.userId]) {
    throw new Error("用户不存在");
  }

  users[currentSession.userId].passwordHash = hashPassword(payload.password);
  saveUsers(users);
}

export async function setCurrentPlan(plan: AccountPlan): Promise<AccountMeta | null> {
  if (!isBrowser()) return null;

  if (!currentSession) {
    return null;
  }

  const users = getUsers();
  if (!users[currentSession.userId]) {
    return null;
  }

  const nextMeta: AccountMeta = {
    plan,
    monthlyQuota: getMonthlyQuotaByPlan(plan),
    monthlyUsed: currentAccountMeta?.monthlyUsed ?? 0,
    updatedAt: new Date().toISOString(),
  };

  if (nextMeta.monthlyQuota !== null && nextMeta.monthlyUsed > nextMeta.monthlyQuota) {
    nextMeta.monthlyUsed = nextMeta.monthlyQuota;
  }

  users[currentSession.userId].accountMeta = nextMeta;
  saveUsers(users);
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
  if (!isBrowser()) return;

  saveSession(null);
  currentSession = null;
  currentAccountMeta = null;
  emitAuthChange();
}

export function subscribeAuthChange(listener: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }

  const handleAuthChange = () => listener();
  window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  };
}
