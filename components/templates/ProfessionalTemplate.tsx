import type { ResumeData } from "@/components/templates/types";
import { PersonalInfoHeader } from "@/components/templates/PersonalInfoHeader";
import { buildTemplateSections, TemplateSectionPanel } from "@/components/templates/TemplateBlocks";

type ProfessionalTemplateProps = {
  data: ResumeData;
};

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const sections = buildTemplateSections(data);
  const sidebarIds = new Set(["summary", "education", "credentials", "awards"]);
  const sidebarSections = sections.filter((section) => sidebarIds.has(section.id));
  const mainSections = sections.filter((section) => !sidebarIds.has(section.id));

  return (
    <article className="h-full bg-[#f7fafc] px-7 py-6 text-[10px] leading-[1.6] text-slate-800">
      <header className="rounded-[24px] bg-[linear-gradient(135deg,#17354f_0%,#2f5d7d_100%)] px-6 py-5 text-white shadow-[0_16px_40px_rgba(23,53,79,0.18)]">
        <PersonalInfoHeader
          data={data}
          className="grid-cols-[86px_minmax(160px,220px)_minmax(0,1fr)] gap-5"
          nameClassName="text-[34px] font-black tracking-tight text-white"
          headlineClassName="mt-1 text-[12px] font-medium text-white/80"
          photoClassName="h-[102px] w-[78px] rounded-[10px] border border-white/20 bg-white/10"
          photoPlaceholderClassName="bg-white/10 text-white/70"
          infoGridClassName="gap-x-5 gap-y-2"
          itemIconClassName="text-[#b6d4ea]"
          itemTextClassName="text-[10px] text-white/88"
          emptyClassName="text-[10px] text-white/70"
        />
      </header>

      <div className="mt-4 grid grid-cols-[220px_minmax(0,1fr)] gap-4">
        <aside className="space-y-3 rounded-[22px] bg-[#eaf1f6] px-4 py-4">
          {sidebarSections.map((section) => (
            <TemplateSectionPanel
              key={section.id}
              title={section.title}
              section={section}
              headingTitleClassName="text-[10px] tracking-[0.22em] text-[#244861]"
              headingRuleClassName="bg-[#bbcfdd]"
              headingWrapperClassName="mb-2.5"
              textClassName="text-[10px] leading-[1.75] text-[#35556d]"
              titleClassName="text-[#17354f]"
              subtitleClassName="text-[#4e6d84]"
              metaClassName="text-[#35556d]"
              bulletListClassName="mt-1.5 list-disc space-y-1 pl-4 text-[10px] leading-[1.65] text-[#35556d]"
            />
          ))}
        </aside>

        <div className="space-y-3">
          {mainSections.map((section) => (
            <div key={section.id} className="rounded-[20px] border border-[#d7e2ea] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <TemplateSectionPanel
                title={section.title}
                section={section}
                headingTitleClassName="rounded-full bg-[#1f5e8a] px-3 py-1 text-[10px] text-white"
                headingRuleClassName="bg-[#d5e1e9]"
                headingWrapperClassName="mb-2.5 gap-3"
                titleClassName="text-[11px] font-bold text-[#18324a]"
                subtitleClassName="text-[10px] text-[#557089]"
                metaClassName="text-[10px] font-semibold text-[#315b7c]"
                bulletListClassName="mt-1.5 list-disc space-y-1 pl-4 text-[10px] leading-[1.65] text-slate-700"
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
