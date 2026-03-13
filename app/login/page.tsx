"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { getCurrentSession, loginWithPhone } from "@/lib/auth-client";

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/features";
  }

  return raw;
}

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState("/features");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeNextPath(params.get("next")));
  }, []);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      router.replace(nextPath);
    }
  }, [router, nextPath]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await loginWithPhone({ phone, password, remember });
      router.push(nextPath);
    } catch (err) {
      const message = err instanceof Error ? err.message : "登录失败，请重试";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff4e8_0%,_#f8fafc_45%,_#eef2ff_100%)] px-6 py-10 text-slate-900">
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
          <span className="hidden text-sm font-semibold text-[#ec5b13] sm:block">登录</span>
          <Link href="/register" className="rounded-lg bg-[#ec5b13] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d6500f]">
            免费注册
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section>
          <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">
            欢迎回来，
            <span className="block text-[#ec5b13]">继续优化你的下一份 Offer 简历</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">登录后可直接进入功能页，管理优化记录、简历模板和匹配评分结果。</p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-sm font-semibold">岗位匹配分析</p>
              <p className="mt-1 text-xs text-slate-500">给出 ATS 匹配分，自动提取技能缺口。</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-sm font-semibold">简历智能改写</p>
              <p className="mt-1 text-xs text-slate-500">突出量化成果，减少冗余表述。</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur md:p-10">
          <h2 className="text-2xl font-bold">登录账户</h2>
          <p className="mt-1 text-sm text-slate-500">
            还没有账号？
            <Link href={`/register?next=${encodeURIComponent(nextPath)}`} className="ml-1 font-semibold text-[#ec5b13] hover:underline">
              立即注册
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
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
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#ec5b13] focus:ring-[#ec5b13]"
              />
              记住我（30 天免登录）
            </label>

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#ec5b13] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d6500f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "登录中..." : "登录并进入功能页"}
            </button>
          </form>

          <p className="mt-5 text-xs leading-relaxed text-slate-500">登录即表示你同意我们的服务条款与隐私政策。</p>
        </section>
      </div>
    </div>
  );
}







