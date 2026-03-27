"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getCurrentSession, initializeAuth, setCurrentPlan, subscribeAuthChange, type AuthSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type PricingPlanId = "free" | "monthly" | "yearly" | "buyout";

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
    return `/features?upgrade=${encodeURIComponent(planId)}`;
  }

  if (planId === "free") {
    return "/register";
  }

  const nextPath = `/features?upgrade=${encodeURIComponent(planId)}`;
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export default function PricingPlanCta({
  planId,
  label,
  authedLabel,
  highlighted,
  className,
}: PricingPlanCtaProps) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const syncSession = () => {
      setSession(getCurrentSession());
    };

    syncSession();
    void initializeAuth().then(syncSession).catch(() => undefined);
    return subscribeAuthChange(syncSession);
  }, []);

  const href = getCtaHref(planId, session);
  const ctaLabel = session && authedLabel ? authedLabel : label;

  return (
    <Link
      href={href}
      onClick={() => {
        if (session && planId !== "free") {
          void setCurrentPlan(planId);
        }
      }}
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

