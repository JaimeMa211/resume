import {
  ArrowRight,
  Download,
  FileStack,
  FileText,
  GraduationCap,
  Medal,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Trophy,
  Workflow,
} from "lucide-react";
import Link from "next/link";

import BrandIcon from "@/components/BrandIcon";
import HomeHighlightPreview from "@/components/HomeHighlightPreview";
import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";
import { cn } from "@/lib/utils";

const heroStats = [
  { label: "输入方式", value: "PDF + 文本 + JD" },
  { label: "身份预设", value: "实习 / 应届 / 社招" },
  { label: "最终产出", value: "模板预览 + PDF" },
];

const pipelineSteps = [
  { label: "01", title: "导入旧简历", description: "支持 PDF 解析，也能直接粘贴现有简历正文。" },
  { label: "02", title: "贴入岗位 JD", description: "系统先提炼职责重点、能力词和结果导向表达。" },
  { label: "03", title: "生成优化稿", description: "自动补齐关键词、压缩冗余描述、突出量化成果。" },
  { label: "04", title: "继续套版导出", description: "优化结果可直接进入制作页，切模板并导出 PDF。" },
];

const featureGroups = [
  {
    title: "输入与解析",
    description: "不是只给一个文本框，而是把用户真实会用到的入口都放进来。",
    icon: FileText,
    items: ["拖拽上传 PDF 简历", "自动提取可编辑文本", "手动粘贴原始简历", "独立输入目标 JD"],
  },
  {
    title: "岗位匹配与改写",
    description: "先分析职位，再改简历，不让用户手动对照 JD 逐句处理。",
    icon: ScanSearch,
    items: ["岗位关键词提炼", "匹配度评分", "项目经历结果化改写", "重点差异高亮"],
  },
  {
    title: "制作工作台",
    description: "优化完成后不需要另起一套流程，直接接到正式制作界面。",
    icon: Workflow,
    items: ["身份预设切换", "模块化信息编辑", "示例稿恢复", "本地草稿保存"],
  },
  {
    title: "模板与导出",
    description: "把排版能力放回首页说明里，让用户一眼看到最后能拿到什么。",
    icon: Download,
    items: ["3 套官方模板", "右侧实时预览", "模板切换联动", "导出 PDF"],
  },
];

const personaCards = [
  {
    title: "实习生",
    description: "以教育、实习、项目和校园经历为主，强调潜力与执行力。",
    icon: GraduationCap,
    tags: ["教育背景", "实习经历", "项目经历"],
  },
  {
    title: "应届生",
    description: "兼顾校园经历与岗位相关项目，适合第一份全职工作投递。",
    icon: Medal,
    tags: ["校园经历", "项目亮点"],
  },
  {
    title: "职场人士",
    description: "优先突出工作经历、核心项目和量化成果，适合社招岗位。",
    icon: Trophy,
    tags: ["工作经历", "结果指标"],
  },
];

const templateCards = [
  {
    name: "模板 1",
    alias: "Harvard",
    description: "经典结构化排版，适合稳妥投递。",
  },
  {
    name: "模板 2",
    alias: "Modern Tech",
    description: "更现代的双栏信息编排，适合技术与产品岗位。",
  },
  {
    name: "模板 3",
    alias: "Minimalist",
    description: "简约单页风格，适合快速成稿与统一视觉。",
  },
];

const homePlans = [
  {
    name: "免费版",
    price: "¥0/月",
    description: "适合先体验完整工作流。",
    features: ["每月 3 次 AI 简历优化", "基础匹配评分", "3 套模板预览与 PDF 导出"],
  },
  {
    name: "专业版",
    price: "¥5/月",
    description: "适合高频投递和岗位定制化改写。",
    features: ["每月 120 次优化", "更完整的关键词建议", "优先模型通道"],
    highlighted: true,
  },
  {
    name: "终身版",
    price: "¥20/终身",
    description: "适合长期维护个人简历素材库。",
    features: ["终身不限次数优化", "模板持续更新", "专属客服支持"],
  },
];

