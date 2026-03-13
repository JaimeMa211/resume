"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#fff6eb_0%,_#f8fafc_45%,_#eef2ff_100%)] px-6 py-10 text-slate-900">
      <header className="mx-auto mb-10 flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-6 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ec5b13] text-xs font-bold text-white">AI</span>
          <span className="text-sm font-bold sm:text-base">AI 简历助手</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
            首页
          </Link>
          <Link href="/features" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
            功能
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
            价格
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            登录
          </Link>
          <span className="hidden text-sm font-semibold text-[#ec5b13] sm:block">注册</span>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section>
          <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">
            创建账号，
            <span className="block text-[#ec5b13]">开始你的 AI 简历加速流程</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">注册后立即获得免费额度，体验职位匹配评分、关键词补全和优化建议。</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white/85 p-5">
            <h3 className="text-sm font-bold text-slate-800">新用户可立即解锁</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>每月 3 次免费简历优化</li>
              <li>3 套官方模板实时套版预览</li>
              <li>岗位匹配分 + 优化建议摘要</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur md:p-10">
          <h2 className="text-2xl font-bold">注册账户</h2>
          <p className="mt-1 text-sm text-slate-500">
            已有账号？
            <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="ml-1 font-semibold text-[#ec5b13] hover:underline">
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-[#ec5b13] focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-[#ec5b13] focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm focus:border-[#ec5b13] focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">密码强度：{passwordStrength}</p>
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-[#ec5b13] focus:outline-none focus:ring-2 focus:ring-[#ec5b13]/20"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) => setAgree(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#ec5b13] focus:ring-[#ec5b13]"
              />
              我已阅读并同意服务条款与隐私政策
            </label>

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#ec5b13] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d6500f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "注册中..." : "创建账户并开始优化"}
            </button>
          </form>

          <p className="mt-5 text-xs leading-relaxed text-slate-500">当前注册功能用于本地演示环境，账号信息会保存在当前浏览器中。</p>
        </section>
      </div>
    </div>
  );
}






