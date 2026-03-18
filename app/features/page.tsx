import { ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

import ApplyUpgradeFromQuery from "@/components/ApplyUpgradeFromQuery";
import ResumeOptimizerWorkspace from "@/components/ResumeOptimizerWorkspace";
import SiteFrame, { siteContainerClass } from "@/components/SiteFrame";

const notes = [
  {
    title: "\u9690\u79c1\u4f18\u5148",
    description: "\u7b80\u5386\u5185\u5bb9\u4ec5\u7528\u4e8e\u5f53\u524d\u4f18\u5316\u6d41\u7a0b\uff0c\u89e3\u6790\u540e\u4e0d\u4fdd\u7559\u4e0a\u4f20\u6587\u4ef6\u3002",
    icon: ShieldCheck,
  },
  {
    title: "\u4f18\u5316\u5230\u5236\u4f5c\u8054\u52a8",
    description: "\u53ef\u5c06\u4f18\u5316\u540e\u7684\u7ed3\u679c\u7ee7\u7eed\u5e26\u5165\u5236\u4f5c\u9875\uff0c\u907f\u514d\u91cd\u590d\u5f55\u5165\u3002",
    icon: Workflow,
  },
  {
    title: "\u66f4\u63a5\u8fd1\u7f16\u8f91\u5668\u7684\u754c\u9762",
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
          <div className="flex h-full min-h-[420px] flex-col justify-center rounded-[32px] border border-stone-300/70 bg-[rgba(255,253,250,0.82)] p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Optimizer Workspace</p>
            <h1 className="mb-10 mt-4 text-4xl font-black leading-[1.34] tracking-[-0.04em] text-slate-900 md:mb-12 md:text-5xl">
              {"\u5148\u5bf9\u5c97\u4f4d\u505a\u9488\u5bf9\u6027\u4f18\u5316\uff0c\u518d\u7ee7\u7eed\u8fdb\u5165\u6a21\u677f\u5236\u4f5c\u3002"}
            </h1>
            <div className="flex flex-wrap gap-3">
              <Link href="/builder" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b85c2c]">
                {"\u76f4\u63a5\u53bb\u5236\u4f5c\u9875"}
              </Link>
              <Link href="/pricing" className="rounded-full border border-stone-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white">
                {"\u67e5\u770b\u5347\u7ea7\u65b9\u6848"}
              </Link>
            </div>
          </div>

          <div className="flex h-full flex-col gap-6">
            {notes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[28px] border border-stone-300/70 bg-[rgba(255,253,250,0.8)] px-6 py-8 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#f7efe6] text-[#b85c2c]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h2>
                  {item.description ? <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p> : null}
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