import {
  ArrowRight,
  BrainCircuit,
  Check,
  Download,
  FileText,
  LockKeyhole,
  ScanSearch,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import HomeHighlightPreview from "@/components/HomeHighlightPreview";
import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";
import { cn } from "@/lib/utils";

const trustIndicators = ["AI 定向优化", "本地草稿保存", "3 套模板联动", "PDF 导出"];

const heroStats = [
  { label: "接入方式", value: "PDF + 原文 + JD" },
  { label: "流程衔接", value: "优化后直接进入制作页" },
  { label: "结果产出", value: "实时预览 + PDF 导出" },
];

const quickReasons = [
  {
    title: "先优化内容",
    description: "不是上来只换模板，而是先把岗位关键词、经历表述和摘要改对。",
    icon: BrainCircuit,
  },
  {
    title: "再完成排版",
    description: "优化结果直接带入模板页，减少重复录入和版本来回搬运。",
    icon: Workflow,
  },
  {
    title: "最后导出成稿",
    description: "模板切换、实时预览和 PDF 导出放在同一条路径里完成。",
    icon: Download,
  },
];

const featureSections = [
  {
    eyebrow: "AI 驱动",
    title: "先理解岗位，再给出更像样的简历版本。",
    description:
      "贴入目标 JD 后，系统会先提炼职责重点、技能词和结果导向表达，再对摘要、项目和经历做针对性改写。",
    bullets: ["岗位关键词提炼", "匹配度评分", "重点差异高亮", "项目经历结果化改写"],
    visual: "analysis" as const,
  },
  {
    eyebrow: "流程联动",
    title: "优化结果不用重录，直接延续到模板制作页。",
    description:
      "用户可以在优化完内容后，直接继续排版、切换模板并导出，避免多页面重复整理。",
    bullets: ["优化页到制作页直接衔接", "身份预设切换", "模块化编辑", "模板预览联动"],
    visual: "workflow" as const,
  },
  {
    eyebrow: "隐私优先",
    title: "本地草稿与导出能力一起提供，减少对隐私的顾虑。",
    description:
      "对求职产品来说，隐私和可控感同样重要。首页里把本地保存、PDF 导出和内容自主掌控一起讲清楚，信任感会更高。",
    bullets: ["本地草稿自动保存", "支持 PDF 导出", "可持续维护素材库", "适合多岗位版本管理"],
    visual: "privacy" as const,
  },
];

const faqItems = [
  {
    q: "懒人简历最核心的功能是什么？",
    a: "核心不是单一模板，而是把旧简历导入、岗位定向优化、模板制作和 PDF 导出连成一条完整流程。",
  },
  {
    q: "支持上传 PDF 简历吗？",
    a: "支持。你可以上传 PDF，也可以直接粘贴原始简历内容，再补充目标岗位 JD 一起优化。",
  },
  {
    q: "优化后的内容可以直接继续制作吗？",
    a: "可以。优化结果可以直接带入模板制作页，继续排版、切换模板并导出 PDF。",
  },
  {
    q: "适合哪些求职阶段使用？",
    a: "实习生、应届生和职场人士都可以使用。系统会根据不同阶段的内容重点帮助你组织和强化简历表达。",
  },
];

const sectionShellClass =
  "rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.84)] shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur";

export default function LandingPage() {
  return (
    <SiteFrame currentPath="/" mainClassName="pb-8" tone="default">
      <section className="px-6 pb-10 pt-8 md:pb-14 md:pt-10">
        <div className={siteContainerClass()}>
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#e4c8b3] bg-white/80 px-5 py-2 text-sm font-semibold text-[#9a4e25] shadow-[0_12px_30px_rgba(184,92,44,0.08)]">
              {trustIndicators.map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b85c2c]" />
                  {item}
                </span>
              ))}
            </div>

            <h1 className="mt-8 text-4xl font-black leading-[1.04] tracking-[-0.06em] text-slate-950 md:text-6xl">
              让简历优化与制作，
              <span className="block text-[#b85c2c]">变得简单、顺手，而且更像真实求职流程。</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              懒人简历把导入旧简历、分析目标岗位、优化表达、切换模板和导出 PDF 连成一条完整路径，帮助你更快做出能投递的简历版本。
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b85c2c]"
              >
                立即开始制作
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/78 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-white"
              >
                先看优化工作台
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {heroStats.map((item) => (
                <article key={item.label} className="rounded-[24px] border border-white/80 bg-white/82 px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={cn("mt-10 overflow-hidden", sectionShellClass)}>
            <div className="border-b border-stone-200 px-6 py-5 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Product Preview</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">一屏看清从优化到成稿的完整工作流</h2>
                </div>
                <div className="rounded-full bg-[#fbf2ea] px-4 py-2 text-sm font-semibold text-[#9a4e25]">围绕求职场景打造的简历工作台</div>
              </div>
            </div>

            <HomeHighlightPreview />
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className={siteContainerClass()}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Why Choose It</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">从内容到版式，把最费时间的步骤串起来。</h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {quickReasons.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className={cn(sectionShellClass, "p-6")}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f7efe6] text-[#b85c2c]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={siteContainerClass()}>
          <div className="space-y-8">
            {featureSections.map((section, index) => (
              <article key={section.title} className={cn(sectionShellClass, "overflow-hidden p-6 md:p-8")}>
                <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center", index % 2 === 1 && "lg:grid-cols-[460px_minmax(0,1fr)]")}>
                  {index % 2 === 1 ? <FeatureVisual type={section.visual} /> : null}

                  <div className={cn(index % 2 === 1 && "lg:order-last")}>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a4e25]">{section.eyebrow}</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{section.title}</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 md:text-base">{section.description}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {section.bullets.map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-[20px] border border-stone-200 bg-white/86 px-4 py-4 text-sm font-medium text-slate-700">
                          <Check className="h-4 w-4 shrink-0 text-[#b85c2c]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {index % 2 === 0 ? <FeatureVisual type={section.visual} /> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className={siteContainerClass()}>
          <div className={cn("mx-auto max-w-4xl p-6 md:p-8", sectionShellClass)}>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">FAQ</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">常见问题</h2>
            </div>

            <div className="mt-8 space-y-3">
              {faqItems.map((item) => (
                <details key={item.q} className="rounded-[24px] border border-stone-200 bg-white/88 px-5 py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">{item.q}</summary>
                  <p className="mt-3 pr-6 text-sm leading-7 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={siteContainerClass()}>
          <div className="rounded-[36px] bg-[linear-gradient(135deg,#111827_0%,#2b180f_62%,#b85c2c_100%)] px-8 py-10 text-white shadow-[0_28px_70px_rgba(15,23,42,0.18)] md:px-10 md:py-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Final CTA</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">先把内容改对，再决定它要长什么样。</h2>
              <p className="mt-4 text-sm leading-8 text-white/72 md:text-base">
                无论你是第一次做简历，还是需要针对不同岗位快速改版，都可以从这里直接开始。
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#f7efe6]"
                >
                  进入制作页
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  查看价格方案
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}

function FeatureVisual({ type }: { type: "analysis" | "workflow" | "privacy" }) {
  if (type === "analysis") {
    return (
      <div className="rounded-[30px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#f8efe5_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="rounded-[24px] bg-[#111827] p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/55">
            <ScanSearch className="h-4 w-4" />
            <span>JD Analyzer</span>
          </div>
          <p className="mt-4 text-xl font-semibold">岗位关键词与经历亮点同时被抽取出来。</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            {["结果导向", "项目复盘", "协作推进", "数据分析"].map((item) => (
              <span key={item} className="rounded-full bg-white/12 px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "识别 JD 中的核心能力词",
            "对原简历缺失部分给出补充建议",
            "把经历统一改成结果导向表述",
            "标出最值得保留的投递亮点",
          ].map((item) => (
            <div key={item} className="rounded-[20px] border border-stone-200 bg-white px-4 py-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "workflow") {
    return (
      <div className="rounded-[30px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#f7f1e8_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3">
          {[
            { label: "01", title: "导入旧简历", desc: "支持 PDF 上传与文本粘贴" },
            { label: "02", title: "贴入岗位 JD", desc: "先分析再改写，不是只排版" },
            { label: "03", title: "继续模板制作", desc: "优化结果直接带入模板页" },
            { label: "04", title: "导出 PDF", desc: "完成预览后立即下载成稿" },
          ].map((item) => (
            <div key={item.label} className="grid gap-3 rounded-[22px] border border-stone-200 bg-white px-4 py-4 md:grid-cols-[54px_minmax(0,1fr)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#b85c2c] text-sm font-bold text-white">{item.label}</div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#f7f0e8_100%)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="rounded-[24px] border border-[#ead7c8] bg-[#fbf2ea] p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9a4e25]">
          <LockKeyhole className="h-4 w-4" />
          <span>Privacy & Export</span>
        </div>
        <p className="mt-4 text-xl font-semibold text-slate-900">数据掌控感也被放进首页卖点里。</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">对求职用户来说，信任感和效率同样重要，所以把本地草稿、导出能力和版本管理都摆在前面。</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <PrivacyMiniCard icon={FileText} title="本地草稿" desc="编辑状态持续保存，减少丢失和反复整理。" />
        <PrivacyMiniCard icon={Download} title="导出能力" desc="完成制作后可直接导出 PDF，用于投递和归档。" />
      </div>
    </div>
  );
}

function PrivacyMiniCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof FileText;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[20px] border border-stone-200 bg-white px-4 py-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#f7efe6] text-[#b85c2c]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
    </div>
  );
}
