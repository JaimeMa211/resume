"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { setCurrentPlan } from "@/lib/auth-client";

export default function ApplyUpgradeFromQuery() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const upgrade = searchParams.get("upgrade");
    if (upgrade !== "pro" && upgrade !== "lifetime") {
      return;
    }

    setCurrentPlan(upgrade);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("upgrade");

    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [searchParams, pathname, router]);

  return null;
}
