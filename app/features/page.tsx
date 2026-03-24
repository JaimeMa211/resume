import { ShieldCheck, Sparkles, Workflow, ArrowRight, Zap } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

import ApplyUpgradeFromQuery from "@/components/ApplyUpgradeFromQuery";
import ResumeOptimizerWorkspace from "@/components/ResumeOptimizerWorkspace";
import SiteFrame from "@/components/SiteFrame";
import { siteContainerClass } from "@/lib/site-layout";

const notes = [
  {
    title: "隐私优先",
    description: "简历内容仅用于当前优化流程，解析后不保留上传文件。",
    icon: ShieldCheck,
    accent: "#10b981",
    bg: "#f0fdf4",
  },
  {
    title: "优化到制作联动",
    description: "可将优化后的结果继续带入制作页，避免重复录入。",
    icon: Workflow,
    accent: "#b85c2c",
    bg: "#fff7ed",
  },
  {
    title: "更接近编辑器的界面",
    description: "所见即所得的交互体验，让简历优化像写文档一样自然。",
    icon: Sparkles,
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
];

export default function FeaturesPage() {
  return (
    <SiteFrame currentPath="/features" mainClassName="pb-4">
      <Suspense fallback={null}>
        <ApplyUpgradeFromQuery />
      </Suspense>

      <section className="px-6 pb-6 pt-8">
        <div className={`${siteContainerClass()} grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]`}>
          {/* 左侧主卡片 */}
          <div className="relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden rounded-[32px] border border-stone-200/80 bg-gradient-to-br from-[#fffdf9] via-[#fff8f2] to-[#fdf3ea] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
            {/* 背景装饰圆 */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#b85c2c]/6" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#b85c2c]/4" />

            <div className="relative">
              {/* 标签徽章 */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b85c2c]/20 bg-[#b85c2c]/8 px-3 py-1.5">
                <Zap className="h-3 w-3 text-[#b85c2c]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b85c2c]">Optimizer Workspace</span>
              </div>

              <h1 className="text-[2.6rem] font-black leading-[1.2] tracking-[-0.03em] text-slate-900 md:text-5xl">
                先对岗位做<br />
                <span className="relative inline-block">
                  <span className="relative z-10">针对性优化，</span>
                  <span className="absolute bottom-1 left-0 z-0 h-3 w-full rounded-sm bg-[#b85c2c]/12" />
                </span>
                <br />再进入模板制作。
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                上传简历 + 粘贴 JD，AI 分析匹配度并给出针对性改写建议。
              </p>
            </div>

            {/* 底部按钮组 */}
            <div className="relative mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/builder"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)] transition-all hover:bg-[#b85c2c] hover:shadow-[0_4px_20px_rgba(184,92,44,0.35)]"
              >
                直接去制作页
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-white/80 px-5 py-3 text-sm font-medium text-slate-600 transition-all hover:border-stone-400 hover:bg-white hover:text-slate-900"
              >
                查看升级方案
              </Link>
            </div>
          </div>

          {/* 右侧特性卡片列 */}
          <div className="flex h-full flex-col gap-4">
            {notes.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-[24px] border border-stone-200/80 bg-white/90 px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
                >
                  {/* 序号 */}
                  <span className="absolute right-5 top-5 text-[11px] font-bold text-stone-300">
                    0{index + 1}
                  </span>

                  <div className="flex items-start gap-4">
                    <span
                      className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] transition-transform group-hover:scale-110"
                      style={{ background: item.bg, color: item.accent }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ width: "18px", height: "18px" }} />
                    </span>
                    <div>
                      <h2 className="text-[15px] font-semibold leading-snug text-slate-900">{item.title}</h2>
                      <p className="mt-1.5 text-[13px] leading-[1.7] text-slate-500">{item.description}</p>
                    </div>
                  </div>

                  {/* 底部色条 */}
                  <div
                    className="absolute bottom-0 left-0 h-[3px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${item.accent}60, ${item.accent})` }}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className={`${siteContainerClass()} rounded-[34px] border border-stone-300/70 bg-[rgba(255,253,250,0.72)] p-2 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur`}>
          <ResumeOptimizerWorkspace />
        </div>
      </section>
    </SiteFrame>
  );
}
