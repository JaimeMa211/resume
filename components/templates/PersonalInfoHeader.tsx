import {
  BriefcaseBusiness,
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { ResumePhoto } from "@/components/templates/ResumePhoto";
import type { ResumeData } from "@/components/templates/types";
import { buildPersonalContactDetails } from "@/lib/resume-data";
import { cn } from "@/lib/utils";

type PersonalInfoHeaderProps = {
  data: ResumeData;
  className?: string;
  nameClassName?: string;
  headlineClassName?: string;
  photoClassName?: string;
  photoPlaceholderClassName?: string;
  infoGridClassName?: string;
  itemClassName?: string;
  itemIconClassName?: string;
  itemTextClassName?: string;
  emptyClassName?: string;
};

type InfoItem = {
  id: string;
  icon: LucideIcon;
  value: string;
  wrap?: boolean;
};

function normalizeText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function extractTimelineLabel(data: ResumeData) {
  const durationCandidates = [
    data.education[0]?.duration,
    data.work_experience[0]?.duration,
    data.internships[0]?.duration,
    data.projects[0]?.duration,
  ];

  const duration = durationCandidates.map(normalizeText).find(Boolean);
  if (!duration) {
    return "";
  }

  const matches = duration.match(/(19|20)\d{2}(?:[./-]\d{1,2})?/g);
  if (!matches || matches.length === 0) {
    return duration;
  }

  return matches[matches.length - 1].replace(/[.-]/g, "/");
}

function buildInfoItems(data: ResumeData): InfoItem[] {
  const contactDetails = buildPersonalContactDetails(data.personal_info);

  return [
    { id: "headline", icon: BriefcaseBusiness, value: normalizeText(data.personal_info.headline) },
    { id: "timeline", icon: CalendarDays, value: extractTimelineLabel(data) },
    { id: "email", icon: Mail, value: contactDetails.email, wrap: true },
    { id: "phone", icon: Phone, value: contactDetails.phone },
    { id: "location", icon: MapPin, value: contactDetails.location },
    { id: "link", icon: Globe, value: contactDetails.primaryLink, wrap: true },
  ].filter((item) => item.value);
}

export function PersonalInfoHeader({
  data,
  className,
  nameClassName,
  headlineClassName,
  photoClassName,
  photoPlaceholderClassName,
  infoGridClassName,
  itemClassName,
  itemIconClassName,
  itemTextClassName,
  emptyClassName,
}: PersonalInfoHeaderProps) {
  const items = buildInfoItems(data);

  return (
    <div className={cn("grid grid-cols-[84px_minmax(150px,180px)_minmax(0,1fr)] items-center gap-4", className)}>
      <ResumePhoto
        photo={data.personal_info.photo}
        name={data.personal_info.name}
        className={cn("h-[92px] w-[72px] border border-[#D5DDE3] bg-[#EEF3F6]", photoClassName)}
        placeholderClassName={cn("bg-[#EEF3F6] text-[#7A8993]", photoPlaceholderClassName)}
      />

      <div className="min-w-0">
        <h1 className={cn("text-[30px] font-bold tracking-tight text-[#1F2933]", nameClassName)}>
          {normalizeText(data.personal_info.name) || "候选人"}
        </h1>
        {normalizeText(data.personal_info.headline) ? (
          <p className={cn("mt-1 text-[14px] font-medium text-[#5B6C78]", headlineClassName)}>{data.personal_info.headline}</p>
        ) : null}
      </div>

      <div className={cn("grid min-w-0 grid-cols-2 gap-x-4 gap-y-2", infoGridClassName)}>
        {items.length > 0 ? (
          items.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className={cn("flex min-w-0 items-center gap-1.5", itemClassName)}>
                <Icon className={cn("h-3.5 w-3.5 shrink-0 text-[#4C7184]", itemIconClassName)} strokeWidth={2} />
                <p className={cn("min-w-0 text-[11px] leading-[1.35] text-[#384854]", item.wrap ? "break-all" : "truncate", itemTextClassName)}>
                  {item.value}
                </p>
              </div>
            );
          })
        ) : (
          <p className={cn("col-span-2 text-[11px] text-[#6B7A85]", emptyClassName)}>联系方式待补充</p>
        )}
      </div>
    </div>
  );
}