import Image from "next/image";

import type { ResumeData } from "@/components/templates/types";
import { cn } from "@/lib/utils";

type ResumePhotoProps = {
  photo?: ResumeData["personal_info"]["photo"];
  name?: string;
  className?: string;
  placeholderClassName?: string;
  label?: string;
};

export function ResumePhoto({ photo, name, className, placeholderClassName, label = "照片" }: ResumePhotoProps) {
  if (photo) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={photo} alt={`${name || "候选人"}照片`} fill unoptimized sizes="200px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center overflow-hidden bg-[#E7ECEF] text-xs font-semibold text-[#7A8993]", className, placeholderClassName)}>
      <span>{label}</span>
    </div>
  );
}
