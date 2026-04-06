"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import SiteFrame from "@/components/SiteFrame";
import { getCurrentSession, initializeAuth, loginWithPhone } from "@/lib/auth-client";
import { isValidMainlandPhone, normalizePhone } from "@/lib/auth-identity";
import { siteContainerClass } from "@/lib/site-layout";

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/features";
  }

  return raw;
}

function getLoginErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "登录失败，请稍后重试。";
  }

  const message = error.message.trim();
  if (!message) {
    return "登录失败，请稍后重试。";
  }

  if (message.includes("手机号或密码错误")) {
    return "手机号或密码错误，请重新输入。";
  }

  if (message.includes("请填写手机号和密码")) {
    return "请输入手机号和密码后再登录。";
  }

  if (message.includes("请输入有效的 11 位手机号")) {
    return "手机号格式不正确，请输入有效的 11 位中国大陆手机号。";
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "网络连接失败，请检查网络后重试。";
  }

  return message;
}

const benefits = [
  {
    title: "岗位匹配分析",
    description: "给出 ATS 匹配评分，自动提取技能缺口。",
  },
  {
    title: "简历智能改写",
    description: "突出量化成果，减少冗余表达。",
  },
  {
    title: "模板联动制作",
    description: "优化完成后可继续进入制作页完成排版导出。",
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
  const [notice, setNotice] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState("/features");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeNextPath(params.get("next")));
    if (params.get("reset") === "success") {
      setNotice("密码已更新，请使用新密码重新登录。");
    }
  }, []);

  useEffect(() => {
    const syncSession = () => {
      const session = getCurrentSession();
      if (session) {
        router.replace(nextPath);
      }
    };

    syncSession();
    void initializeAuth().then(syncSession).catch(() => undefined);
  }, [router, nextPath]);

  function clearFeedback() {
    if (error) setError(null);
    if (notice) setNotice(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedPhone = normalizePhone(phone);

    if (!isValidMainlandPhone(normalizedPhone)) {
      setError("手机号格式不正确，请输入有效的 11 位中国大陆手机号。");
      return;
    }

    if (!password.trim()) {
      setError("请输入密码后再登录。");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithPhone({ phone: normalizedPhone, password, remember });
      router.push(nextPath);
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteFrame currentPath="/login" mainClassName="pb-6">
      <section className="px-6 pb-12 pt-8">
        <div className={`${siteContainerClass()} grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_460px]`}>
          <section className="order-last rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.8)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur lg:order-none md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Welcome Back</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">
              回到你的简历工作台，
              <span className="block text-[#b85c2c]">继续推进下一份 Offer。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              继续使用手机号和密码登录；找回密码时，系统会把重置邮件发送到你的注册邮箱。
            </p>

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
                  onChange={(event) => {
                    clearFeedback();
                    setPhone(event.target.value);
                  }}
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
                    onChange={(event) => {
                      clearFeedback();
                      setPassword(event.target.value);
                    }}
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

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-[#b85c2c] focus:ring-[#b85c2c]"
                  />
                  记住我（30 天内免登录）
                </label>

                <Link href="/forgot-password" className="font-semibold text-[#b85c2c] hover:text-slate-900">
                  忘记密码？
                </Link>
              </div>

              {error ? (
                <div
                  className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              {notice ? (
                <div
                  className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
                  role="status"
                >
                  {notice}
                </div>
              ) : null}

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
