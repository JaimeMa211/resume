"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import SiteFrame from "@/components/SiteFrame";
import { getCurrentSession, initializeAuth, registerWithPhone } from "@/lib/auth-client";
import { isValidEmail, isValidMainlandPhone, normalizeEmail, normalizePhone } from "@/lib/auth-identity";
import { siteContainerClass } from "@/lib/site-layout";

function getSafeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/features";
  }

  return raw;
}

function getPasswordStrength(password: string): string {
  if (password.length < 6) return "弱";

  const rules = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z\d]/];
  const passed = rules.filter((rule) => rule.test(password)).length;

  if (passed <= 1) return "弱";
  if (passed <= 2) return "中";
  return "强";
}

function getRegisterErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "注册失败，请稍后重试。";
  }

  const message = error.message.trim();
  if (!message) {
    return "注册失败，请稍后重试。";
  }

  if (message.includes("该手机号已注册")) {
    return "该手机号已注册，请直接登录或更换手机号。";
  }

  if (message.includes("该邮箱已注册")) {
    return "该邮箱已注册，请直接登录或更换邮箱。";
  }

  if (message.includes("密码至少")) {
    return "密码长度不足，请输入至少 6 位密码。";
  }

  if (message.includes("请输入有效的 11 位手机号")) {
    return "手机号格式不正确，请输入有效的 11 位中国大陆手机号。";
  }

  if (message.includes("请输入有效的邮箱")) {
    return "邮箱格式不正确，请输入有效的邮箱地址。";
  }

  if (message.includes("昵称至少需要")) {
    return "昵称至少需要 2 个字符。";
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "网络连接失败，请检查网络后重试。";
  }

  return message;
}

const unlockItems = [
  "每月 3 次免费简历优化",
  "3 套官方模板实时预览",
  "岗位匹配分与优化建议摘要",
];

export default function RegisterPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/features");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  function clearError() {
    if (error) {
      setError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = normalizeEmail(email);

    if (name.trim().length < 2) {
      setError("昵称至少需要 2 个字符。");
      return;
    }

    if (!isValidMainlandPhone(normalizedPhone)) {
      setError("手机号格式不正确，请输入有效的 11 位中国大陆手机号。");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("邮箱格式不正确，请输入有效的邮箱地址。");
      return;
    }

    if (password.length < 6) {
      setError("密码长度不足，请输入至少 6 位密码。");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致，请重新确认。");
      return;
    }

    if (!agree) {
      setError("请先勾选并同意服务条款与隐私政策。");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithPhone({ name, phone: normalizedPhone, email: normalizedEmail, password });
      router.push(nextPath);
    } catch (err) {
      setError(getRegisterErrorMessage(err));
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
              创建账户，
              <span className="block text-[#b85c2c]">把你的简历流程放进同一个工作台。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              注册后即可体验岗位匹配评分、关键词补全、模板联动和 PDF 导出能力。邮箱会作为你的找回密码邮箱，登录入口仍然保持手机号。
            </p>

            <div className="mt-8 rounded-[28px] border border-stone-200 bg-white/80 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <p className="text-sm font-semibold text-slate-900">新用户立刻解锁</p>
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
                  onChange={(event) => {
                    clearError();
                    setName(event.target.value);
                  }}
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
                  onChange={(event) => {
                    clearError();
                    setPhone(event.target.value);
                  }}
                  placeholder="请输入 11 位手机号"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">找回邮箱</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    clearError();
                    setEmail(event.target.value);
                  }}
                  placeholder="请输入常用邮箱"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
                <p className="mt-2 text-xs text-slate-500">用于找回密码和接收账号安全通知。</p>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">密码</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => {
                      clearError();
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
                <span className="mb-2 block text-sm font-semibold text-slate-700">确认密码</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    clearError();
                    setConfirmPassword(event.target.value);
                  }}
                  placeholder="请再次输入密码"
                  className="w-full rounded-[22px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#b85c2c] focus:ring-4 focus:ring-[#f3d5c2]/60"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => {
                    clearError();
                    setAgree(event.target.checked);
                  }}
                  className="h-4 w-4 rounded border-stone-300 text-[#b85c2c] focus:ring-[#b85c2c]"
                />
                我已阅读并同意服务条款与隐私政策
              </label>

              {error ? (
                <div
                  className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "注册中..." : "创建账户并进入工作台"}
              </button>
            </form>
          </section>
        </div>
      </section>
    </SiteFrame>
  );
}
