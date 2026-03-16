import { Suspense } from "react";
import Link from "next/link";

import ApplyUpgradeFromQuery from "@/components/ApplyUpgradeFromQuery";
import HeaderAuthActions from "@/components/HeaderAuthActions";
import ResumeOptimizerWorkspace from "@/components/ResumeOptimizerWorkspace";

export default function FeaturesPage() {
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
            <Link href="/builder" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
              制作简历
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#ec5b13]">
              价格
            </Link>
          </nav>

          <HeaderAuthActions />
        </div>
      </header>

      <main className="py-8">
        <Suspense fallback={null}>
          <ApplyUpgradeFromQuery />
        </Suspense>

        <section className="mx-auto mb-4 w-full max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <span>隐私提示：您的简历在解析后会立即销毁，不作保存，仅用于本次优化。</span>
            <Link href="/builder" className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100">
              切换到简历制作器
            </Link>
          </div>
        </section>

        <ResumeOptimizerWorkspace />
      </main>
    </div>
  );
}
