"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getCurrentAccountMeta,
  getCurrentSession,
  getPlanDisplayName,
  getQuotaDisplay,
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
    return subscribeAuthChange(syncAuthState);
  }, []);

  function handleLogout() {
    setIsLoggingOut(true);
    logout();
    setSession(null);
    setAccountMeta(null);
    router.push("/");
    router.refresh();
    setIsLoggingOut(false);
  }

  if (session) {
    const planName = accountMeta ? getPlanDisplayName(accountMeta.plan) : "免费版";
    const quotaText = accountMeta ? getQuotaDisplay(accountMeta) : "3 / 3 次";

    return (
      <div className={cn("relative", className)}>
        <div className="group relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ec5b13]/15 text-xs font-bold text-[#ec5b13]">
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

          <div className="invisible absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
              <p className="text-sm font-bold text-slate-900">{session.name}</p>
              <p className="mt-1 text-xs text-slate-500">{session.phone}</p>
              <p className="mt-1 text-xs text-slate-500">最近登录：{formatLoginTime(session.loginAt)}</p>
            </div>

            <div className="mt-3 border-l-2 border-slate-100 pl-3">
              <div className="space-y-2">
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">当前套餐</p>
                  <p className="text-sm font-semibold text-slate-800">{planName}</p>
                </div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs text-slate-500">套餐额度</p>
                  <p className="text-sm font-semibold text-slate-800">{quotaText}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70",
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
      <Link href="/login" className={cn("text-sm font-semibold text-slate-600 hover:text-slate-900", loginClassName)}>
        登录
      </Link>
      <Link
        href="/register"
        className={cn(
          "rounded-lg bg-[#ec5b13] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d6500f]",
          registerClassName,
        )}
      >
        免费注册
      </Link>
    </div>
  );
}
