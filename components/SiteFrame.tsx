import Link from "next/link";
import type { ReactNode } from "react";

import HeaderAuthActions from "@/components/HeaderAuthActions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/features", label: "优化简历" },
  { href: "/builder", label: "制作简历" },
  { href: "/pricing", label: "价格" },
];

export const siteBackgroundClass =
  "bg-[radial-gradient(circle_at_top_left,#f3e4d2_0%,#f6f1e9_34%,#edf2f6_100%)]";

export function siteContainerClass(wide = false) {
  return cn("mx-auto w-full px-6", wide ? "max-w-[1660px]" : "max-w-7xl");
}

function BrandMark() {
  return (
    <span className="relative flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-900 text-sm font-black tracking-[0.22em] text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
      AI
      <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full border border-[#fff7ef] bg-[#b85c2c]" />
    </span>
  );
}

type SiteHeaderProps = {
  currentPath: string;
  wide?: boolean;
};

export function SiteHeader({ currentPath, wide = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <div
        className={cn(
          siteContainerClass(wide),
          "flex items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-[rgba(255,250,244,0.78)] px-5 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl",
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Resume Studio</p>
            <p className="text-base font-semibold tracking-tight text-slate-900">AI 简历助手</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const active = item.href === currentPath;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active ? "bg-[#f7efe6] text-[#b85c2c]" : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <HeaderAuthActions
          className="shrink-0"
          loginClassName="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
          registerClassName="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b85c2c]"
        />
      </div>
    </header>
  );
}

type SiteFooterProps = {
  wide?: boolean;
  className?: string;
};

export function SiteFooter({ wide = false, className }: SiteFooterProps) {
  return (
    <footer className={cn("relative z-10 px-6 pb-8 pt-12", className)}>
      <div
        className={cn(
          siteContainerClass(wide),
          "flex flex-col items-start justify-between gap-6 rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.86)] px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur md:flex-row md:items-center",
        )}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">AI Resume Studio</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">从优化到制作，用一套更统一的求职工作流。</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
          <a href="#" className="transition hover:text-[#b85c2c]">
            隐私政策
          </a>
          <a href="#" className="transition hover:text-[#b85c2c]">
            服务条款
          </a>
          <a href="#" className="transition hover:text-[#b85c2c]">
            联系支持
          </a>
          <span>© 2026 AI 简历助手</span>
        </div>
      </div>
    </footer>
  );
}

type SiteFrameProps = {
  children: ReactNode;
  currentPath: string;
  wide?: boolean;
  className?: string;
  mainClassName?: string;
  footerClassName?: string;
  showFooter?: boolean;
};

export default function SiteFrame({
  children,
  currentPath,
  wide = false,
  className,
  mainClassName,
  footerClassName,
  showFooter = true,
}: SiteFrameProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden text-slate-900", siteBackgroundClass, className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_top_left,rgba(184,92,44,0.18),transparent_48%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_38%)]" />
      <div className="pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-[#ead3c1]/60 blur-3xl" />
      <div className="pointer-events-none absolute right-[-110px] top-40 h-80 w-80 rounded-full bg-[#dbe5ee]/60 blur-3xl" />

      <SiteHeader currentPath={currentPath} wide={wide} />

      <main className={cn("relative z-10", mainClassName)}>{children}</main>

      {showFooter ? <SiteFooter wide={wide} className={footerClassName} /> : null}
    </div>
  );
}

