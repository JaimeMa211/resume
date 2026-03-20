import Link from "next/link";
import type { ReactNode } from "react";

import BrandIcon from "@/components/BrandIcon";
import HeaderAuthActions from "@/components/HeaderAuthActions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/features", label: "优化简历" },
  { href: "/builder", label: "制作简历" },
  { href: "/pricing", label: "价格" },
];

export const siteBackgroundClass =
  "bg-[radial-gradient(circle_at_top_left,#f5d6bf_0%,#f9f0e7_34%,#f7f4ef_66%,#f3f6f8_100%)]";

const siteToneStyles = {
  default: {
    backgroundClass: siteBackgroundClass,
    topGlowClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(184,92,44,0.22),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_38%)]",
    leftOrbClass: "bg-[#f0cdb7]/65",
    rightOrbClass: "bg-[#e6edf3]/55",
    dividerClass: "bg-[linear-gradient(90deg,transparent,rgba(184,92,44,0.24),transparent)]",
    headerShellClass:
      "rounded-[28px] border border-white/75 bg-[rgba(255,251,246,0.82)] px-5 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl",
    navActiveClass: "bg-[#f7efe6] text-[#b85c2c]",
    navInactiveClass: "text-slate-600 hover:bg-white/72 hover:text-slate-900",
    loginClassName: "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/72 hover:text-slate-900",
    registerClassName: "rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b85c2c]",
    footerShellClass:
      "flex flex-col items-start justify-between gap-6 rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.88)] px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur md:flex-row md:items-center",
    footerLinkClass: "transition hover:text-[#b85c2c]",
  },
  cool: {
    backgroundClass: "bg-[radial-gradient(circle_at_top_left,#d6e0e4_0%,#f5f7f8_34%,#edf2f4_68%,#e3eaed_100%)]",
    topGlowClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.16),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.78),transparent_40%)]",
    leftOrbClass: "bg-[#cad7db]/60",
    rightOrbClass: "bg-[#dbe4df]/60",
    dividerClass: "bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.16),transparent)]",
    headerShellClass:
      "rounded-[28px] border border-white/70 bg-[rgba(244,247,248,0.82)] px-5 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl",
    navActiveClass: "bg-slate-900 text-white",
    navInactiveClass: "text-slate-600 hover:bg-white/75 hover:text-slate-900",
    loginClassName: "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white/75 hover:text-slate-900",
    registerClassName: "rounded-full bg-[#1f3a37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900",
    footerShellClass:
      "flex flex-col items-start justify-between gap-6 rounded-[30px] border border-slate-200/80 bg-[rgba(244,247,248,0.84)] px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur md:flex-row md:items-center",
    footerLinkClass: "transition hover:text-[#1f3a37]",
  },
} as const;

export function siteContainerClass(wide = false) {
  return cn("mx-auto w-full px-6", wide ? "max-w-[1660px]" : "max-w-7xl");
}

type SiteTone = keyof typeof siteToneStyles;

type SiteHeaderProps = {
  currentPath: string;
  wide?: boolean;
  tone?: SiteTone;
};

export function SiteHeader({ currentPath, wide = false, tone = "default" }: SiteHeaderProps) {
  const toneStyles = siteToneStyles[tone];

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <div className={cn(siteContainerClass(wide), "flex items-center justify-between gap-4", toneStyles.headerShellClass)}>
        <Link href="/" className="flex items-center gap-3">
          <BrandIcon className="h-12 w-12 shrink-0" svgClassName="h-9 w-9" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Lazy Resume</p>
            <p className="text-base font-semibold tracking-tight text-slate-900">懒人简历</p>
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
                  active ? toneStyles.navActiveClass : toneStyles.navInactiveClass,
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <HeaderAuthActions
          className="shrink-0"
          loginClassName={toneStyles.loginClassName}
          registerClassName={toneStyles.registerClassName}
        />
      </div>
    </header>
  );
}

type SiteFooterProps = {
  wide?: boolean;
  className?: string;
  tone?: SiteTone;
};

export function SiteFooter({ wide = false, className, tone = "default" }: SiteFooterProps) {
  const toneStyles = siteToneStyles[tone];

  return (
    <footer className={cn("relative z-10 px-6 pb-8 pt-12", className)}>
      <div className={cn(siteContainerClass(wide), toneStyles.footerShellClass)}>
        <div className="flex items-center gap-4">
          <BrandIcon className="h-14 w-14 shrink-0" svgClassName="h-10 w-10" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Lazy Resume</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">让简历优化、套版和导出尽量少动手。</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
          <a href="#" className={toneStyles.footerLinkClass}>
            隐私政策
          </a>
          <a href="#" className={toneStyles.footerLinkClass}>
            服务条款
          </a>
          <a href="#" className={toneStyles.footerLinkClass}>
            联系支持
          </a>
          <span>© 2026 懒人简历</span>
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
  tone?: SiteTone;
};

export default function SiteFrame({
  children,
  currentPath,
  wide = false,
  className,
  mainClassName,
  footerClassName,
  showFooter = true,
  tone = "default",
}: SiteFrameProps) {
  const toneStyles = siteToneStyles[tone];

  return (
    <div className={cn("relative min-h-screen overflow-x-hidden text-slate-900", toneStyles.backgroundClass, className)}>
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-[460px]", toneStyles.topGlowClass)} />
      <div className={cn("pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full blur-3xl", toneStyles.leftOrbClass)} />
      <div className={cn("pointer-events-none absolute right-[-110px] top-40 h-80 w-80 rounded-full blur-3xl", toneStyles.rightOrbClass)} />
      <div className={cn("pointer-events-none absolute inset-x-0 top-[26rem] h-px", toneStyles.dividerClass)} />

      <SiteHeader currentPath={currentPath} wide={wide} tone={tone} />

      <main className={cn("relative z-10", mainClassName)}>{children}</main>

      {showFooter ? <SiteFooter wide={wide} className={footerClassName} tone={tone} /> : null}
    </div>
  );
}
