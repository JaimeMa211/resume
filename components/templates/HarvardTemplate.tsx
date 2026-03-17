import { ResumePhoto } from "@/components/templates/ResumePhoto";
import type { ResumeData } from "@/components/templates/types";
import { buildResumeContactItems, buildResumeTemplateSections, type ResumeTemplateSection } from "@/lib/resume-view-model";

type HarvardTemplateProps = {
  data: ResumeData;
};

function sectionBadge(title: string) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="inline-flex min-w-24 items-center bg-[#4B6A79] px-3 py-1 text-[10px] font-bold tracking-[0.08em] text-white">{title}</span>
      <span className="h-px flex-1 bg-[#A7B4BD]" />
    </div>
  );
}

function renderSection(section: ResumeTemplateSection) {
  if (section.type === "text") {
    return <p className="rounded border border-[#D5DDE2] bg-white px-2 py-1.5 text-[#505D67]">{section.text}</p>;
  }

  if (section.type === "list") {
    return (
      <ul className="list-disc space-y-0.5 pl-5">
        {section.items.slice(0, 10).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2 pl-1">
      {section.entries.map((entry) => (
        <div key={`${entry.title}-${entry.subtitle}-${entry.meta}`}>
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#2F3C45]">
            <p>{entry.title}</p>
            {entry.meta ? <p>{entry.meta}</p> : null}
          </div>
          {entry.subtitle ? <p className="mb-1 text-[#5A6670]">{entry.subtitle}</p> : null}
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

export function HarvardTemplate({ data }: HarvardTemplateProps) {
  const contactItems = buildResumeContactItems(data, 4);
  const sections = buildResumeTemplateSections(data);

  return (
    <article className="h-full bg-[#FBFBFB] px-8 py-6 text-[10px] leading-[1.6] text-[#2E2E2E]">
      <header className="mb-4 flex items-start gap-4 border-b border-[#9AA8B3] pb-3">
        <ResumePhoto photo={data.personal_info.photo} name={data.personal_info.name} className="h-24 w-20 shrink-0 border border-[#C7D0D6] bg-[#E7ECEF]" placeholderClassName="text-[#7A8993]" />

        <div className="min-w-0 flex-1">
          <h1 className="text-[40px] font-black tracking-tight text-[#30343A]">{data.personal_info.name || "候选人"}</h1>
          {data.personal_info.headline ? <p className="text-[11px] font-semibold text-[#54626C]">{data.personal_info.headline}</p> : null}
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-[#4D5A63]">
            {contactItems.length > 0 ? contactItems.map((item) => <p key={item}>• {item}</p>) : <p>联系方式待补充</p>}
          </div>
        </div>
      </header>

      <div className="space-y-3">
        {sections.map((section) => (
          <section key={section.id}>
            {sectionBadge(section.title)}
            {renderSection(section)}
          </section>
        ))}
      </div>
    </article>
  );
}
