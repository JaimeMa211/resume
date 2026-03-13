"use client";

import { ChangeEvent, DragEvent, useMemo, useState } from "react";

import { HarvardTemplate } from "@/components/templates/HarvardTemplate";
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
import { ModernTechTemplate } from "@/components/templates/ModernTechTemplate";
import type { ResumeData } from "@/components/templates/types";
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
    description: "简约单栏风格",
  },
  {
    id: "template-3",
    label: "模板 3",
    filename: "ZW-00065简约风求职简历模板.pdf",
    description: "求职通用版式",
  },
];

type ExtractedProfileData = {
  name: string;
  contact: string;
  education: ResumeData["education"];
};

function extractProfileData(resumeText: string): ExtractedProfileData {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const name = lines.find((line) => line.length <= 40 && !line.includes("@") && !/\d{6,}/.test(line)) ?? "候选人";
  const contact =
    lines.find((line) => line.includes("@") || /(\+?\d[\d\s-]{6,})/.test(line)) ??
    "联系方式待补充 • 邮箱待补充 • 手机待补充";

  const educationKeywords = /(university|college|school|academy|学院|大学|学校|硕士|本科|博士|master|bachelor|phd)/i;
  const educationLines = lines.filter((line) => educationKeywords.test(line)).slice(0, 2);

  const education =
    educationLines.length > 0
      ? educationLines.map((line, index) => {
          const durationMatch = line.match(/(19|20)\d{2}\s*[-—~至到]+\s*((19|20)\d{2}|至今|Present|present)?/);
          const school = line.length > 28 ? `${line.slice(0, 28)}...` : line;

          return {
            school,
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

  return {
    name,
    contact,
    education,
  };
}

function buildTemplateResumeData(previewData: ResumePreviewData, profileData: ExtractedProfileData): ResumeData {
  return {
    personal_info: {
      name: profileData.name,
      contact: profileData.contact,
    },
    professional_summary: previewData.professionalSummary,
    skills: previewData.skills.length > 0 ? previewData.skills : ["技能待补充"],
    work_experience: previewData.workExperience.map((item) => ({
      company: item.company,
      role: item.role,
      duration: item.duration,
      achievements: item.achievements.length > 0 ? item.achievements : ["经历要点待补充"],
    })),
    education: profileData.education,
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
      result.optimizations.slice(0, 2).join("；") || "已生成优化建议，建议结合岗位要求进一步补充量化成果。",
    skills,
    workExperience,
  };
}

function matchScoreTitle(score: number): string {
  if (score >= 80) return "匹配度很高，简历表现不错！";
  if (score >= 60) return "整体匹配较好，仍有优化空间。";
  return "匹配度偏低，建议继续完善。";
}

function matchScoreDescription(score: number): string {
  if (score >= 80) {
    return "我们已将你的关键技能与项目成果对齐到目标岗位核心要求。";
  }

  if (score >= 60) {
    return "主要技能已经覆盖岗位诉求，建议继续强化量化成果与项目影响。";
  }

  return "建议补充与目标岗位高度相关的项目经历与量化结果，以提升通过率。";
}

function buildWorkExperienceCopyText(job: PreviewExperience): string {
  return [
    `${job.role}`,
    `${job.company} • ${job.duration}`,
    ...job.achievements.map((achievement) => `- ${achievement}`),
  ].join("\n");
}

function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("复制仅支持浏览器环境");
  }

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const copied = copyWithExecCommand(text);
  if (!copied) {
    throw new Error("复制失败，请手动复制");
  }
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
  const [highlightAiChanges, setHighlightAiChanges] = useState(true);
  const [selectedProvidedTemplateId, setSelectedProvidedTemplateId] = useState<ProvidedTemplate["id"] | "none">("none");
  const [copiedExperienceKey, setCopiedExperienceKey] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const isPdfExtracted = uploadedFileName.length > 0 && resumeText.trim().length > 0;

  const canSubmit = useMemo(() => {
    return resumeText.trim().length > 0 && jdText.trim().length > 0 && !isSubmitting && !isParsingPdf;
  }, [resumeText, jdText, isSubmitting, isParsingPdf]);

  const hasResult = !!result;

  const selectedProvidedTemplate =
    selectedProvidedTemplateId === "none"
      ? null
      : providedTemplates.find((template) => template.id === selectedProvidedTemplateId) ?? null;

  const previewData = useMemo(() => {
    if (!result) return null;
    return buildPreviewData(result, jdText);
  }, [result, jdText]);

  const extractedProfileData = useMemo(() => extractProfileData(resumeText), [resumeText]);

  const templateResumeData = useMemo<ResumeData | null>(() => {
    if (!previewData) return null;
    return buildTemplateResumeData(previewData, extractedProfileData);
  }, [previewData, extractedProfileData]);

  const selectedTemplateNode = useMemo(() => {
    if (!templateResumeData || !selectedProvidedTemplate) {
      return null;
    }

    if (selectedProvidedTemplate.id === "template-1") {
      return <HarvardTemplate data={templateResumeData} />;
    }

    if (selectedProvidedTemplate.id === "template-2") {
      return <ModernTechTemplate data={templateResumeData} />;
    }

    return <MinimalistTemplate data={templateResumeData} />;
  }, [templateResumeData, selectedProvidedTemplate]);

  const score = result ? clampScore(result.match_score) : 0;
  const ringRadius = 34;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (score / 100) * ringCircumference;

  const scoreRingClass =
    score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-red-500";

  const optimizationItems = hasResult
    ? result.optimizations.filter((item) => item.trim().length > 0).slice(0, 3)
    : [];

  async function parsePdfFile(file: File) {
    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || lowerName.endsWith(".pdf");

    if (!isPdf) {
      throw new Error("请上传 PDF 文件（.pdf）");
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
      throw new Error("未从 PDF 中提取到文本，请检查文件内容");
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
      const message = err instanceof Error ? err.message : "PDF 解析失败";
      setError(message);
    } finally {
      setIsParsingPdf(false);
      event.target.value = "";
    }
  }

  async function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragActive(false);

    if (isParsingPdf || isSubmitting) return;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setError(null);
    setIsParsingPdf(true);

    try {
      await parsePdfFile(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF 解析失败";
      setError(message);
    } finally {
      setIsParsingPdf(false);
    }
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
  }

  function handleDragEnter(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (!isParsingPdf && !isSubmitting) {
      setIsDragActive(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragActive(false);
  }

  async function handleOptimize() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jdText,
        }),
      });

      const data = (await response.json()) as OptimizeResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "简历优化失败");
      }

      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "简历优化失败";
      setError(message);
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleExportPdf() {
    if (!hasResult) return;
    window.print();
  }

  function handleTemplateSelect(templateId: ProvidedTemplate["id"] | "none") {
    setSelectedProvidedTemplateId(templateId);
  }

  async function handleCopyExperience(job: PreviewExperience) {
    const key = `${job.company}-${job.role}`;

    try {
      await copyTextToClipboard(buildWorkExperienceCopyText(job));
      setCopyError(null);
      setCopiedExperienceKey(key);
      window.setTimeout(() => {
        setCopiedExperienceKey((current) => (current === key ? null : current));
      }, 1800);
    } catch (err) {
      const message = err instanceof Error ? err.message : "复制失败，请重试";
      setCopyError(message);
    }
  }
  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }

        .a4-container {
          width: 100%;
          max-width: 800px;
          min-height: 1122px;
          margin: 2rem auto;
          padding: 3rem;
        }

        .progress-ring-circle {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.35s;
        }

        @media print {
          body {
            background: #fff !important;
          }

          [data-purpose="input-sidebar"],
          [data-purpose="top-nav"] {
            display: none !important;
          }

          [data-purpose="preview-area"] {
            width: 100% !important;
            overflow: visible !important;
            background: #fff !important;
          }

          [data-purpose="a4-wrapper"] {
            overflow: visible !important;
          }

          .a4-container {
            margin: 0 !important;
            padding: 16mm !important;
            max-width: none !important;
            min-height: auto !important;
            border: 0 !important;
            box-shadow: none !important;
            width: 210mm !important;
          }
        }
      `}</style>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 pb-14 text-slate-900 antialiased lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="z-10 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm" data-purpose="input-sidebar">
          <header className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#ec5b13] text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">AI 简历优化器</h1>
            </div>
          </header>

          <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
            <section data-purpose="file-upload">
              <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-slate-700">原始简历</label>
              <input
                id="resume-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfUpload}
                disabled={isParsingPdf || isSubmitting}
              />

              {isPdfExtracted ? (
                <div className="flex items-center justify-between rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <div>
                      <p className="max-w-[160px] truncate text-sm font-medium text-slate-800">{uploadedFileName}</p>
                      <p className="text-xs tracking-tight text-slate-500">最近更新：刚刚</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById("resume-upload")?.click()}
                    className="text-sm font-semibold text-[#ec5b13] transition-all hover:underline"
                    disabled={isParsingPdf || isSubmitting}
                  >
                    替换
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="resume-upload"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed p-4 text-center transition-all",
                    isDragActive
                      ? "border-[#ec5b13] bg-orange-50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100",
                    (isParsingPdf || isSubmitting) && "cursor-not-allowed opacity-70",
                  )}
                >
                  <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <p className="text-sm font-medium text-slate-700">拖拽 PDF 到这里，或点击上传</p>
                  <p className="text-xs text-slate-500">仅支持 .pdf 格式</p>
                </label>
              )}

              {isParsingPdf ? <p className="mt-2 text-xs text-slate-500">正在解析 PDF，请稍候...</p> : null}
            </section>

            <section data-purpose="job-description">
              <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-slate-700" htmlFor="jd-input">
                目标职位描述（JD）
              </label>
              <textarea
                id="jd-input"
                rows={12}
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
                placeholder="请粘贴职位描述，AI 会按岗位要求优化你的简历..."
                className="w-full rounded-[8px] border border-slate-200 text-sm placeholder:text-slate-400 focus:border-[#ec5b13] focus:ring-[#ec5b13]"
              />
            </section>

            {error ? <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div> : null}

            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-[8px] px-4 py-3.5 font-semibold text-white transition-all shadow-sm",
                canSubmit ? "bg-[#ec5b13] hover:bg-[#d6500f] active:scale-[0.98]" : "cursor-not-allowed bg-slate-300",
              )}
              onClick={handleOptimize}
              disabled={!canSubmit}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                  fillRule="evenodd"
                />
              </svg>
              {isSubmitting ? "正在优化中..." : "优化简历"}
            </button>
          </div>
        </aside>

        <main className="relative flex min-h-[760px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" data-purpose="preview-area">
          <nav
            className="z-20 flex w-full flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4"
            data-purpose="top-nav"
          >
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm font-semibold text-slate-700">简历优化预览</p>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={highlightAiChanges}
                  onChange={(event) => setHighlightAiChanges(event.target.checked)}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ec5b13] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                <span className="ml-3 text-sm font-medium text-slate-700">高亮 AI 修改内容：{highlightAiChanges ? "开" : "关"}</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!hasResult}
                className={cn(
                  "flex items-center gap-2 rounded-[8px] px-5 py-2 text-sm font-semibold text-white transition-all",
                  hasResult ? "bg-[#ec5b13] hover:bg-[#d6500f]" : "cursor-not-allowed bg-slate-300",
                )}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                导出 PDF
              </button>
            </div>
          </nav>

          <div className="custom-scrollbar flex-1 overflow-auto" data-purpose="a4-wrapper">
            <div className="a4-container border border-slate-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              {!hasResult || !previewData ? (
                <div className="flex min-h-[900px] flex-col items-center justify-center rounded-[8px] border border-dashed border-slate-200 bg-slate-50 text-center">
                  <p className="text-base font-semibold text-slate-700">暂无优化结果</p>
                  <p className="mt-2 text-sm text-slate-500">请先上传简历并填写 JD，然后点击“优化简历”。</p>
                </div>
              ) : (
                <>
                  <section className="mb-10 flex items-center gap-6 border-b border-slate-100 pb-8" data-purpose="match-score">
                    <div className="relative flex items-center justify-center">
                      <svg className="h-20 w-20">
                        <circle className="text-slate-100" cx="40" cy="40" r={ringRadius} fill="transparent" stroke="currentColor" strokeWidth="6" />
                        <circle
                          className={cn("progress-ring-circle", scoreRingClass)}
                          cx="40"
                          cy="40"
                          r={ringRadius}
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringOffset}
                        />
                      </svg>
                      <span className="absolute text-xl font-bold text-slate-800">{score}%</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">{matchScoreTitle(score)}</h2>
                      <p className="text-sm text-slate-500">{matchScoreDescription(score)}</p>
                    </div>
                  </section>

                  {optimizationItems.length > 0 ? (
                    <section className={cn("mb-10 rounded-[8px] border p-5 transition-colors", highlightAiChanges ? "border-green-100 bg-green-50/70" : "border-slate-200 bg-slate-50")} data-purpose="ai-alert">
                      <div className="flex items-start gap-3">
                        <svg className={cn("mt-0.5 h-5 w-5", highlightAiChanges ? "text-green-600" : "text-slate-500")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path
                            clipRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            fillRule="evenodd"
                          />
                        </svg>
                        <div>
                          <h3 className={cn("mb-2 text-sm font-bold", highlightAiChanges ? "text-green-900" : "text-slate-800")}>AI 优化摘要</h3>
                          <ul className={cn("list-disc space-y-1.5 pl-4 text-xs", highlightAiChanges ? "text-green-800" : "text-slate-700")}>
                            {optimizationItems.map((item, index) => (
                              <li key={`${index}-${item}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>
                  ) : null}

                  <div className="space-y-8" data-purpose="resume-content-body">

                    <section>
                      <h3 className="mb-3 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-widest text-[#ec5b13]">
                        职业摘要
                      </h3>
                      <p
                        className={cn(
                          "text-[13px] leading-relaxed text-slate-700",
                          highlightAiChanges && "rounded-sm border-l-2 border-[#ec5b13] bg-orange-50/30 p-2",
                        )}
                      >
                        {previewData.professionalSummary}
                      </p>
                    </section>

                    {previewData.workExperience.length > 0 ? (
                      <section>
                        <h3 className="mb-4 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-widest text-[#ec5b13]">
                          工作经历
                        </h3>
                        <div className="space-y-6">
                          {previewData.workExperience.map((job) => {
                            const experienceKey = `${job.company}-${job.role}`;
                            const copied = copiedExperienceKey === experienceKey;

                            return (
                              <article key={experienceKey} className="group relative border-l border-slate-100 pl-4">
                                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-300" />
                                <div className="mb-1 flex items-start justify-between">
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900">{job.role}</h4>
                                    <p className="text-xs text-slate-500">
                                      {job.company} • {job.duration}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => void handleCopyExperience(job)}
                                    className={cn(
                                      "rounded p-1.5 text-slate-400 transition-all hover:bg-slate-100",
                                      copied ? "bg-emerald-50 text-emerald-600" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                                    )}
                                    title={copied ? "已复制" : "复制内容"}
                                    aria-label={copied ? "已复制工作经历" : "复制该段工作经历"}
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                <ul className="mt-2 list-disc space-y-2 pl-4 text-[13px] text-slate-700">
                                  {job.achievements.map((achievement, index) => (
                                    <li
                                      key={`${job.company}-${index}`}
                                      className={cn(highlightAiChanges && index < 2 && "rounded-sm bg-orange-50/50 px-1 py-0.5")}
                                    >
                                      {achievement}
                                    </li>
                                  ))}
                                </ul>
                              </article>
                            );
                          })}
                        </div>
                        {copyError ? <p className="mt-3 text-xs text-red-600">{copyError}</p> : null}
                      </section>
                    ) : null}

                    <section data-purpose="template-selector">
                      <h3 className="mb-3 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-widest text-[#ec5b13]">
                        可选官方简历模板
                      </h3>
                      <p className="text-xs text-slate-500">可选择继续使用当前优化版，也可选择 3 种模板进行实时套版预览。</p>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect("none")}
                          className={cn(
                            "rounded-[8px] border px-3 py-2 text-left transition-all",
                            selectedProvidedTemplateId === "none"
                              ? "border-[#ec5b13] bg-orange-50 text-[#ec5b13]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                          )}
                        >
                          <p className="text-sm font-semibold">不使用官方模板</p>
                          <p className="text-xs text-slate-500">保留当前优化结果</p>
                        </button>

                        {providedTemplates.map((template) => {
                          const active = selectedProvidedTemplateId === template.id;

                          return (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => handleTemplateSelect(template.id)}
                              className={cn(
                                "rounded-[8px] border px-3 py-2 text-left transition-all",
                                active
                                  ? "border-[#ec5b13] bg-orange-50 text-[#ec5b13]"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                              )}
                            >
                              <p className="text-sm font-semibold">{template.label}</p>
                              <p className="text-xs text-slate-500">{template.description}</p>
                            </button>
                          );
                        })}
                      </div>

                      {selectedProvidedTemplate ? (
                        <div className="mt-3 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          <p>
                            已选择：{selectedProvidedTemplate.label}（{selectedProvidedTemplate.filename}）。
                            当前内容会基于用户简历 + AI 优化结果实时渲染。
                          </p>
                        </div>
                      ) : null}

                      {selectedTemplateNode && templateResumeData ? (
                        <div className="mt-4 space-y-2" data-purpose="template-live-preview">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-700">模板实时预览（Canvas 风格）</p>
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-[#ec5b13]">实时反馈</span>
                          </div>

                          <div className="custom-scrollbar overflow-auto rounded-[10px] border border-slate-200 bg-slate-100 p-3">
                            <div className="mx-auto w-[794px] origin-top scale-[0.42] sm:scale-[0.52] md:scale-[0.6]">
                              <div className="h-[1123px] w-[794px] overflow-hidden rounded-[6px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                                {selectedTemplateNode}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </section>

                    {previewData.skills.length > 0 ? (
                      <section>
                        <h3 className="mb-3 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-widest text-[#ec5b13]">
                          技能与技术栈
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {previewData.skills.map((skill, index) => (
                            <span
                              key={skill}
                              className={cn(
                                "rounded-sm border px-2 py-1 text-[12px] font-medium",
                                highlightAiChanges && index < 3
                                  ? "border-orange-200 bg-orange-100 text-[#ec5b13]"
                                  : "border-slate-200 bg-slate-100 text-slate-700",
                              )}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}





































