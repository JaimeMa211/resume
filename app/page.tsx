import { ArrowRight, FileText, ScanSearch, Sparkles } from "lucide-react";
import Link from "next/link";

import HomeHighlightPreview from "@/components/HomeHighlightPreview";
import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";

const featureItems = [
  {
    title: "即时匹配分数",
    description: "通过实时百分比分数，快速识别简历与职位描述之间最关键的差距。",
    icon: ScanSearch,
  },
  {
    title: "AI 智能改写",
    description: "自动重写项目与经历描述，优先突出招聘方真正会看的结果、指标和关键词。",
    icon: Sparkles,
  },
  {
    title: "模板联动制作",
    description: "优化后的内容可直接流入制作页，继续排版、套模板和导出 PDF。",
    icon: FileText,
  },
];

const homePlans = [
  {
    name: "免费版",
    price: "¥0/月",
    description: "每月 3 次优化，适合先体验工作流",
    features: ["基础匹配评分", "3 套模板", "PDF 导出"],
  },
  {
    name: "专业版",
    price: "¥5/月",
    description: "高频投递更合适，支持更多优化轮次",
    features: ["每月 120 次优化", "高级关键词建议", "优先模型通道"],
    highlighted: true,
  },
  {
    name: "终身版",
    price: "¥20/终身",
    description: "一次买断，持续获得模板与功能更新",
    features: ["终身不限次数优化", "终身模板更新", "专属客服支持"],
  },
];

const trustMetrics = [
  { label: "平均完成时长", value: "8 分钟" },
  { label: "模板工作流", value: "3 步完成" },
  { label: "岗位适配关注点", value: "ATS + 面试官" },
];

const surfaceClass = "rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.82)] shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur";

export default function LandingPage() {
  return (
    <SiteFrame currentPath="/" mainClassName="pb-4">
      <section className="px-6 pb-20 pt-8 md:pb-24 md:pt-10">
        <div className={siteContainerClass()}>
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_500px] xl:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ddc0ab] bg-[#f7efe6] px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-[#b85c2c] uppercase">
                Resume Studio Workflow
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] text-slate-900 md:text-6xl">
                把简历优化、模板制作和导出，
                <span className="block text-[#b85c2c]">收进一套更统一的求职界面。</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                现在整个站点都围绕“编辑工作台”做了统一：更克制的暖色纸面、明确的信息层级，以及从优化页到制作页更连贯的视觉节奏。
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b85c2c]"
                >
                  开始制作简历
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-[rgba(255,253,250,0.78)] px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-white"
                >
                  先看优化能力
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full px-2 py-3 text-sm font-semibold text-slate-500 transition hover:text-[#b85c2c]"
                >
                  查看价格方案
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {trustMetrics.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-stone-200/80 bg-white/70 px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${surfaceClass} overflow-hidden p-5`}>
              <div className="rounded-[24px] border border-stone-200 bg-[#fffdfa] p-5">
                <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Unified Workspace</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">简历工作流总览</p>
                  </div>
                  <div className="rounded-full bg-[#f7efe6] px-3 py-1 text-sm font-semibold text-[#b85c2c]">新版视觉</div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="space-y-4 rounded-[22px] border border-stone-200 bg-[#f8f4ed] p-4">
                    <div className="rounded-[18px] bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-slate-500">岗位匹配度</p>
                      <p className="mt-2 text-3xl font-black text-[#b85c2c]">84%</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 rounded-full bg-stone-200" />
                      <div className="h-2.5 w-5/6 rounded-full bg-stone-200" />
                      <div className="h-2.5 w-2/3 rounded-full bg-stone-200" />
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f4ef_100%)] p-5">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-white">优化分析</span>
                      <span className="rounded-full bg-[#f7efe6] px-3 py-1 text-[#b85c2c]">模板联动</span>
                    </div>
                    <div className="mt-5 space-y-4">
                      <div>
                        <div className="h-5 w-2/5 rounded-full bg-stone-200" />
                        <div className="mt-3 h-2.5 w-full rounded-full bg-stone-100" />
                        <div className="mt-2 h-2.5 w-11/12 rounded-full bg-stone-100" />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[18px] border border-stone-200 bg-white px-4 py-4">
                          <p className="text-sm font-semibold text-slate-900">关键词命中</p>
                          <p className="mt-1 text-sm text-slate-500">自动标记 JD 里最重要的能力词。</p>
                        </div>
                        <div className="rounded-[18px] border border-stone-200 bg-white px-4 py-4">
                          <p className="text-sm font-semibold text-slate-900">模板续写</p>
                          <p className="mt-1 text-sm text-slate-500">保留优化结果，继续进入排版与导出。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className={`${siteContainerClass()} grid gap-6 md:grid-cols-3`}>
          {featureItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={`${surfaceClass} p-6`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f7efe6] text-[#b85c2c]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className={`${siteContainerClass()} ${surfaceClass} overflow-hidden`}>
          <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="border-b border-stone-200 bg-[#f8f4ed] p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Feature Preview</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">优化页与制作页现在是同一套语气。</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                左侧输入区、右侧结果区和模板续写链路都改成了更贴近编辑器的纸面风格，减少过去营销页和工作页之间的断层感。
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-[22px] border border-stone-200 bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">上传或粘贴简历</p>
                  <p className="mt-1 text-sm text-slate-500">支持 PDF 解析与文本输入。</p>
                </div>
                <div className="rounded-[22px] border border-stone-200 bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">生成优化建议</p>
                  <p className="mt-1 text-sm text-slate-500">突出量化成果与岗位关键词。</p>
                </div>
                <div className="rounded-[22px] border border-stone-200 bg-white px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">继续进入制作页</p>
                  <p className="mt-1 text-sm text-slate-500">无缝衔接到模板套版与 PDF 导出。</p>
                </div>
              </div>
            </aside>

            <section className="bg-[rgba(255,253,250,0.96)]">
              <HomeHighlightPreview />
            </section>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className={siteContainerClass()}>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pricing</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">按使用频率选择方案</h2>
            </div>
            <Link href="/pricing" className="text-sm font-semibold text-[#b85c2c] transition hover:text-slate-900">
              查看完整价格页
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {homePlans.map((plan) => (
              <article
                key={plan.name}
                className={cn(
                  `${surfaceClass} p-6`,
                  plan.highlighted && "border-[#d7b49f] bg-[linear-gradient(180deg,rgba(255,249,243,0.96)_0%,rgba(247,239,230,0.96)_100%)]",
                )}
              >
                <p className="text-sm font-semibold text-slate-500">{plan.name}</p>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">{plan.price}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{plan.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={`${siteContainerClass()} rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.72)] px-6 py-8 shadow-[0_12px_32px_rgba(15,23,42,0.04)]`}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">深受求职用户常用的工作流启发</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500">
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">职位匹配分析</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">AI 项目改写</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">模板套版</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">PDF 导出</span>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

