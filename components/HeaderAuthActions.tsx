"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getCurrentAccountMeta,
  getCurrentSession,
  getPlanDisplayName,
  getQuotaDisplay,
  initializeAuth,
  logout,
  subscribeAuthChange,
  type AccountMeta,
  type AuthSession,
} from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type HeaderAuthActionsProps = {
  className?: string;
  loginClassName?: string;
  registerClassName?: string;
  logoutClassName?: string;
};

function formatLoginTime(loginAt: string): string {
  const date = new Date(loginAt);
  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HeaderAuthActions({ className, loginClassName, registerClassName, logoutClassName }: HeaderAuthActionsProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [accountMeta, setAccountMeta] = useState<AccountMeta | null>(null);

  useEffect(() => {
    const syncAuthState = () => {
      setSession(getCurrentSession());
      setAccountMeta(getCurrentAccountMeta());
    };

    syncAuthState();
    void initializeAuth().then(syncAuthState).catch(() => undefined);
    return subscribeAuthChange(syncAuthState);
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      setSession(null);
      setAccountMeta(null);
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (session) {
    const planName = accountMeta ? getPlanDisplayName(accountMeta.plan) : "免费版";
    const quotaText = accountMeta ? getQuotaDisplay(accountMeta) : "3 / 3 次";

    return (
      <div className={cn("relative", className)}>
        <div className="group relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-[rgba(255,253,250,0.88)] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-stone-300 hover:bg-white"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f7efe6] text-xs font-bold text-[#b85c2c]">
              {session.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-20 truncate">{session.name}</span>
            <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="invisible absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-[24px] border border-stone-200 bg-[rgba(255,253,250,0.96)] p-3 opacity-0 shadow-[0_18px_40px_rgba(15,23,42,0.1)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="rounded-[20px] border border-stone-100 bg-[#f7f1e8] px-3 py-3">
              <p className="text-sm font-bold text-slate-900">{session.name}</p>
              <p className="mt-1 text-xs text-slate-500">{session.phone}</p>
              <p className="mt-1 text-xs text-slate-500">{session.email}</p>
              <p className="mt-1 text-xs text-slate-500">最近登录：{formatLoginTime(session.loginAt)}</p>
            </div>

            <div className="mt-3 border-l-2 border-stone-100 pl-3">
              <div className="space-y-2">
                <div className="rounded-[18px] bg-[#f8f4ed] px-3 py-2">
                  <p className="text-xs text-slate-500">当前套餐</p>
                  <p className="text-sm font-semibold text-slate-800">{planName}</p>
                </div>
                <div className="rounded-[18px] bg-[#f8f4ed] px-3 py-2">
                  <p className="text-xs text-slate-500">套餐额度</p>
                  <p className="text-sm font-semibold text-slate-800">{quotaText}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-2">
              <Link
                href="/account"
                className="inline-flex w-full items-center justify-center rounded-full border border-stone-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f8f4ed]"
              >
                账户中心
              </Link>
              <Link
                href="/forgot-password"
                className="inline-flex w-full items-center justify-center rounded-full border border-stone-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f8f4ed]"
              >
                找回密码
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "mt-3 inline-flex w-full items-center justify-center rounded-full border border-stone-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[#f8f4ed] disabled:cursor-not-allowed disabled:opacity-70",
                logoutClassName,
              )}
            >
              {isLoggingOut ? "退出中..." : "退出登录"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Link href="/login" className={cn("text-sm font-semibold text-slate-600 transition hover:text-[#b85c2c]", loginClassName)}>
        登录
      </Link>
      <Link
        href="/register"
        className={cn(
          "rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-[#b85c2c]",
          registerClassName,
        )}
      >
        免费注册
      </Link>
    </div>
  );
}
