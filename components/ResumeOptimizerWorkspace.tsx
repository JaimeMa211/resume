"use client";

import { ChangeEvent, DragEvent, useMemo, useState } from "react";

import { HarvardTemplate } from "@/components/templates/HarvardTemplate";
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
import { ModernTechTemplate } from "@/components/templates/ModernTechTemplate";
import type { ResumeData } from "@/components/templates/types";
import { BUILDER_DRAFT_STORAGE_KEY, normalizeResumeData } from "@/lib/resume-data";
import { cn } from "@/lib/utils";

type ExperienceItem = {
  company: string;
  role: string;
  details: string[];
};

type OptimizeResponse = {
  match_score: number;
  optimizations: string[];
  new_experiences: ExperienceItem[];
};

type PreviewExperience = {
  company: string;
  role: string;
  duration: string;
  achievements: string[];
};

type ProvidedTemplate = {
  id: "template-1" | "template-2" | "template-3";
  label: string;
  filename: string;
  description: string;
};

type ResumePreviewData = {
  professionalSummary: string;
  skills: string[];
  workExperience: PreviewExperience[];
};

type ExtractedProfileData = {
  name: string;
  contact: string;
  education: ResumeData["education"];
};

const providedTemplates: ProvidedTemplate[] = [
  {
    id: "template-1",
    label: "模板 1",
    filename: "简历模版（一）(1).pdf",
    description: "经典结构化排版",
  },
  {
    id: "template-2",
    label: "模板 2",
    filename: "简历模板（二）(1).pdf",
    description: "现代双栏风格",
  },
  {
    id: "template-3",
    label: "模板 3",
    filename: "ZW-00065简约风求职简历模板.pdf",
    description: "简约单页版式",
  },
];

function extractProfileData(resumeText: string): ExtractedProfileData {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const name = lines.find((line) => line.length <= 30 && !line.includes("@") && !/\d{6,}/.test(line)) ?? "候选人";
  const contact =
    lines.find((line) => line.includes("@") || /(\+?\d[\d\s-]{6,})/.test(line)) ??
    "联系方式待补充 | 邮箱待补充 | 手机待补充";

  const educationKeywords = /(university|college|school|academy|学院|大学|学校|硕士|本科|博士|master|bachelor|phd)/i;
  const educationLines = lines.filter((line) => educationKeywords.test(line)).slice(0, 2);

  const education =
    educationLines.length > 0
      ? educationLines.map((line, index) => {
          const durationMatch = line.match(/(19|20)\d{2}\s*[-~至到]+\s*((19|20)\d{2}|至今|Present|present)?/);
          return {
            school: line.length > 28 ? `${line.slice(0, 28)}...` : line,
            major: "专业待补充",
            degree: "学历待补充",
            duration: durationMatch?.[0] ?? (index === 0 ? "最近教育经历" : "教育经历"),
          };
        })
      : [
          {
            school: "教育经历待补充",
            major: "专业待补充",
            degree: "学历待补充",
            duration: "时间待补充",
          },
        ];

  return { name, contact, education };
}

function buildTemplateResumeData(previewData: ResumePreviewData, profileData: ExtractedProfileData): ResumeData {
  return {
    persona: "experienced",
    personal_info: {
      name: profileData.name,
      contact: profileData.contact,
    },
    professional_summary: previewData.professionalSummary,
    skills: previewData.skills.length > 0 ? previewData.skills : ["技能待补充"],
    internships: [],
    work_experience: previewData.workExperience.map((item) => ({
      company: item.company,
      role: item.role,
      duration: item.duration,
      achievements: item.achievements.length > 0 ? item.achievements : ["经历要点待补充"],
    })),
    education: profileData.education,
    campus_experience: [],
    projects: [],
    awards: [],
    certifications: [],
    languages: [],
  };
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildPreviewData(result: OptimizeResponse, jdText: string): ResumePreviewData {
  const skillCandidates = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "SQL",
    "Go",
    "Docker",
    "Kubernetes",
    "云原生",
    "微服务",
    "项目管理",
    "跨团队协作",
  ];

  const lowerJd = jdText.toLowerCase();
  const skills = skillCandidates.filter((skill) => lowerJd.includes(skill.toLowerCase())).slice(0, 10);

  const workExperience = result.new_experiences.slice(0, 2).map((item, index) => ({
    company: item.company || "公司待补充",
    role: item.role || "岗位待补充",
    duration: index === 0 ? "最近经历" : "过往经历",
    achievements: item.details.length > 0 ? item.details.slice(0, 4) : ["经历要点待补充"],
  }));

  return {
    professionalSummary:
      result.optimizations.slice(0, 2).join("；") || "已生成优化建议，建议继续补充量化成果和业务结果。",
    skills,
    workExperience,
  };
}

