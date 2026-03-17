import { ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

import ApplyUpgradeFromQuery from "@/components/ApplyUpgradeFromQuery";
import ResumeOptimizerWorkspace from "@/components/ResumeOptimizerWorkspace";
import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";

const notes = [
  {
    title: "隐私优先",
    description: "简历内容仅用于当前优化流程，解析后不保留上传文件。",
    icon: ShieldCheck,
  },
  {
    title: "优化到制作联动",
    description: "可将优化后的结果继续带入制作页，避免重复录入。",
    icon: Workflow,
  },
  {
    title: "更接近编辑器的界面",
    description: "卡片层级、背景和按钮语气已统一到同一套工作台视觉。",
    icon: Sparkles,
  },
];

export default function FeaturesPage() {
  return (
    <SiteFrame currentPath="/features" mainClassName="pb-4">
      <Suspense fallback={null}>
        <ApplyUpgradeFromQuery />
      </Suspense>

      <section className="px-6 pb-6 pt-8">
        <div className={`${siteContainerClass()} grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]`}>
          <div className="rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.82)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Optimizer Workspace</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">先对岗位做针对性优化，再继续进入模板制作。</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              这个页面现在沿用制作页的暖色纸面逻辑，左侧是输入控制台，右侧是结果和模板续写区，整体更像一个完整工作台，而不是单独的演示页。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/builder" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c]">
                直接去制作页
              </Link>
              <Link href="/pricing" className="rounded-full border border-stone-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white">
                查看升级方案
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {notes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[28px] border border-stone-300/70 bg-[rgba(255,253,250,0.8)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#f7efe6] text-[#b85c2c]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
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
