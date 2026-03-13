import type { ResumeData } from "@/components/templates/types";

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

export function ModernTechTemplate({ data }: ModernTechTemplateProps) {
  const contactItems = data.personal_info.contact
    .split(/[•·|]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const projectExp = data.work_experience[0] ? [data.work_experience[0]] : [];
  const internExp = data.work_experience.slice(1);

  return (
    <article className="h-full bg-white px-8 py-7 text-[10px] leading-[1.55] text-[#1F2933]">
      <header className="mb-4 flex items-start justify-between border-t border-[#222] pt-2">
        <div className="min-w-0 pr-4">
          <h1 className="text-[44px] font-black tracking-tight">{data.personal_info.name}</h1>
          <div className="mt-1 space-y-0.5 text-[10px] text-[#3B4A56]">
            {contactItems.length > 0 ? contactItems.map((item) => <p key={item}>{item}</p>) : <p>联系方式待补充</p>}
          </div>
        </div>

        <div className="h-[150px] w-[120px] shrink-0 overflow-hidden bg-[#1F80C4]" />
      </header>

      <section className="mb-3">
        <SectionTitle title="教育背景" />
        {data.education.slice(0, 2).map((edu) => (
          <div key={`${edu.school}-${edu.duration}`} className="mb-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <p>{edu.duration}</p>
              <p>
                {edu.school}　{edu.major}　{edu.degree}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-3">
        <SectionTitle title="项目经历" />
        {projectExp.length > 0 ? (
          projectExp.map((item) => (
            <div key={`${item.company}-${item.role}`} className="mb-2">
              <div className="mb-0.5 flex items-center justify-between text-[11px] font-bold">
                <p>{item.duration}</p>
                <p>{item.role}</p>
              </div>
              <p className="mb-1 font-semibold text-[#2F3E4A]">{item.company}</p>
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
      </section>

      <section className="mb-3">
        <SectionTitle title="实习经历" />
        {internExp.length > 0 ? (
          internExp.map((item) => (
            <div key={`${item.company}-${item.role}-${item.duration}`} className="mb-2">
              <div className="mb-0.5 flex items-center justify-between text-[11px] font-bold">
                <p>{item.duration}</p>
                <p>{item.role}</p>
              </div>
              <p className="mb-1 font-semibold text-[#2F3E4A]">{item.company}</p>
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
      </section>

      <section className="mb-3">
        <SectionTitle title="技能证书" />
        <ul className="list-disc space-y-0.5 pl-4">
          {(data.skills.length > 0 ? data.skills : ["技能待补充"]).slice(0, 9).map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle title="个人评价" />
        <p>{data.professional_summary}</p>
      </section>
    </article>
  );
}
