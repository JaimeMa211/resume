import { cn } from "@/lib/utils";

type BrandIconProps = {
  className?: string;
  svgClassName?: string;
};

export default function BrandIcon({ className, svgClassName }: BrandIconProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-[20px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,239,230,0.86))] shadow-[0_16px_30px_rgba(15,23,42,0.12)]",
        className,
      )}
    >
      <span className="absolute inset-1 rounded-[16px] bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_55%)]" />
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("relative h-8 w-8", svgClassName)}
      >
        <rect x="6" y="4" width="24" height="32" rx="4" fill="#111827" />
        <path d="M12 14H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 26H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 2C32 2 33 8 39 9C33 10 32 16 32 16C32 16 31 10 25 9C31 8 32 2 32 2Z" fill="#F59E0B" />
        <circle cx="23" cy="4" r="2" fill="#F59E0B" />
      </svg>
    </span>
  );
}
