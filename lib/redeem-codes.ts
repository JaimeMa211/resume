import type { AccountPlan } from "@/lib/auth-client";

type RedeemCodeEntry = {
  plan: AccountPlan;
  description: string;
};

const REDEEM_CODES: Record<string, RedeemCodeEntry> = {
  "VIP-MONTHLY": {
    plan: "monthly",
    description: "月付版 (10次/月)",
  },
  "VIP-YEARLY": {
    plan: "yearly",
    description: "年付版 (50次/月)",
  },
  "VIP-BUYOUT": {
    plan: "buyout",
    description: "买断版 (不限次数)",
  },
};

export function verifyRedeemCode(code: string): RedeemCodeEntry | null {
  const normalized = code.trim().toUpperCase();
  return REDEEM_CODES[normalized] ?? null;
}

export function getRedeemCodeList(): Array<{ code: string; description: string }> {
  return Object.entries(REDEEM_CODES).map(([code, entry]) => ({
    code,
    description: entry.description,
  }));
}
