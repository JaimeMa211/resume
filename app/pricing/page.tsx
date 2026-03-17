import Link from "next/link";

import PricingPlanCta from "@/components/PricingPlanCta";
import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";

type Plan = {
  id: "free" | "pro" | "lifetime";
  name: string;
  price: string;
  description: string;
  badge?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "免费版",
    price: "¥0/月",
    description: "适合首次体验和轻量求职用户",
    features: ["每月 3 次 AI 简历优化", "基础岗位匹配评分", "3 套官方模板套版", "导出 PDF"],
    cta: "免费开始",
  },
  {
    id: "pro",
    name: "专业版",
    price: "¥5/月",
    badge: "最受欢迎",
    description: "高性价比月付方案，适合持续投递",
    features: ["每月 120 次 AI 简历优化", "高级关键词建议与改写", "岗位定制化版本管理", "优先模型通道", "邮件支持"],
    cta: "立即升级",
    highlighted: true,
  },
  {
    id: "lifetime",
    name: "终身版",
    price: "¥20/终身",
    description: "一次购买长期使用，适合长期职业发展",
    features: ["终身不限次数优化", "终身模板更新", "专属客服支持"],
    cta: "立即买断",
  },
];

const compareRows = [
  { label: "计费方式", free: "免费", pro: "按月", lifetime: "一次性" },
  { label: "优化次数", free: "每月 3 次", pro: "每月 120 次", lifetime: "终身不限次数" },
  { label: "模板能力", free: "3 套", pro: "全部模板", lifetime: "全部模板 + 终身更新" },
  { label: "岗位匹配分析", free: "基础", pro: "高级", lifetime: "高级" },
  { label: "技术支持", free: "社区", pro: "邮件", lifetime: "专属客服" },
];

const faqs = [
  {
    q: "可以随时取消订阅吗？",
    a: "可以。专业版支持随时取消，下个计费周期不再扣费；终身版为一次性付费，无需续费。",
  },
  {
    q: "免费版是否需要绑定信用卡？",
    a: "不需要。注册即可使用免费额度。",
  },
  {
    q: "终身版是永久可用吗？",
    a: "是的。购买后可长期使用终身版权益，并持续获得模板更新。",
  },
];

const surfaceClass = "rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.82)] shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur";

export default function PricingPage() {
  return (
    <SiteFrame currentPath="/pricing" mainClassName="pb-4">
      <section className="px-6 pb-8 pt-8">
        <div className={siteContainerClass()}>
          <div className="rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.8)] px-7 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:px-10 md:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Pricing Overview</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">清晰、克制、没有干扰项的价格页。</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              价格页的视觉也统一到了制作页的暖色纸面系统，重点只保留方案差异、能力对比和升级入口，减少之前营销页之间的风格跳变。
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className={`${siteContainerClass()} grid gap-6 lg:grid-cols-3`}>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cx(
                `${surfaceClass} p-7`,
                plan.highlighted && "border-[#d7b49f] bg-[linear-gradient(180deg,rgba(255,249,243,0.96)_0%,rgba(247,239,230,0.96)_100%)] shadow-[0_20px_50px_rgba(184,92,44,0.12)]",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">{plan.name}</h2>
                {plan.badge ? <span className="rounded-full bg-[#b85c2c] px-3 py-1 text-xs font-semibold text-white">{plan.badge}</span> : null}
              </div>

              <p className="mt-5 text-4xl font-black tracking-tight text-slate-900">{plan.price}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{plan.description}</p>

              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <PricingPlanCta planId={plan.id} label={plan.cta} highlighted={plan.highlighted} className="mt-8 w-full" />
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-10">
        <div className={`${siteContainerClass()} ${surfaceClass} overflow-hidden p-6 sm:p-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Compare</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">能力对比</h3>
            </div>
            <Link href="/features" className="text-sm font-semibold text-[#b85c2c] transition hover:text-slate-900">
              先进入功能页体验
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-slate-500">
                  <th className="px-3 py-3">能力项</th>
                  <th className="px-3 py-3">免费版</th>
                  <th className="px-3 py-3">专业版</th>
                  <th className="px-3 py-3">终身版</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-stone-100 last:border-none">
                    <td className="px-3 py-4 font-semibold text-slate-800">{row.label}</td>
                    <td className="px-3 py-4 text-slate-600">{row.free}</td>
                    <td className="px-3 py-4 text-slate-600">{row.pro}</td>
                    <td className="px-3 py-4 text-slate-600">{row.lifetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className={siteContainerClass()}>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">FAQ</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">常见问题</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.q} className={`${surfaceClass} p-5`}>
                <h4 className="text-sm font-semibold text-slate-900">{faq.q}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={`${siteContainerClass()} rounded-[34px] bg-slate-900 px-8 py-10 text-center text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]`}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Start Now</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">准备开始提升面试通过率了吗？</h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70">立即注册并获取免费额度，后续可以按投递频率升级为专业版，或直接解锁终身版。</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PricingPlanCta
              planId="free"
              label="免费注册"
              authedLabel="进入功能页"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-[#f7efe6]"
            />
            <Link href="/builder" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14">
              直接进入制作页
            </Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

