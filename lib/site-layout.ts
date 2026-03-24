import { cn } from "@/lib/utils";

export function siteContainerClass(wide = false) {
  return cn("mx-auto w-full px-6", wide ? "max-w-[1660px]" : "max-w-7xl");
}