function matchScoreTitle(score: number): string {
  if (score >= 80) return "匹配度很高，简历表现不错";
  if (score >= 60) return "整体匹配较好，仍有优化空间";
  return "匹配度偏低，建议继续完善";
}

function matchScoreDescription(score: number): string {
  if (score >= 80) {
    return "核心技能与项目成果已经较好地对齐到目标岗位的主要要求。";
  }

  if (score >= 60) {
    return "基础匹配已经建立，下一步应继续强化量化成果与业务影响。";
  }

  return "建议继续补充与岗位高度相关的项目经历、结果数据和关键词。";
}

export default function ResumeOptimizerWorkspace() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [selectedProvidedTemplateId, setSelectedProvidedTemplateId] = useState<ProvidedTemplate["id"] | "none">("none");

  const canSubmit = useMemo(() => resumeText.trim() && jdText.trim() && !isSubmitting && !isParsingPdf, [resumeText, jdText, isSubmitting, isParsingPdf]);
  const previewData = useMemo(() => (result ? buildPreviewData(result, jdText) : null), [result, jdText]);
  const extractedProfileData = useMemo(() => extractProfileData(resumeText), [resumeText]);
  const templateResumeData = useMemo(() => (previewData ? buildTemplateResumeData(previewData, extractedProfileData) : null), [previewData, extractedProfileData]);
  const selectedProvidedTemplate = selectedProvidedTemplateId === "none" ? null : providedTemplates.find((item) => item.id === selectedProvidedTemplateId) ?? null;

  const templateNode = useMemo(() => {
    if (!templateResumeData || !selectedProvidedTemplate) return null;
    if (selectedProvidedTemplate.id === "template-1") return <HarvardTemplate data={templateResumeData} />;
    if (selectedProvidedTemplate.id === "template-2") return <ModernTechTemplate data={templateResumeData} />;
    return <MinimalistTemplate data={templateResumeData} />;
  }, [templateResumeData, selectedProvidedTemplate]);

  async function parsePdfFile(file: File) {
    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || lowerName.endsWith(".pdf");
    if (!isPdf) {
      throw new Error("请上传 PDF 文件（.pdf）。");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as { text?: string; error?: string };
    if (!response.ok) {
      throw new Error(data.error || "PDF 解析失败");
    }

    const text = data.text?.trim() ?? "";
    if (!text) {
      throw new Error("未从 PDF 中提取到文本，请检查文件内容。");
    }

    setUploadedFileName(file.name);
    setResumeText(text);
  }

  async function handlePdfUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setIsParsingPdf(true);

    try {
      await parsePdfFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF 解析失败");
    } finally {
      setIsParsingPdf(false);
      event.target.value = "";
    }
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file || isParsingPdf || isSubmitting) return;

    setError(null);
    setIsParsingPdf(true);
    try {
      await parsePdfFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF 解析失败");
    } finally {
      setIsParsingPdf(false);
    }
  }

  async function handleOptimize() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      const data = (await response.json()) as OptimizeResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "简历优化失败");
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "简历优化失败");
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContinueInBuilder() {
    if (!templateResumeData) return;
    window.localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(normalizeResumeData(templateResumeData)));
    window.location.href = "/builder";
  }

  const score = clampScore(result?.match_score ?? 0);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-14 text-slate-900 lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-6 rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.9)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI 简历优化器</h1>
          <p className="mt-2 text-sm text-slate-500">上传 PDF 简历或直接粘贴文本，再输入 JD，系统会生成更适合岗位的表达版本。</p>
        </div>

        <section>
          <label className="mb-3 block text-sm font-semibold text-slate-700">原始简历</label>
          <input id="resume-upload" type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
          <label
            htmlFor="resume-upload"
            onDrop={handleDrop}
            onDragEnter={(event) => {
              event.preventDefault();
              if (!isParsingPdf && !isSubmitting) setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDragOver={(event) => event.preventDefault()}
            className={cn(
              "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-[22px] border border-dashed px-4 py-6 text-center transition",
              isDragActive ? "border-[#b85c2c] bg-[#f7efe6]" : "border-stone-300 bg-[#f8f4ed] hover:border-stone-400",
            )}
          >
            <p className="text-sm font-medium text-slate-700">拖拽 PDF 到这里，或点击上传</p>
            <p className="text-xs text-slate-500">仅支持 .pdf 格式</p>
            {uploadedFileName ? <p className="text-xs font-medium text-[#b85c2c]">当前文件：{uploadedFileName}</p> : null}
          </label>
          {isParsingPdf ? <p className="mt-2 text-xs text-slate-500">正在解析 PDF...</p> : null}
        </section>

        <section>
          <label className="mb-3 block text-sm font-semibold text-slate-700" htmlFor="resume-text">简历文本</label>
          <textarea id="resume-text" rows={10} value={resumeText} onChange={(event) => setResumeText(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#b85c2c]" placeholder="如果不上传 PDF，也可以直接粘贴简历文本。" />
        </section>

        <section>
          <label className="mb-3 block text-sm font-semibold text-slate-700" htmlFor="jd-input">职位描述 JD</label>
          <textarea id="jd-input" rows={12} value={jdText} onChange={(event) => setJdText(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#b85c2c]" placeholder="粘贴目标岗位 JD。" />
        </section>

        {error ? <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <button type="button" onClick={handleOptimize} disabled={!canSubmit} className={cn("w-full rounded-full px-4 py-3 font-semibold text-white transition", canSubmit ? "bg-[#b85c2c] hover:bg-[#9f4d24]" : "cursor-not-allowed bg-slate-300")}>
          {isSubmitting ? "正在优化中..." : "优化简历"}
        </button>
      </aside>

      <main className="overflow-hidden rounded-[30px] border border-stone-300/70 bg-[rgba(255,253,250,0.92)] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="border-b border-stone-200 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">简历优化预览</p>
              <p className="mt-1 text-sm text-slate-500">可直接查看优化建议，也可以切换官方模板后继续进入制作页。</p>
            </div>
            <button type="button" onClick={handleContinueInBuilder} disabled={!templateResumeData} className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition", templateResumeData ? "border-[#b85c2c] text-[#b85c2c] hover:bg-[#f7efe6]" : "cursor-not-allowed border-stone-200 text-slate-400")}>
              继续去制作页
            </button>
          </div>
        </div>

        <div className="space-y-8 p-6">
          {!result || !previewData ? (
            <div className="rounded-[24px] border border-dashed border-stone-200 bg-[#f8f4ed] px-6 py-16 text-center">
              <p className="text-base font-semibold text-slate-700">暂无优化结果</p>
              <p className="mt-2 text-sm text-slate-500">上传简历并填写 JD 后，系统会生成匹配度、优化建议和可继续编辑的模板内容。</p>
            </div>
          ) : (
            <>
              <section className="rounded-[24px] border border-stone-200 bg-[#f8f4ed] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{matchScoreTitle(score)}</p>
                    <p className="mt-2 text-sm text-slate-500">{matchScoreDescription(score)}</p>
                  </div>
                  <div className="rounded-full bg-[#b85c2c] px-4 py-2 text-lg font-bold text-white">{score}%</div>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-900">AI 优化摘要</h2>
                <ul className="space-y-2 rounded-[24px] border border-emerald-200 bg-emerald-50/80 px-5 py-4 text-sm text-emerald-900">
                  {result.optimizations.slice(0, 4).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-900">职业摘要</h2>
                <div className="rounded-[24px] border border-stone-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700">{previewData.professionalSummary}</div>
              </section>

              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-900">优化后的经历表达</h2>
                <div className="space-y-4">
                  {previewData.workExperience.map((job) => (
                    <article key={`${job.company}-${job.role}`} className="rounded-[24px] border border-stone-200 bg-white/80 px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{job.role}</h3>
                          <p className="mt-1 text-xs text-slate-500">{job.company} | {job.duration}</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {job.achievements.map((achievement) => (
                          <li key={achievement}>• {achievement}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-900">技能关键词</h2>
                <div className="flex flex-wrap gap-2">
                  {previewData.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-[#ead7c8] bg-[#f7efe6] px-3 py-1 text-xs font-medium text-[#b85c2c]">{skill}</span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-sm font-semibold text-slate-900">官方模板预览</h2>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <button type="button" onClick={() => setSelectedProvidedTemplateId("none")} className={cn("rounded-[22px] border px-3 py-3 text-left transition", selectedProvidedTemplateId === "none" ? "border-[#b85c2c] bg-[#f7efe6] text-[#b85c2c]" : "border-stone-200 bg-white text-slate-700 hover:border-stone-300")}>不使用模板</button>
                  {providedTemplates.map((template) => (
                    <button key={template.id} type="button" onClick={() => setSelectedProvidedTemplateId(template.id)} className={cn("rounded-[22px] border px-3 py-3 text-left transition", selectedProvidedTemplateId === template.id ? "border-[#b85c2c] bg-[#f7efe6] text-[#b85c2c]" : "border-stone-200 bg-white text-slate-700 hover:border-stone-300")}>
                      <p className="text-sm font-semibold">{template.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{template.description}</p>
                    </button>
                  ))}
                </div>

                {templateNode ? (
                  <div className="mt-4 overflow-auto rounded-[24px] border border-stone-200 bg-[#f3efe8] p-3">
                    <div className="mx-auto w-[794px] origin-top scale-[0.42] sm:scale-[0.52] md:scale-[0.6]">
                      <div className="h-[1123px] w-[794px] overflow-hidden rounded-[6px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">{templateNode}</div>
                    </div>
                  </div>
                ) : null}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


