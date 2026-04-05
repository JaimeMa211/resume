"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PricingPlanCta from "@/components/PricingPlanCta";
import RedeemCodeDialog from "@/components/RedeemCodeDialog";
import {
  getCurrentAccountMeta,
  getCurrentSession,
  subscribeAuthChange,
  type AuthSession,
  type AccountMeta,
} from "@/lib/auth-client";
import SiteFrame from "@/components/SiteFrame";
import { siteContainerClass } from "@/lib/site-layout";

type Plan = {
  id: "free" | "monthly" | "yearly" | "buyout";
  name: string;
  price: string;
  cycle: string;
  hint: string;
  description: string;
  badge?: string;
  note?: string;
  highlighted?: boolean;
  features: string[];
  cta: string;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "免费版",
    price: "¥0",
    cycle: "",
    hint: "先试用",
    description: "跑通上传、优化、套版和导出。",
    note: "无需绑卡",
    features: ["1 次 / 月 AI 优化", "基础岗位匹配", "3 套模板", "PDF 导出"],
    cta: "免费开始",
  },
  {
    id: "monthly",
    name: "月付版",
    price: "¥9",
    cycle: "/ 月",
    hint: "短期冲刺",
    description: "适合一段时间内高频改简历、密集投递。",
    features: ["10 次 / 月 AI 优化", "全部模板", "岗位定制改写", "优先升级入口"],
    cta: "切到月付版",
  },
  {
    id: "yearly",
    name: "年付版",
    price: "¥79",
    cycle: "/ 年",
    hint: "全年使用",
    description: "更低长期成本，额度更高，适合持续投递。",
    badge: "推荐",
    note: "约 ¥6.6 / 月",
    highlighted: true,
    features: ["50 次 / 月 AI 优化", "全部模板", "岗位定制改写", "优先升级入口"],
    cta: "切到年付版",
  },
  {
    id: "buyout",
    name: "买断版",
    price: "¥99",
    cycle: "",
    hint: "长期保留",
    description: "不再按周期考虑成本，直接长期使用。",
    note: "约等于 11 个月月付",
    features: ["不限次数 AI 优化", "全部模板", "模板持续更新", "买断权益长期可用"],
    cta: "直接买断",
  },
];

const compareRows = [
  { label: "计费方式", free: "免费", monthly: "按月", yearly: "按年", buyout: "一次买断" },
  { label: "优化额度", free: "1 次 / 月", monthly: "10 次 / 月", yearly: "50 次 / 月", buyout: "不限次数" },
  { label: "模板范围", free: "3 套", monthly: "全部模板", yearly: "全部模板", buyout: "全部模板 + 更新" },
  { label: "岗位定制", free: "基础", monthly: "支持", yearly: "支持", buyout: "支持" },
];

const faqs = [
  {
    q: "免费版需要绑卡吗？",
    a: "不需要，注册后就能直接使用。",
  },
  {
    q: "月付和年付差别是什么？",
    a: "核心功能一致，年付额度更高，长期成本更低。",
  },
  {
    q: "买断版还会续费吗？",
    a: "不会，买断后可继续使用对应权益。",
  },
];

const panelClass = "rounded-[30px] border border-stone-200 bg-white";

