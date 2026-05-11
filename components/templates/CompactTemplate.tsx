import type { ResumeData } from "@/components/templates/types";
import { buildTemplateSections, TemplateSectionPanel, TextResumeHeader } from "@/components/templates/TemplateBlocks";

type CompactTemplateProps = {
  data: ResumeData;
};

export function CompactTemplate({ data }: CompactTemplateProps) {
  const sections = buildTemplateSections(data);
  const sidebarSections = sections.filter((section) =>
    ["summary", "education", "credentials", "awards"].includes(section.id),
  );
  const mainSections = sections.filter((section) => !["summary", "education", "credentials", "awards"].includes(section.id));

  return (
    <article className="h-full bg-white px-7 py-6 text-[10px] leading-[1.55] text-slate-800">
      <TextResumeHeader
        data={data}
        wrapperClassName="border-b-2 border-[#d8dee5] pb-3"
        nameClassName="text-[30px] text-[#1f2937]"
        headlineClassName="text-[10px] tracking-[0.2em] text-[#5c7289]"
        contactClassName="text-[10px] text-slate-600"
      />

      <div className="mt-4 grid h-[calc(100%-4.75rem)] grid-cols-[220px_minmax(0,1fr)] gap-5">
        <aside className="space-y-3 rounded-[18px] bg-[#f6f8fa] p-4">
          {sidebarSections.map((section) => (
            <TemplateSectionPanel
              key={section.id}
              title={section.title}
              section={section}
              headingTitleClassName="text-[10px] tracking-[0.2em] text-[#40576d]"
              headingRuleClassName="bg-[#cad5df]"
              listLimit={8}
              textClassName="text-[10px] leading-[1.65] text-slate-700"
            />
          ))}
        </aside>

        <div className="space-y-3">
          {mainSections.map((section) => (
            <TemplateSectionPanel
              key={section.id}
              title={section.title}
              section={section}
              entryVariant="split"
              headingTitleClassName="text-[10px] tracking-[0.22em] text-[#1f2937]"
              headingRuleClassName="bg-[#cfd8e3]"
              titleClassName="text-[#1f2937]"
              subtitleClassName="text-slate-600"
              metaClassName="text-[#64748b]"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
