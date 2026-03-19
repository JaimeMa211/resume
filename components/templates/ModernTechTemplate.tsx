import { PersonalInfoHeader } from "@/components/templates/PersonalInfoHeader";
import type { ResumeData } from "@/components/templates/types";
import { buildResumeTemplateSections, type ResumeTemplateSection } from "@/lib/resume-view-model";

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

  if (section.id === "awards") {
    return (
      <div className="space-y-1.5">
        {section.entries.map((entry) => (
          <div key={`${entry.title}-${entry.subtitle}-${entry.meta}`} className="grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3">
            {entry.meta ? <p className="text-[11px] font-bold">{entry.meta}</p> : <span />}
            <div className="min-w-0">
              <p className="text-[11px] font-bold">{entry.title}</p>
              {entry.subtitle ? <p className="truncate font-semibold text-[#2F3E4A]">{entry.subtitle}</p> : null}
            </div>
          </div>
        ))}
      </div>
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
  const sections = buildResumeTemplateSections(data);

  return (
    <article className="h-full bg-white px-8 pt-4 pb-7 text-[10px] leading-[1.55] text-[#1F2933] print:pt-2">
      <header className="mb-4 border-t border-[#222] pt-2 print:mb-3 print:pt-1">
        <PersonalInfoHeader
          data={data}
          className="grid-cols-[96px_minmax(160px,210px)_minmax(0,1fr)] gap-5"
          nameClassName="text-[34px] font-black text-[#1F2933]"
          headlineClassName="mt-1.5 text-[12px] font-semibold text-[#2B8CD6]"
          photoClassName="h-[110px] w-[86px] rounded-[4px] border-0 bg-[#1F80C4]"
          photoPlaceholderClassName="bg-[#1F80C4] text-white/90"
          infoGridClassName="gap-x-5 gap-y-2.5"
          itemIconClassName="text-[#2B8CD6]"
          itemTextClassName="text-[10px] text-[#3B4A56]"
          emptyClassName="text-[10px] text-[#3B4A56]"
        />
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