export default function PricingPage() {
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [accountMeta, setAccountMeta] = useState<AccountMeta | null>(null);

  useEffect(() => {
    return subscribeAuthChange(() => {
      setSession(getCurrentSession());
      setAccountMeta(getCurrentAccountMeta());
    });
  }, []);

  const showRedeemSection = session && accountMeta?.plan === "free";

  return (
    <SiteFrame currentPath="/pricing" mainClassName="pb-8">
      <section className="px-6 pb-8 pt-10">
        <div className={`${siteContainerClass()} grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end`}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a6a4a]">Pricing</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-900 md:text-5xl">简单一点，按使用频率选就够了。</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              免费版先体验，月付适合短期冲刺，年付适合全年投递，买断适合把工具长期留在手边。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`${panelClass} px-5 py-5`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Best Value</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">年付省 ¥29</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">相比连续按月使用一年，年付更直接，也更省心。</p>
            </div>
            <div className={`${panelClass} px-5 py-5`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Buyout</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">¥99 买断</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">大致等于 11 个月月付，适合长期保留这个工具。</p>
            </div>
            <div className={`${panelClass} px-5 py-5`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Start Free</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">先免费开始</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">不用先做购买决定，确认顺手再升级就可以。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className={siteContainerClass()}>
          <div className={`${panelClass} overflow-hidden`}>
            <div className="grid lg:grid-cols-4">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={cx(
                    "flex h-full flex-col border-b border-stone-200 px-6 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0",
                    plan.highlighted && "bg-[#fcf7f2]",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{plan.hint}</p>
                    </div>
                    {plan.badge ? (
                      <span className="rounded-full border border-[#d7b49f] bg-white px-3 py-1 text-[11px] font-semibold text-[#b85c2c]">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-8 flex items-end gap-1.5">
                    <span className="text-5xl font-black tracking-[-0.06em] text-slate-900">{plan.price}</span>
                    {plan.cycle ? <span className="pb-1 text-base text-slate-500">{plan.cycle}</span> : null}
                  </div>
                  <div className="mt-3 min-h-[20px] text-sm font-medium text-[#9a6a4a]">{plan.note ?? ""}</div>

                  <p className="mt-5 min-h-[56px] text-sm leading-7 text-slate-600">{plan.description}</p>

                  <div className="mt-6 space-y-3 text-sm text-slate-700">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-[#b85c2c]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <PricingPlanCta
                    planId={plan.id}
                    label={plan.cta}
                    highlighted={plan.highlighted}
                    className="mt-8 w-full"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className={`${siteContainerClass()} grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_360px]`}>
          <div className={`${panelClass} overflow-hidden p-6 sm:p-8`}>
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Compare</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">功能矩阵</h2>
              </div>
              <Link href="/features" className="text-sm font-semibold text-[#b85c2c] transition hover:text-slate-900">
                查看功能页
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-slate-500">
                    <th className="px-3 py-3 font-semibold">项目</th>
                    <th className="px-3 py-3 font-semibold">免费版</th>
                    <th className="px-3 py-3 font-semibold">月付版</th>
                    <th className="px-3 py-3 font-semibold">年付版</th>
                    <th className="px-3 py-3 font-semibold">买断版</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.label} className="border-b border-stone-100 last:border-none">
                      <td className="px-3 py-4 font-semibold text-slate-800">{row.label}</td>
                      <td className="px-3 py-4 text-slate-600">{row.free}</td>
                      <td className="px-3 py-4 text-slate-600">{row.monthly}</td>
                      <td className="px-3 py-4 text-slate-600">{row.yearly}</td>
                      <td className="px-3 py-4 text-slate-600">{row.buyout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${panelClass} px-6 py-7`}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">FAQ</p>
            <div className="mt-5 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b border-stone-200 pb-5 last:border-none last:pb-0">
                  <h3 className="text-sm font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={`${siteContainerClass()} flex flex-col gap-6 rounded-[30px] border border-stone-200 bg-white px-8 py-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Start</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">先免费开始，确定顺手再升级。</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">不需要先做复杂决定。先用免费版，后面按投递频率切到月付、年付或买断即可。</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PricingPlanCta
              planId="free"
              label="免费注册"
              authedLabel="进入功能页"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-[#b85c2c]"
            />
            <PricingPlanCta
              planId="yearly"
              label="直接上年付"
              authedLabel="切到年付版"
              highlighted
              className="rounded-full px-6 py-3 text-sm font-semibold"
            />
          </div>
        </div>
      </section>

      {showRedeemSection && (
        <section id="redeem" className="px-6 pb-12">
          <div className={siteContainerClass()}>
            <div className="rounded-[30px] border border-stone-200 bg-white px-8 py-8 text-center">
              <h2 className="text-xl font-bold text-slate-900">已有兑换码？</h2>
              <p className="mt-2 text-sm text-slate-500">输入兑换码即可升级会员，无需支付</p>
              <button
                onClick={() => setRedeemOpen(true)}
                className="mt-6 rounded-full bg-[#b85c2c] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#9f4d24]"
              >
                输入兑换码
              </button>
            </div>
          </div>
        </section>
      )}

      <RedeemCodeDialog open={redeemOpen} onOpenChange={setRedeemOpen} />
    </SiteFrame>
  );
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
