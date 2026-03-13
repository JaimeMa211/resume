import type { ResumeData } from "@/components/templates/types";

type MinimalistTemplateProps = {
  data: ResumeData;
};

function SectionTag({ title }: { title: string }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <span className="inline-flex min-w-24 items-center justify-center bg-[#4B6D7E] px-3 py-0.5 text-[10px] font-bold text-white">
        {title}
      </span>
      <span className="h-[1px] flex-1 bg-[#BBC7CE]" />
    </div>
  );
}

export function MinimalistTemplate({ data }: MinimalistTemplateProps) {
  const contactItems = data.personal_info.contact
    .split(/[•·|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <article className="h-full bg-white px-9 py-6 text-[10px] leading-[1.55] text-[#2F3B45]">
      <header className="mb-4">
        <div className="flex items-end justify-between border-b-[6px] border-[#4E768A] pb-1">
          <div>
            <p className="text-[56px] font-black tracking-tight text-[#4C7184]">个人简历</p>
            <p className="-mt-1 text-[15px] font-semibold text-[#4C7184]">Personal resume</p>
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
              {data.personal_info.name}
            </p>
            <p>
              <span className="font-semibold text-[#445A67]">电话：</span>
              {contactItems[0] ?? "待补充"}
            </p>
            <p>
              <span className="font-semibold text-[#445A67]">邮箱：</span>
              {contactItems[1] ?? "待补充"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p>
              <span className="font-semibold text-[#445A67]">政治面貌：</span>
              共青团员
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

      <section className="mb-3">
        <SectionTag title="教育背景" />
        <div className="space-y-1">
          {data.education.slice(0, 2).map((edu) => (
            <div key={`${edu.school}-${edu.duration}`} className="grid grid-cols-[120px_1fr_140px] gap-2 border-b border-[#E0E8EC] pb-1 last:border-0">
              <p className="font-semibold text-[#415967]">{edu.duration}</p>
              <p>{edu.school}</p>
              <p className="text-right">
                {edu.major}（{edu.degree}）
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-3">
        <SectionTag title="实习经历" />
        <div className="space-y-2">
          {data.work_experience.length > 0 ? (
            data.work_experience.map((item) => (
              <div key={`${item.company}-${item.role}-${item.duration}`} className="border-b border-[#E0E8EC] pb-1 last:border-0">
                <div className="grid grid-cols-[120px_1fr_130px] gap-2 text-[11px] font-semibold">
                  <p>{item.duration}</p>
                  <p>{item.company}</p>
                  <p className="text-right">{item.role}</p>
                </div>
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
        <SectionTag title="技能证书" />
        <ul className="list-disc space-y-0.5 pl-4">
          {(data.skills.length > 0 ? data.skills : ["技能待补充"]).slice(0, 8).map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTag title="自我评价" />
        <p>{data.professional_summary}</p>
      </section>
    </article>
  );
}
