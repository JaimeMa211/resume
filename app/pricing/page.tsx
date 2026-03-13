import Link from "next/link";

import HeaderAuthActions from "@/components/HeaderAuthActions";
import PricingPlanCta from "@/components/PricingPlanCta";

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
  {
    label: "计费方式",
    free: "免费",
    pro: "按月",
    lifetime: "一次性",
  },
  {
    label: "优化次数",
    free: "每月 3 次",
    pro: "每月 120 次",
    lifetime: "终身不限次数",
  },
  {
    label: "模板能力",
    free: "3 套",
    pro: "全部模板",
    lifetime: "全部模板 + 终身更新",
  },
  {
    label: "岗位匹配分析",
    free: "基础",
    pro: "高级",
    lifetime: "高级",
  },
  {
    label: "技术支持",
    free: "社区",
    pro: "邮件",
    lifetime: "专属客服",
  },
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

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
            <Link href="/pricing" className="text-sm font-semibold text-[#ec5b13]">
              价格
            </Link>
          </nav>

          <HeaderAuthActions />
        </div>
      </header>

      <main className="px-6 py-14">
        <section className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">清晰透明的价格方案</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">从免费体验到高频投递，再到一次买断，按求职阶段选择最适合的计划。</p>
        </section>

        <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-7 shadow-sm ${
                plan.highlighted
                  ? "border-[#ec5b13] bg-[#fff7f3] shadow-[0_18px_40px_rgba(236,91,19,0.14)]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                {plan.badge ? <span className="rounded-full bg-[#ec5b13] px-2.5 py-1 text-xs font-bold text-white">{plan.badge}</span> : null}
              </div>

              <p className="mt-4 text-3xl font-black">{plan.price}</p>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>

              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              <PricingPlanCta
                planId={plan.id}
                label={plan.cta}
                highlighted={plan.highlighted}
                className="mt-7 w-full"
              />
            </article>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 className="text-xl font-bold">功能对比</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3">能力项</th>
                  <th className="px-3 py-3">免费版</th>
                  <th className="px-3 py-3">专业版</th>
                  <th className="px-3 py-3">终身版</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 last:border-none">
                    <td className="px-3 py-3 font-semibold text-slate-700">{row.label}</td>
                    <td className="px-3 py-3 text-slate-600">{row.free}</td>
                    <td className="px-3 py-3 text-slate-600">{row.pro}</td>
                    <td className="px-3 py-3 text-slate-600">{row.lifetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <h3 className="text-xl font-bold">常见问题</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="text-sm font-bold">{faq.q}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl rounded-3xl bg-[#ec5b13] px-8 py-10 text-center text-white">
          <h3 className="text-3xl font-black">准备开始提升面试通过率了吗？</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">立即注册并获取免费额度，后续可升级专业版或直接解锁终身版。</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PricingPlanCta
              planId="free"
              label="免费注册"
              authedLabel="进入功能页"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#ec5b13] hover:bg-slate-100"
            />
            <Link href="/features" className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20">
              进入功能演示
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

