import type { ResumeData } from "@/components/templates/types";

type HarvardTemplateProps = {
  data: ResumeData;
};

function sectionBadge(title: string) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="inline-flex h-5 min-w-24 items-center bg-[#4B6A79] px-3 text-[10px] font-bold tracking-[0.08em] text-white">
        {title}
      </span>
      <span className="h-[1px] flex-1 bg-[#A7B4BD]" />
    </div>
  );
}

export function HarvardTemplate({ data }: HarvardTemplateProps) {
  const contactItems = data.personal_info.contact
    .split(/[•·|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  const headWork = data.work_experience[0] ? [data.work_experience[0]] : [];
  const restWork = data.work_experience.slice(1);

  return (
    <article className="h-full bg-[#FBFBFB] px-8 py-6 text-[10px] leading-[1.6] text-[#2E2E2E]">
      <header className="mb-4 flex items-start gap-4 border-b border-[#9AA8B3] pb-3">
        <div className="h-24 w-20 shrink-0 overflow-hidden border border-[#C7D0D6] bg-[#E7ECEF]" />

        <div className="min-w-0 flex-1">
          <h1 className="text-[40px] font-black tracking-tight text-[#30343A]">{data.personal_info.name}</h1>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-[#4D5A63]">
            {contactItems.length > 0 ? (
              contactItems.map((item) => <p key={item}>• {item}</p>)
            ) : (
              <p>• 联系方式待补充</p>
            )}
          </div>
        </div>
      </header>

      <section className="mb-3">
        {sectionBadge("教育背景")}
        <div className="space-y-2 pl-1">
          {data.education.slice(0, 2).map((edu) => (
            <div key={`${edu.school}-${edu.duration}`}>
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#2F3C45]">
                <p>{edu.school}</p>
                <p>{edu.duration}</p>
              </div>
              <p className="text-[#4D5962]">
                {edu.major} | {edu.degree}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-3">
        {sectionBadge("项目经历")}
        <div className="space-y-2 pl-1">
          {headWork.length > 0 ? (
            headWork.map((item) => (
              <div key={`${item.company}-${item.role}`}>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#2F3C45]">
                  <p>{item.role}</p>
                  <p>{item.duration}</p>
                </div>
                <p className="mb-1 text-[#5A6670]">{item.company}</p>
                <ul className="list-disc space-y-0.5 pl-4">
                  {item.achievements.slice(0, 3).map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>暂无项目经历</p>
          )}
        </div>
      </section>

      <section className="mb-3">
        {sectionBadge("实习经历")}
        <div className="space-y-2 pl-1">
          {restWork.length > 0 ? (
            restWork.map((item) => (
              <div key={`${item.company}-${item.role}-${item.duration}`}>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#2F3C45]">
                  <p>{item.role}</p>
                  <p>{item.duration}</p>
                </div>
                <p className="mb-1 text-[#5A6670]">{item.company}</p>
                <ul className="list-disc space-y-0.5 pl-4">
                  {item.achievements.slice(0, 2).map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>暂无实习经历</p>
          )}
        </div>
      </section>

      <section className="mb-3">
        {sectionBadge("技能证书")}
        <ul className="list-disc space-y-0.5 pl-5">
          {(data.skills.length > 0 ? data.skills : ["技能待补充"]).slice(0, 8).map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section>
        {sectionBadge("自我评价")}
        <p className="rounded border border-[#D5DDE2] bg-white px-2 py-1.5 text-[#505D67]">{data.professional_summary}</p>
      </section>
    </article>
  );
}
