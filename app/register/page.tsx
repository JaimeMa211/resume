"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import SiteFrame from "@/components/SiteFrame";
import { siteContainerClass } from "@/lib/site-layout";
import { registerWithPhone } from "@/lib/auth-client";

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/features";
  }

  return raw;
}

function getPasswordStrength(password: string): string {
  if (password.length < 8) return "弱";

  const rules = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z\d]/];
  const passed = rules.filter((rule) => rule.test(password)).length;

  if (passed <= 1) return "弱";
  if (passed <= 2) return "中";
  return "强";
}

const unlockItems = [
  "每月 3 次免费简历优化",
  "3 套官方模板实时套版预览",
  "岗位匹配分与优化建议摘要",
];

export default function RegisterPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/features");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeNextPath(params.get("next")));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!agree) {
      setError("请先同意服务条款与隐私政策");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithPhone({ name, phone, password });
      router.push(nextPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "注册失败，请重试";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteFrame currentPath="/register" mainClassName="pb-6">
      <section className="px-6 pb-12 pt-8">
        <div className={`${siteContainerClass()} grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_480px]`}>
          <section className="order-last rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.8)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur lg:order-none md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Create Account</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">
              创建账号，
              <span className="block text-[#b85c2c]">把你的简历流程放进同一工作台。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">注册后即可体验职位匹配评分、关键词补全、模板联动和 PDF 导出能力。</p>

            <div className="mt-8 rounded-[28px] border border-stone-200 bg-white/80 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <p className="text-sm font-semibold text-slate-900">新用户立即解锁</p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                {unlockItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.88)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Account Setup</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">注册账户</h2>
            <p className="mt-2 text-sm text-slate-500">
              已有账号？
              <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="ml-1 font-semibold text-[#b85c2c] hover:text-slate-900">
                去登录
              </Link>
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">昵称</span>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="请输入昵称"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">手机号</span>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="请输入 11 位手机号"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">密码</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="至少 8 位，建议包含大小写和数字"
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
                <span className="mb-2 block text-sm font-semibold text-slate-700">确认密码</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="请再次输入密码"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#b85c2c] focus:ring-[#b85c2c]"
                />
                我已阅读并同意服务条款与隐私政策
              </label>

              {error ? <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "注册中..." : "创建账户并进入工作台"}
              </button>
            </form>

            <p className="mt-5 text-xs leading-6 text-slate-500">当前注册功能用于本地演示环境，账号信息会保存在当前浏览器中。</p>
          </section>
        </div>
      </section>
    </SiteFrame>
  );
}
