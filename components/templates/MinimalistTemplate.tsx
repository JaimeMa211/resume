import type { ResumeData } from "@/components/templates/types";
import { buildResumeContactItems, buildResumeTemplateSections, type ResumeTemplateSection } from "@/lib/resume-view-model";

type MinimalistTemplateProps = {
  data: ResumeData;
};

function SectionTag({ title }: { title: string }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <span className="inline-flex min-w-24 items-center justify-center bg-[#4B6D7E] px-3 py-0.5 text-[10px] font-bold text-white">{title}</span>
      <span className="h-px flex-1 bg-[#BBC7CE]" />
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
        {section.items.slice(0, 8).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2">
      {section.entries.map((entry) => (
        <div key={`${entry.title}-${entry.subtitle}-${entry.meta}`} className="border-b border-[#E0E8EC] pb-1 last:border-0">
          <div className="grid grid-cols-[120px_1fr_130px] gap-2 text-[11px] font-semibold">
            <p>{entry.meta || ""}</p>
            <p>{entry.title}</p>
            <p className="text-right">{entry.subtitle || ""}</p>
          </div>
          {entry.bullets && entry.bullets.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4">
              {entry.bullets.slice(0, 2).map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function MinimalistTemplate({ data }: MinimalistTemplateProps) {
  const contactItems = buildResumeContactItems(data, 4);
  const sections = buildResumeTemplateSections(data);

  return (
    <article className="h-full bg-white px-9 py-6 text-[10px] leading-[1.55] text-[#2F3B45]">
      <header className="mb-4">
        <div className="flex items-end justify-between border-b-[6px] border-[#4E768A] pb-1">
          <div>
            <p className="text-[56px] font-black tracking-tight text-[#4C7184]">个人简历</p>
            <p className="-mt-1 text-[15px] font-semibold text-[#4C7184]">Personal resume</p>
            {data.personal_info.headline ? <p className="mt-1 text-[11px] font-semibold text-[#6C8695]">{data.personal_info.headline}</p> : null}
          </div>
          <div className="mb-2 h-5 w-40 border-b-4 border-[#B48F48]" />
        </div>
      </header>

      <section className="mb-3">
        <SectionTag title="基本信息" />
        <div className="grid grid-cols-[1fr_1fr_90px] gap-3 border border-[#D4DEE4] bg-[#FAFCFD] p-2">
          <div className="space-y-0.5">
            <p>
              <span className="font-semibold text-[#445A67]">姓名：</span>
              {data.personal_info.name || "待补充"}
            </p>
            <p>
              <span className="font-semibold text-[#445A67]">电话：</span>
              {data.personal_info.phone || contactItems[0] || "待补充"}
            </p>
            <p>
              <span className="font-semibold text-[#445A67]">邮箱：</span>
              {data.personal_info.email || contactItems[1] || "待补充"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p>
              <span className="font-semibold text-[#445A67]">所在地：</span>
              {data.personal_info.location || "待补充"}
            </p>
            <p>
              <span className="font-semibold text-[#445A67]">学历：</span>
              {data.education[0]?.degree ?? "待补充"}
            </p>
            <p>
              <span className="font-semibold text-[#445A67]">院校：</span>
              {data.education[0]?.school ?? "待补充"}
            </p>
          </div>
          <div className="h-[90px] w-[90px] border border-[#C8D3DA] bg-[#E9EEF1]" />
        </div>
      </section>

      <div className="space-y-3">
        {sections.map((section) => (
          <section key={section.id}>
            <SectionTag title={section.title} />
            {renderSection(section)}
          </section>
        ))}
      </div>
    </article>
  );
}
