"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import SiteFrame from "@/components/SiteFrame";
import { isValidMainlandPhone, normalizePhone } from "@/lib/auth-identity";
import { siteContainerClass } from "@/lib/site-layout";

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "发送失败，请稍后重试。";
  }

  const message = error.message.trim();
  if (!message) {
    return "发送失败，请稍后重试。";
  }

  if (message.includes("请输入有效的 11 位手机号")) {
    return "手机号格式不正确，请输入有效的 11 位中国大陆手机号。";
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "网络连接失败，请检查网络后重试。";
  }

  if (message.includes("Supabase 中缺少 profiles 表")) {
    return "Supabase 中缺少 profiles 表，请先在 SQL Editor 执行 supabase/profiles.sql。";
  }

  if (message.includes("profiles 表缺少")) {
    return message;
  }

  if (message.includes("账户资料表访问失败")) {
    return message;
  }

  return message;
}

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const normalizedPhone = normalizePhone(phone);
    if (!isValidMainlandPhone(normalizedPhone)) {
      setError("手机号格式不正确，请输入有效的 11 位中国大陆手机号。");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "发送失败，请稍后重试");
      }

      setSuccess("如果该手机号已绑定账号，我们已经向注册邮箱发送了密码重置邮件。");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteFrame currentPath="/forgot-password" mainClassName="pb-6">
      <section className="px-6 pb-12 pt-8">
        <div className={`${siteContainerClass()} grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px]`}>
          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.82)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Password Recovery</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">
              通过手机号找回密码，
              <span className="block text-[#b85c2c]">重置链接会发到注册邮箱。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              你仍然只需要记住手机号作为登录入口，但安全相关的找回流程会统一发到注册时填写的真实邮箱。
            </p>
          </section>

          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.9)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">发送重置邮件</h2>
            <p className="mt-2 text-sm text-slate-500">
              想起密码了？
              <Link href="/login" className="ml-1 font-semibold text-[#b85c2c] hover:text-slate-900">
                返回登录
              </Link>
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">手机号</span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => {
                    setError(null);
                    setSuccess(null);
                    setPhone(event.target.value);
                  }}
                  placeholder="请输入 11 位手机号"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

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
                disabled={isSubmitting}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "发送中..." : "发送密码重置邮件"}
              </button>
            </form>
          </section>
        </div>
      </section>
    </SiteFrame>
  );
}
