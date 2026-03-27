"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import SiteFrame from "@/components/SiteFrame";
import {
  changePassword,
  getCurrentAccountMeta,
  getCurrentSession,
  getPlanDisplayName,
  getQuotaDisplay,
  initializeAuth,
  subscribeAuthChange,
  updateCurrentProfile,
  type AccountMeta,
  type AuthSession,
} from "@/lib/auth-client";
import { siteContainerClass } from "@/lib/site-layout";

function getProfileErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "保存失败，请稍后重试。";
  }

  const message = error.message.trim();
  if (!message) {
    return "保存失败，请稍后重试。";
  }

  if (message.includes("昵称至少需要")) {
    return "昵称至少需要 2 个字符。";
  }

  return message;
}

function getPasswordErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "修改密码失败，请稍后重试。";
  }

  const message = error.message.trim();
  if (!message) {
    return "修改密码失败，请稍后重试。";
  }

  if (message.includes("密码至少")) {
    return "密码长度不足，请输入至少 6 位密码。";
  }

  return message;
}

function getPasswordStrength(password: string): string {
  if (password.length < 6) return "弱";

  const rules = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z\d]/];
  const passed = rules.filter((rule) => rule.test(password)).length;

  if (passed <= 1) return "弱";
  if (passed <= 2) return "中";
  return "强";
}

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [accountMeta, setAccountMeta] = useState<AccountMeta | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [name, setName] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    const syncAuthState = () => {
      const currentSession = getCurrentSession();
      const currentMeta = getCurrentAccountMeta();
      setSession(currentSession);
      setAccountMeta(currentMeta);
      setName(currentSession?.name ?? "");
      setIsReady(true);

      if (!currentSession) {
        router.replace("/login?next=/account");
      }
    };

    syncAuthState();
    void initializeAuth().then(syncAuthState).catch(syncAuthState);
    return subscribeAuthChange(syncAuthState);
  }, [router]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setIsSavingProfile(true);

    try {
      const nextSession = await updateCurrentProfile({ name });
      setName(nextSession.name);
      setProfileSuccess("账户资料已更新。");
    } catch (error) {
      setProfileError(getProfileErrorMessage(error));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (password.length < 6) {
      setPasswordError("密码长度不足，请输入至少 6 位密码。");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("两次输入的密码不一致，请重新确认。");
      return;
    }

    setIsSavingPassword(true);

    try {
      await changePassword({ password });
      setPassword("");
      setConfirmPassword("");
      setPasswordSuccess("密码已更新，下次登录时会使用新密码。");
    } catch (error) {
      setPasswordError(getPasswordErrorMessage(error));
    } finally {
      setIsSavingPassword(false);
    }
  }

  if (!isReady || !session) {
    return (
      <SiteFrame currentPath="/account" mainClassName="pb-6">
        <section className="px-6 py-12">
          <div className={`${siteContainerClass()} rounded-[28px] border border-stone-200 bg-white/80 px-6 py-8 text-sm text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.06)]`}>
            正在加载账户信息...
          </div>
        </section>
      </SiteFrame>
    );
  }

  const planName = accountMeta ? getPlanDisplayName(accountMeta.plan) : "免费版";
  const quotaText = accountMeta ? getQuotaDisplay(accountMeta) : "3 / 3 次";

  return (
    <SiteFrame currentPath="/account" mainClassName="pb-8">
      <section className="px-6 pb-12 pt-8">
        <div className={`${siteContainerClass()} grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]`}>
          <aside className="rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.86)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Account Overview</p>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900">账户中心</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">在这里管理昵称、查看登录信息，以及处理修改密码和找回密码相关操作。</p>

            <div className="mt-6 space-y-3">
              <div className="rounded-[22px] bg-[#f8f4ed] px-4 py-3">
                <p className="text-xs text-slate-500">手机号</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{session.phone}</p>
              </div>
              <div className="rounded-[22px] bg-[#f8f4ed] px-4 py-3">
                <p className="text-xs text-slate-500">找回邮箱</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{session.email}</p>
              </div>
              <div className="rounded-[22px] bg-[#f8f4ed] px-4 py-3">
                <p className="text-xs text-slate-500">当前套餐</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{planName}</p>
              </div>
              <div className="rounded-[22px] bg-[#f8f4ed] px-4 py-3">
                <p className="text-xs text-slate-500">套餐额度</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{quotaText}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/forgot-password" className="font-semibold text-[#b85c2c] hover:text-slate-900">
                找回密码
              </Link>
              <Link href="/features" className="font-semibold text-slate-600 hover:text-slate-900">
                返回工作台
              </Link>
            </div>
          </aside>

          <div className="grid gap-6">
            <section className="rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.88)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Profile</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">用户信息</h2>
              <p className="mt-2 text-sm text-slate-500">手机号和找回邮箱作为账户标识保留，当前支持直接修改昵称。</p>

              <form className="mt-8 space-y-5" onSubmit={handleProfileSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">昵称</span>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(event) => {
                      setProfileError(null);
                      setProfileSuccess(null);
                      setName(event.target.value);
                    }}
                    className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-stone-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">手机号</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{session.phone}</p>
                  </div>
                  <div className="rounded-[22px] border border-stone-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">找回邮箱</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{session.email}</p>
                  </div>
                </div>

                {profileError ? (
                  <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">
                    {profileError}
                  </div>
                ) : null}

                {profileSuccess ? (
                  <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700" role="status">
                    {profileSuccess}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingProfile ? "保存中..." : "保存资料"}
                </button>
              </form>
            </section>

            <section className="rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.88)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Security</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">密码与安全</h2>
              <p className="mt-2 text-sm text-slate-500">已登录状态下可直接修改密码；如果忘记密码，也可以通过找回邮箱重置。</p>

              <form className="mt-8 space-y-5" onSubmit={handlePasswordSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">新密码</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => {
                        setPasswordError(null);
                        setPasswordSuccess(null);
                        setPassword(event.target.value);
                      }}
                      placeholder="至少 6 位，建议包含大小写和数字"
                      className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-500 transition hover:bg-[#f7efe6] hover:text-slate-700"
                      aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">密码强度：{passwordStrength}</p>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">确认新密码</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setPasswordError(null);
                      setPasswordSuccess(null);
                      setConfirmPassword(event.target.value);
                    }}
                    placeholder="请再次输入新密码"
                    className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                  />
                </label>

                {passwordError ? (
                  <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">
                    {passwordError}
                  </div>
                ) : null}

                {passwordSuccess ? (
                  <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700" role="status">
                    {passwordSuccess}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingPassword ? "更新中..." : "修改密码"}
                  </button>

                  <Link href="/forgot-password" className="text-sm font-semibold text-[#b85c2c] hover:text-slate-900">
                    忘记密码？去邮箱找回
                  </Link>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
