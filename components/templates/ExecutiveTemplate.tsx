import type { ResumeData } from "@/components/templates/types";
import { buildTemplateSections, TemplateSectionPanel, TextResumeHeader } from "@/components/templates/TemplateBlocks";

type ExecutiveTemplateProps = {
  data: ResumeData;
};

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const sections = buildTemplateSections(data);

  return (
    <article className="h-full bg-white text-[10px] leading-[1.6] text-slate-800">
      <header className="bg-[#20303f] px-8 py-6 text-white">
        <TextResumeHeader
          data={data}
          nameClassName="text-[34px] tracking-[0.06em] text-white"
          headlineClassName="text-[11px] tracking-[0.18em] text-white/80"
          contactClassName="text-[10px] text-white/80"
        />
      </header>

      <div className="px-8 py-5">
        <div className="space-y-3">
          {sections.map((section) => (
            <TemplateSectionPanel
              key={section.id}
              title={section.title}
              section={section}
              entryVariant="timeline"
              headingTitleClassName="text-[10px] tracking-[0.24em] text-[#20303f]"
              headingRuleClassName="bg-[#c9d3db]"
              titleClassName="text-[#20303f]"
              subtitleClassName="text-slate-600"
              metaClassName="text-[#7d8790]"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
