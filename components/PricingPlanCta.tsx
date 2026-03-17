"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentSession, subscribeAuthChange, type AuthSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type PricingPlanId = "free" | "pro" | "lifetime";

type PricingPlanCtaProps = {
  planId: PricingPlanId;
  label: string;
  authedLabel?: string;
  highlighted?: boolean;
  className?: string;
};

function getCtaHref(planId: PricingPlanId, session: AuthSession | null): string {
  if (session) {
    if (planId === "free") return "/features";
    if (planId === "pro") return "/features?upgrade=pro";
    return "/features?upgrade=lifetime";
  }

  if (planId === "free") {
    return "/register";
  }

  const nextPath = planId === "pro" ? "/features?upgrade=pro" : "/features?upgrade=lifetime";
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export default function PricingPlanCta({
  planId,
  label,
  authedLabel,
  highlighted,
  className,
}: PricingPlanCtaProps) {
  const [session, setSession] = useState<AuthSession | null>(() => getCurrentSession());

  useEffect(() => {
    return subscribeAuthChange(() => {
      setSession(getCurrentSession());
    });
  }, []);

  const href = getCtaHref(planId, session);
  const ctaLabel = session && authedLabel ? authedLabel : label;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition",
        highlighted ? "bg-[#b85c2c] text-white hover:bg-[#9f4d24]" : "bg-slate-900 text-white hover:bg-[#b85c2c]",
        className,
      )}
    >
      {ctaLabel}
    </Link>
  );
}
