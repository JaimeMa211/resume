"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import SiteFrame from "@/components/SiteFrame";
import { initializeAuth, logout } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";
import { siteContainerClass } from "@/lib/site-layout";

function getPasswordStrength(password: string): string {
  if (password.length < 6) return "弱";

  const rules = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z\d]/];
  const passed = rules.filter((rule) => rule.test(password)).length;

  if (passed <= 1) return "弱";
  if (passed <= 2) return "中";
  return "强";
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    void initializeAuth()
      .then(() => setIsReady(true))
      .catch(() => {
        setError("当前重置链接无效或已过期，请重新申请。");
        setIsReady(true);
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("密码长度不足，请输入至少 6 位密码。");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致，请重新确认。");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        throw updateError;
      }

      await logout();
      setSuccess("密码已更新，请使用新密码重新登录。");
      window.setTimeout(() => {
        router.push("/login?reset=success");
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "密码重置失败，请稍后重试。";
      setError(message || "密码重置失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteFrame currentPath="/reset-password" mainClassName="pb-6">
      <section className="px-6 pb-12 pt-8">
        <div className={`${siteContainerClass()} grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px]`}>
          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.82)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Reset Password</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">
              设置新的登录密码，
              <span className="block text-[#b85c2c]">手机号登录入口保持不变。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              重置成功后，你仍然使用手机号和新密码登录，真实邮箱只负责接收安全通知和找回链接。
            </p>
          </section>

          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.9)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">重设密码</h2>
            <p className="mt-2 text-sm text-slate-500">
              链接失效了？
              <Link href="/forgot-password" className="ml-1 font-semibold text-[#b85c2c] hover:text-slate-900">
                重新发送
              </Link>
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                      setError(null);
                      setSuccess(null);
                      setPassword(event.target.value);
                    }}
                    placeholder="至少 6 位，建议包含大小写和数字"
                    className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
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
                    setError(null);
                    setSuccess(null);
                    setConfirmPassword(event.target.value);
                  }}
                  placeholder="请再次输入新密码"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

              {!isReady ? (
                <div className="rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  正在校验重置链接，请稍候...
                </div>
              ) : null}

              {error ? (
                <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700" role="status">
                  {success}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!isReady || isSubmitting}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "更新中..." : "保存新密码"}
              </button>
            </form>
          </section>
        </div>
      </section>
    </SiteFrame>
  );
}
