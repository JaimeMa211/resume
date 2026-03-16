import Link from "next/link";

import HeaderAuthActions from "@/components/HeaderAuthActions";
import ResumeCreatorWorkspace from "@/components/ResumeCreatorWorkspace";

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8efe3_0%,#f7f4ee_36%,#f5f7fa_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[rgba(250,246,239,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1660px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-xs font-bold text-white">AI</span>
            <span className="text-sm font-semibold tracking-tight sm:text-base">AI 简历助手</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#b85c2c]">
              首页
            </Link>
            <Link href="/features" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#b85c2c]">
              优化简历
            </Link>
            <Link href="/builder" className="text-sm font-semibold text-[#b85c2c]">
              制作简历
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#b85c2c]">
              价格
            </Link>
          </nav>

          <HeaderAuthActions />
        </div>
      </header>

      <main className="py-5">
        <ResumeCreatorWorkspace />
      </main>
    </div>
  );
}

