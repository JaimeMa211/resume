import type { ResumeData } from "@/components/templates/types";
import { buildResumeContactItems, buildResumeTemplateSections, type ResumeTemplateSection } from "@/lib/resume-view-model";

type ModernTechTemplateProps = {
  data: ResumeData;
};

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-2 border-t border-[#2B8CD6] pt-1">
      <h2 className="text-[22px] font-black tracking-[0.06em] text-[#2B8CD6]">{title}</h2>
    </div>
  );
}

function renderSection(section: ResumeTemplateSection) {
  if (section.type === "text") {
    return <p>{section.text}</p>;
  }

  if (section.type === "list") {
    return (
      <ul className="list-disc space-y-0.5 pl-4">
        {section.items.slice(0, 10).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2">
      {section.entries.map((entry) => (
        <div key={`${entry.title}-${entry.subtitle}-${entry.meta}`}>
          <div className="mb-0.5 flex items-center justify-between text-[11px] font-bold">
            {entry.meta ? <p>{entry.meta}</p> : <span />}
            <p>{entry.title}</p>
          </div>
          {entry.subtitle ? <p className="mb-1 font-semibold text-[#2F3E4A]">{entry.subtitle}</p> : null}
          {entry.bullets && entry.bullets.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4">
              {entry.bullets.slice(0, 3).map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ModernTechTemplate({ data }: ModernTechTemplateProps) {
  const contactItems = buildResumeContactItems(data);
  const sections = buildResumeTemplateSections(data);

  return (
    <article className="h-full bg-white px-8 py-7 text-[10px] leading-[1.55] text-[#1F2933]">
      <header className="mb-4 flex items-start justify-between border-t border-[#222] pt-2">
        <div className="min-w-0 pr-4">
          <h1 className="text-[44px] font-black tracking-tight">{data.personal_info.name || "候选人"}</h1>
          {data.personal_info.headline ? <p className="mt-1 text-[12px] font-semibold text-[#2B8CD6]">{data.personal_info.headline}</p> : null}
          <div className="mt-1 space-y-0.5 text-[10px] text-[#3B4A56]">
            {contactItems.length > 0 ? contactItems.map((item) => <p key={item}>{item}</p>) : <p>联系方式待补充</p>}
          </div>
        </div>

        <div className="h-[150px] w-[120px] shrink-0 overflow-hidden bg-[#1F80C4]" />
      </header>

      <div className="space-y-3">
        {sections.map((section) => (
          <section key={section.id}>
            <SectionTitle title={section.title} />
            {renderSection(section)}
          </section>
        ))}
      </div>
    </article>
  );
}
