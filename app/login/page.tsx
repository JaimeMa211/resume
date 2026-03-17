"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";
import { getCurrentSession, loginWithPhone } from "@/lib/auth-client";

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/features";
  }

  return raw;
}

const benefits = [
  {
    title: "岗位匹配分析",
    description: "给出 ATS 匹配分，自动提取技能缺口。",
  },
  {
    title: "简历智能改写",
    description: "突出量化成果，减少冗余表述。",
  },
  {
    title: "模板联动制作",
    description: "优化完后可继续进入制作页完成排版导出。",
  },
];

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
    <SiteFrame currentPath="/login" mainClassName="pb-6">
      <section className="px-6 pb-12 pt-8">
        <div className={`${siteContainerClass()} grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_460px]`}>
          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.8)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Welcome Back</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">
              回到你的简历工作台，
              <span className="block text-[#b85c2c]">继续推进下一份 Offer。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">登录后可直接进入功能页，继续查看优化结果、套用模板并导出 PDF。</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {benefits.map((item) => (
                <article key={item.title} className="rounded-[24px] border border-stone-200 bg-white/80 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.88)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Account Access</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">登录账户</h2>
            <p className="mt-2 text-sm text-slate-500">
              还没有账号？
              <Link href={`/register?next=${encodeURIComponent(nextPath)}`} className="ml-1 font-semibold text-[#b85c2c] hover:text-slate-900">
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
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
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
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-[#b85c2c] focus:ring-[#b85c2c]"
                />
                记住我（30 天免登录）
              </label>

              {error ? <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "登录中..." : "登录并进入工作台"}
              </button>
            </form>

            <p className="mt-5 text-xs leading-6 text-slate-500">登录即表示你同意我们的服务条款与隐私政策。</p>
          </section>
        </div>
      </section>
    </SiteFrame>
  );
}
