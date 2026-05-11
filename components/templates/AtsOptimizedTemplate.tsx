import type { ResumeData } from "@/components/templates/types";
import { buildTemplateSections, TemplateSectionPanel } from "@/components/templates/TemplateBlocks";
import { buildResumeContactItems } from "@/lib/resume-view-model";

type AtsOptimizedTemplateProps = {
  data: ResumeData;
};

export function AtsOptimizedTemplate({ data }: AtsOptimizedTemplateProps) {
  const sections = buildTemplateSections(data);
  const contacts = buildResumeContactItems(data);

  return (
    <article className="h-full bg-[#fffefc] px-10 py-7 text-[10px] leading-[1.65] text-slate-900">
      <header className="border-y-2 border-slate-900 py-3">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[32px] font-bold tracking-[0.06em] text-slate-950">
              {data.personal_info.name || "Candidate"}
            </h1>
            {data.personal_info.headline ? (
              <p className="mt-1 text-[11px] font-medium tracking-[0.16em] text-slate-700">
                {data.personal_info.headline}
              </p>
            ) : null}
          </div>
          <div className="text-right text-[10px] leading-[1.55] text-slate-700">
            {contacts.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-5 space-y-3.5">
        {sections.map((section) => (
          <TemplateSectionPanel
            key={section.id}
            title={section.title}
            section={section}
            headingTitleClassName="bg-slate-950 px-2 py-0.5 text-[10px] tracking-[0.22em] text-white"
            headingRuleClassName="bg-slate-400"
            headingWrapperClassName="mb-2.5 gap-3"
            textClassName="text-[10px] leading-[1.75] text-slate-800"
            entryWrapperClassName="space-y-3"
            titleClassName="text-[11px] font-bold text-slate-900"
            subtitleClassName="mt-0.5 text-[10px] text-slate-600"
            metaClassName="text-[10px] font-semibold text-slate-700"
            bulletListClassName="mt-1.5 list-disc space-y-1 pl-4 text-[10px] leading-[1.65] text-slate-800"
            entryVariant="default"
          />
        ))}
      </div>
    </article>
  );
}