const surfaceClass =
  "rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.84)] shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur";

export default function LandingPage() {
  return (
    <SiteFrame currentPath="/" mainClassName="pb-8">
      <section className="px-6 pb-14 pt-8 md:pb-18 md:pt-10">
        <div className={siteContainerClass()}>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_560px] xl:gap-10">
            <div className="relative overflow-hidden rounded-[38px] border border-[#1d2433]/10 bg-[linear-gradient(135deg,rgba(255,250,244,0.96)_0%,rgba(250,242,232,0.9)_48%,rgba(241,246,250,0.9)_100%)] p-7 shadow-[0_25px_65px_rgba(15,23,42,0.08)] md:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,92,44,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(23,32,51,0.08),transparent_34%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#ddc0ab] bg-white/72 px-4 py-2 text-sm font-semibold text-[#9a4e25] shadow-[0_10px_24px_rgba(184,92,44,0.08)]">
                  <BrandIcon className="h-10 w-10 rounded-[16px]" svgClassName="h-7 w-7" />
                  <span>首页已改为功能聚合视图，不再只讲流程口号</span>
                </div>

                <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.06em] text-slate-950 md:text-6xl">
                  把简历站真正能做的事，
                  <span className="block text-[#b85c2c]">一次性完整摆到首页。</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  懒人简历现在首页直接展示完整产品能力：导入旧简历、解析 PDF、对照 JD 优化表达、切换身份预设、进入模板制作，再导出 PDF。用户不用翻页猜产品边界，进来就知道这套工具到底能帮他省掉什么。
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b85c2c]"
                  >
                    先看优化工作台
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/builder"
                    className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white/75 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-white"
                  >
                    直接进入制作页
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-full px-2 py-3 text-sm font-semibold text-slate-500 transition hover:text-[#b85c2c]"
                  >
                    查看价格方案
                  </Link>
                </div>

                <div className="mt-10 grid gap-3 md:grid-cols-3">
                  {heroStats.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
                    </article>
                  ))}
                </div>

                <div className="mt-10 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="rounded-[28px] border border-stone-200/90 bg-[#111827] p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-white/12 px-3 py-1">PDF 解析</span>
                      <span className="rounded-full bg-white/12 px-3 py-1">JD 分析</span>
                      <span className="rounded-full bg-[#f59e0b] px-3 py-1 text-slate-950">AI 改写</span>
                      <span className="rounded-full bg-white/12 px-3 py-1">模板联动</span>
                    </div>
                    <p className="mt-5 text-2xl font-semibold tracking-tight">首页右侧不再是单一卖点卡片，而是一张完整的功能地图。</p>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                      用户会先看到输入源、优化动作、身份适配和导出路径，认知成本比旧首页更低，也更符合真实使用顺序。
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-stone-200 bg-white/86 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Quality Signals</p>
                    <div className="mt-4 space-y-3">
                      {[
                        "优化到制作页可直接衔接",
                        "模板切换与预览同步",
                        "本地草稿自动保存",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-[18px] bg-[#f8f4ed] px-3 py-3 text-sm font-medium text-slate-700">
                          <ShieldCheck className="h-4 w-4 text-[#b85c2c]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(surfaceClass, "overflow-hidden p-5")}>
              <div className="relative h-full rounded-[30px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#f4ede3_100%)] p-5">
                <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#f5c97a]/30 blur-3xl" />
                <div className="absolute left-10 top-24 h-20 w-20 rounded-full bg-[#d8e6f1]/45 blur-3xl" />

                <div className="relative flex items-start justify-between gap-4 border-b border-stone-200 pb-5">
                  <div className="flex items-center gap-4">
                    <BrandIcon className="h-16 w-16 shrink-0" svgClassName="h-11 w-11" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Home Overview</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">把产品所有能力浓缩成一屏</p>
                    </div>
                  </div>
                  <div className="rounded-full border border-[#ead7c8] bg-white/80 px-3 py-1 text-sm font-semibold text-[#b85c2c]">
                    功能已聚合
                  </div>
                </div>

                <div className="relative mt-5 grid gap-3">
                  {pipelineSteps.map((item) => (
                    <article key={item.title} className="grid gap-3 rounded-[22px] border border-stone-200 bg-white/85 p-4 md:grid-cols-[60px_minmax(0,1fr)]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#111827] text-sm font-bold text-white">
                        {item.label}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className={siteContainerClass()}>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Capability Matrix</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">首页现在直接覆盖完整功能集合</h2>
            </div>
            <div className="rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600">
              从输入到导出，一页讲清
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {featureGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article key={group.title} className={cn(surfaceClass, "p-6")}>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Capability</p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{group.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{group.description}</p>
                    </div>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#f7efe6] text-[#b85c2c]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <div key={item} className="rounded-[22px] border border-stone-200 bg-white/82 px-4 py-4 text-sm font-medium text-slate-700">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className={cn(siteContainerClass(), surfaceClass, "overflow-hidden")}>
          <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="border-b border-stone-200 bg-[#f8f4ed] p-7 lg:border-b-0 lg:border-r">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace Preview</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">首页展示不再抽象，直接模拟真实工作台。</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                右侧预览把输入、优化、身份预设、模板与导出放进同一个组件里。这样用户在首页就能看懂产品结构，而不是只看到一句“AI 帮你做简历”。
              </p>

              <div className="mt-7 space-y-3">
                {[
                  { title: "输入区", desc: "PDF 上传、文本粘贴、JD 输入" },
                  { title: "优化区", desc: "匹配度、摘要重写、差异高亮" },
                  { title: "制作区", desc: "身份切换、模板联动、PDF 导出" },
                ].map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-stone-200 bg-white px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </aside>

            <section className="bg-[rgba(255,253,250,0.96)]">
              <HomeHighlightPreview />
            </section>
          </div>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className={siteContainerClass()}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className={cn(surfaceClass, "p-7")}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Persona & Template</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">不同求职阶段和模板能力，也在首页一次说明清楚。</h2>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {personaCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-[26px] border border-stone-200 bg-white/86 p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#f7efe6] text-[#b85c2c]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-[#f8f4ed] px-3 py-1 text-xs font-semibold text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className={cn(surfaceClass, "p-7")}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#111827] text-white">
                  <FileStack className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Official Templates</p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-900">3 套官方模板</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {templateCards.map((item) => (
                  <article key={item.name} className="rounded-[24px] border border-stone-200 bg-white/86 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <span className="rounded-full bg-[#f7efe6] px-3 py-1 text-xs font-semibold text-[#b85c2c]">{item.alias}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className={siteContainerClass()}>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pricing</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">价格仍然保留在首页，但表达更像产品分层</h2>
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
                  surfaceClass,
                  "p-6",
                  plan.highlighted && "border-[#d7b49f] bg-[linear-gradient(180deg,rgba(255,249,243,0.96)_0%,rgba(247,239,230,0.96)_100%)]",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-500">{plan.name}</p>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-[#111827] px-3 py-1 text-xs font-semibold text-white">推荐</span>
                  ) : null}
                </div>
                <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">{plan.price}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{plan.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#b85c2c]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className={cn(siteContainerClass(), "rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.76)] px-6 py-8 shadow-[0_12px_32px_rgba(15,23,42,0.04)]")}>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">End-to-End</p>
          <h2 className="mt-4 text-center text-3xl font-black tracking-tight text-slate-900">少切页面，少重复整理，首页先把整条路径说明白。</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500">
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">PDF 解析</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">JD 匹配分析</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">AI 项目改写</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">身份化制作</span>
            <span className="rounded-full bg-[#f7efe6] px-4 py-2">模板套版</span>
            <span className="rounded-full bg-[#111827] px-4 py-2 text-white">PDF 导出</span>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}

