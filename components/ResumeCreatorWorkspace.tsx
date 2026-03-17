"use client";

import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Download,
  FileStack,
  GraduationCap,
  Languages,
  Mail,
  Medal,
  PencilLine,
  Plus,
  Rocket,
  RotateCcw,
  Save,
  Sparkles,
  Trophy,
  Trash2,
  UserRound,
  WandSparkles,
} from "lucide-react";

import { ResumeBuilder, type ResumeBuilderHandle } from "@/components/ResumeBuilder";
import { ResumePhoto } from "@/components/templates/ResumePhoto";
import type {
  Award,
  CampusExperience,
  Certification,
  Education,
  InternshipExperience,
  LanguageSkill,
  ProjectExperience,
  ResumeData,
  ResumeModuleId,
  ResumePersona,
  WorkExperience,
} from "@/components/templates/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BUILDER_DRAFT_STORAGE_KEY,
  createEmptyResumeData,
  createStarterResumeData,
  normalizeResumeData,
  parseMultilineText,
  toMultilineText,
} from "@/lib/resume-data";
import { RESUME_MODULE_CATALOG, getModuleLabel, getResumePersonaDefinition, getVisibleResumeModules } from "@/lib/resume-personas";
import { cn } from "@/lib/utils";

type RoleExperienceTextField = "company" | "role" | "duration";
type EducationTextField = "school" | "major" | "degree" | "duration";
type CampusTextField = "organization" | "role" | "duration";
type ProjectTextField = "name" | "role" | "duration";
type AwardTextField = "name" | "issuer" | "date" | "detail";
type CertificationTextField = "name" | "issuer" | "date";
type LanguageTextField = "name" | "proficiency";
type WorkspaceSectionId = "ai" | ResumeModuleId;

type GenerateDraftResponse = ResumeData & { error?: string };

type SectionMeta = {
  id: WorkspaceSectionId;
  title: string;
  description: string;
  badge: string;
  icon: typeof Sparkles;
};

const inputClassName =
  "w-full rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#d97745] focus:ring-4 focus:ring-[#f3d5c2]/60";

const personaOrder: ResumePersona[] = ["intern", "graduate", "experienced"];
const MAX_RESUME_PHOTO_FILE_SIZE = 5 * 1024 * 1024;
const MAX_RESUME_PHOTO_EDGE = 720;
const RESUME_PHOTO_OUTPUT_QUALITY = 0.82;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("图片读取失败，请重试"));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片处理失败，请更换文件后重试"));
    image.src = src;
  });
}

async function optimizeResumePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("请上传 JPG、PNG 或 WebP 图片");
  }

  if (file.size > MAX_RESUME_PHOTO_FILE_SIZE) {
    throw new Error("图片请控制在 5MB 以内");
  }

  const source = await readFileAsDataUrl(file);
  if (!source) {
    throw new Error("图片读取失败，请重试");
  }

  const image = await loadImageElement(source);
  const longestEdge = Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const scale = longestEdge > MAX_RESUME_PHOTO_EDGE ? MAX_RESUME_PHOTO_EDGE / longestEdge : 1;
  const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("浏览器暂不支持图片处理，请更换浏览器后重试");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", RESUME_PHOTO_OUTPUT_QUALITY);
}

function createRoleExperienceItem(): WorkExperience {
  return {
    company: "",
    role: "",
    duration: "",
    achievements: [],
  };
}

function createInternshipItem(): InternshipExperience {
  return createRoleExperienceItem();
}

function createEducationItem(): Education {
  return {
    school: "",
    major: "",
    degree: "",
    duration: "",
  };
}

function createCampusItem(): CampusExperience {
  return {
    organization: "",
    role: "",
    duration: "",
    highlights: [],
  };
}

function createProjectItem(): ProjectExperience {
  return {
    name: "",
    role: "",
    duration: "",
    highlights: [],
  };
}

function createAwardItem(): Award {
  return {
    name: "",
    issuer: "",
    date: "",
    detail: "",
  };
}

function createCertificationItem(): Certification {
  return {
    name: "",
    issuer: "",
    date: "",
  };
}

function createLanguageItem(): LanguageSkill {
  return {
    name: "",
    proficiency: "",
  };
}

function WorkspaceCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-[28px] border border-stone-300/70 bg-[#fffdfa] shadow-[0_12px_40px_rgba(15,23,42,0.05)]", className)}>{children}</section>;
}

function SectionPanel({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <WorkspaceCard>
      <div className="space-y-5 px-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {children}
      </div>
    </WorkspaceCard>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
        <span>{label}</span>
        {hint ? <span className="text-xs font-normal text-slate-400">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/90 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-2 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function NavigationButton({
  active,
  title,
  description,
  badge,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  badge: string;
  icon: typeof Sparkles;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full rounded-3xl border px-4 py-4 text-left transition",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)]"
          : "border-stone-200 bg-white/90 text-slate-800 hover:border-stone-300 hover:bg-stone-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border",
              active ? "border-white/20 bg-white/10 text-white" : "border-stone-200 bg-[#f7efe6] text-[#b85c2c]",
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className={cn("mt-1 text-xs leading-5", active ? "text-white/70" : "text-slate-500")}>{description}</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            active ? "bg-white/12 text-white/85" : "bg-stone-100 text-slate-500",
          )}
        >
          {badge}
        </span>
      </div>
    </button>
  );
}

function PersonaButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[22px] border px-4 py-4 text-left transition",
        active
          ? "border-slate-900 bg-slate-900 text-white shadow-[0_18px_35px_rgba(15,23,42,0.14)]"
          : "border-stone-200 bg-white text-slate-800 hover:border-stone-300 hover:bg-stone-50",
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className={cn("mt-2 text-xs leading-5", active ? "text-white/75" : "text-slate-500")}>{description}</p>
    </button>
  );
}

function ItemCard({ title, index, onDelete, children }: { title: string; index: number; onDelete: () => void; children: ReactNode }) {
  return (
    <div className="rounded-[26px] border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">条目 {index + 1}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          删除
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="rounded-[24px] border border-dashed border-stone-300 bg-white px-5 py-6 text-sm text-slate-500">{text}</div>;
}

function sectionIcon(moduleId: ResumeModuleId): typeof Sparkles {
  switch (moduleId) {
    case "profile":
      return UserRound;
    case "summary":
      return PencilLine;
    case "skills":
      return Sparkles;
    case "education":
      return GraduationCap;
    case "internships":
      return BriefcaseBusiness;
    case "campus":
      return Medal;
    case "work":
      return BriefcaseBusiness;
    case "projects":
      return Rocket;
    case "awards":
      return Trophy;
    case "credentials":
      return Languages;
    default:
      return Sparkles;
  }
}

function countBadge(required: boolean, count: number, suffix: string) {
  if (count > 0) {
    return `${count}${suffix}`;
  }

  return required ? "必填" : "选填";
}

export default function ResumeCreatorWorkspace() {
  const [draft, setDraft] = useState<ResumeData>(() => createStarterResumeData("graduate"));
  const resumeBuilderRef = useRef<ResumeBuilderHandle>(null);
  const [activeSection, setActiveSection] = useState<WorkspaceSectionId>("profile");
  const [hydrated, setHydrated] = useState(false);
  const [saveMessage, setSaveMessage] = useState("正在读取本地草稿...");
  const [sourceText, setSourceText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BUILDER_DRAFT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        setDraft(normalizeResumeData(parsed));
        setSaveMessage("已恢复上次编辑的草稿");
      } else {
        setSaveMessage("当前为示例草稿，可以直接修改或切换身份预设");
      }
    } catch {
      setSaveMessage("草稿读取失败，已回退到示例内容");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setSaveMessage("内容已自动保存在当前浏览器");
  }, [draft, hydrated]);

  const personaDefinition = useMemo(() => getResumePersonaDefinition(draft.persona), [draft.persona]);
  const visibleModuleRules = useMemo(() => getVisibleResumeModules(draft.persona), [draft.persona]);
  const visibleModuleIds = useMemo(() => visibleModuleRules.map((item) => item.id), [visibleModuleRules]);

  useEffect(() => {
    if (activeSection !== "ai" && !visibleModuleIds.includes(activeSection)) {
      setActiveSection(visibleModuleIds[0] ?? "profile");
    }
  }, [activeSection, visibleModuleIds]);

  function updatePersonalInfo(field: keyof ResumeData["personal_info"], value: string) {
    setDraft((current) => ({
      ...current,
      personal_info: {
        ...current.personal_info,
        [field]: value,
      },
    }));
  }

  function updateInternship(index: number, field: RoleExperienceTextField, value: string) {
    setDraft((current) => ({
      ...current,
      internships: current.internships.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function updateInternshipAchievements(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      internships: current.internships.map((item, itemIndex) =>
        itemIndex === index ? { ...item, achievements: parseMultilineText(value) } : item,
      ),
    }));
  }

  function updateWorkExperience(index: number, field: RoleExperienceTextField, value: string) {
    setDraft((current) => ({
      ...current,
      work_experience: current.work_experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateWorkAchievements(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      work_experience: current.work_experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, achievements: parseMultilineText(value) } : item,
      ),
    }));
  }

  function updateEducation(index: number, field: EducationTextField, value: string) {
    setDraft((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function updateCampus(index: number, field: CampusTextField, value: string) {
    setDraft((current) => ({
      ...current,
      campus_experience: current.campus_experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateCampusHighlights(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      campus_experience: current.campus_experience.map((item, itemIndex) =>
        itemIndex === index ? { ...item, highlights: parseMultilineText(value) } : item,
      ),
    }));
  }

  function updateProject(index: number, field: ProjectTextField, value: string) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function updateProjectHighlights(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, highlights: parseMultilineText(value) } : item,
      ),
    }));
  }

  function updateAward(index: number, field: AwardTextField, value: string) {
    setDraft((current) => ({
      ...current,
      awards: current.awards.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function updateCertification(index: number, field: CertificationTextField, value: string) {
    setDraft((current) => ({
      ...current,
      certifications: current.certifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function updateLanguage(index: number, field: LanguageTextField, value: string) {
    setDraft((current) => ({
      ...current,
      languages: current.languages.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function switchPersona(persona: ResumePersona) {
    if (persona === draft.persona) {
      return;
    }

    setDraft((current) => ({
      ...current,
      persona,
    }));
    setSaveMessage(`已切换到${getResumePersonaDefinition(persona).label}预设，当前内容已保留`);
  }

  async function handleGenerateDraft() {
    if (!sourceText.trim() && !jdText.trim() && !notes.trim()) {
      setGenerateError("请至少填写原始简历、JD 或补充说明中的一项，再让 AI 帮你起草。");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: draft.persona,
          sourceText,
          targetRole,
          jdText,
          notes,
        }),
      });

      const payload = (await response.json()) as GenerateDraftResponse;
      if (!response.ok) {
        throw new Error(payload.error || "AI 草稿生成失败");
      }

      setDraft({
        ...normalizeResumeData(payload),
        persona: draft.persona,
      });
      setSaveMessage("AI 草稿已生成，并同步写入当前工作区");
      setActiveSection("profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI 草稿生成失败";
      setGenerateError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  function resetToEmpty() {
    const emptyDraft = createEmptyResumeData(draft.persona);
    setDraft(emptyDraft);
    window.localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(emptyDraft));
    setSaveMessage("已清空当前草稿");
  }

  function resetToStarter() {
    const starterDraft = createStarterResumeData(draft.persona);
    setDraft(starterDraft);
    window.localStorage.setItem(BUILDER_DRAFT_STORAGE_KEY, JSON.stringify(starterDraft));
    setSaveMessage(`已恢复${personaDefinition.label}示例简历`);
  }

  const documentTitle = draft.personal_info.name?.trim()
    ? `${draft.personal_info.name} 的简历`
    : targetRole.trim()
      ? `${targetRole.trim()} 简历`
      : `${personaDefinition.label}简历`;

  const sections: SectionMeta[] = useMemo(() => {
    const dynamicSections = visibleModuleRules.map((rule) => {
      let badge = rule.required ? "必填" : "选填";

      switch (rule.id) {
        case "profile":
          badge = draft.personal_info.name ? "已填" : rule.required ? "必填" : "选填";
          break;
        case "summary":
          badge = draft.professional_summary.trim() ? "已填" : rule.required ? "必填" : "选填";
          break;
        case "skills":
          badge = countBadge(rule.required, draft.skills.length, "项");
          break;
        case "education":
          badge = countBadge(rule.required, draft.education.length, "段");
          break;
        case "internships":
          badge = countBadge(rule.required, draft.internships.length, "段");
          break;
        case "campus":
          badge = countBadge(rule.required, draft.campus_experience.length, "段");
          break;
        case "work":
          badge = countBadge(rule.required, draft.work_experience.length, "段");
          break;
        case "projects":
          badge = countBadge(rule.required, draft.projects.length, "个");
          break;
        case "awards":
          badge = countBadge(rule.required, draft.awards.length, "项");
          break;
        case "credentials":
          badge = countBadge(rule.required, draft.certifications.length + draft.languages.length, "条");
          break;
      }

      return {
        id: rule.id,
        title: getModuleLabel(draft.persona, rule.id),
        description: rule.id === "summary" ? personaDefinition.summaryHint : RESUME_MODULE_CATALOG[rule.id].description,
        badge,
        icon: sectionIcon(rule.id),
      } satisfies SectionMeta;
    });

    return [
      {
        id: "ai",
        title: "AI 起草",
        description: "粘贴旧简历、JD 或补充说明，先生成一版结构化内容。",
        badge: isGenerating ? "生成中" : "可选",
        icon: WandSparkles,
      },
      ...dynamicSections,
    ];
  }, [draft, isGenerating, personaDefinition, visibleModuleRules]);

  const activeMeta = sections.find((section) => section.id === activeSection) ?? sections[0];

  function renderProfileSection() {
    return (
      <SectionPanel eyebrow="Profile" title="把抬头信息写得清楚" description="个人信息不需要复杂，但必须让招聘方在几秒内知道你是谁、想投什么岗位，以及如何联系你。">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="姓名">
            <input value={draft.personal_info.name} onChange={(event) => updatePersonalInfo("name", event.target.value)} className={inputClassName} placeholder="例如：张三" />
          </Field>
          <Field label="求职标题">
            <input value={draft.personal_info.headline ?? ""} onChange={(event) => updatePersonalInfo("headline", event.target.value)} className={inputClassName} placeholder="例如：新媒体运营 / 高级前端工程师" />
          </Field>
          <Field label="手机号">
            <input value={draft.personal_info.phone ?? ""} onChange={(event) => updatePersonalInfo("phone", event.target.value)} className={inputClassName} placeholder="138-0000-0000" />
          </Field>
          <Field label="邮箱">
            <input value={draft.personal_info.email ?? ""} onChange={(event) => updatePersonalInfo("email", event.target.value)} className={inputClassName} placeholder="hello@example.com" />
          </Field>
          <Field label="所在地">
            <input value={draft.personal_info.location ?? ""} onChange={(event) => updatePersonalInfo("location", event.target.value)} className={inputClassName} placeholder="上海 / 北京 / 深圳" />
          </Field>
          <Field label="个人网站">
            <input value={draft.personal_info.website ?? ""} onChange={(event) => updatePersonalInfo("website", event.target.value)} className={inputClassName} placeholder="https://your-site.com" />
          </Field>
          <Field label="LinkedIn">
            <input value={draft.personal_info.linkedin ?? ""} onChange={(event) => updatePersonalInfo("linkedin", event.target.value)} className={inputClassName} placeholder="linkedin.com/in/your-name" />
          </Field>
          <Field label="GitHub">
            <input value={draft.personal_info.github ?? ""} onChange={(event) => updatePersonalInfo("github", event.target.value)} className={inputClassName} placeholder="github.com/your-name" />
          </Field>
        </div>

        <Field label="自定义联系串" hint="填写后会优先显示在简历头部">
          <input
            value={draft.personal_info.contact ?? ""}
            onChange={(event) => updatePersonalInfo("contact", event.target.value)}
            className={inputClassName}
            placeholder="例如：138-0000-0000 | hello@example.com | 上海"
          />
        </Field>
      </SectionPanel>
    );
  }

  function renderSummarySection() {
    return (
      <SectionPanel eyebrow="Summary" title={personaDefinition.summaryTitle} description={personaDefinition.summaryHint}>
        <Field label={personaDefinition.summaryTitle} hint="建议 3 到 4 句，优先写方向、年限、能力和结果">
          <Textarea
            value={draft.professional_summary}
            onChange={(event) => setDraft((current) => ({ ...current, professional_summary: event.target.value }))}
            rows={6}
            className="min-h-32 rounded-2xl border-stone-300 bg-white px-4 py-3"
            placeholder={
              draft.persona === "experienced"
                ? "例如：5 年 B 端产品经验，主导后台系统和流程优化项目，擅长跨部门协作与需求落地，持续推动效率提升。"
                : "例如：新闻传播专业应届生，拥有内容运营实习和校园活动策划经验，执行力强，能够快速理解业务并完成交付。"
            }
          />
        </Field>
      </SectionPanel>
    );
  }

  function renderSkillsSection() {
    return (
      <SectionPanel eyebrow="Skills" title="技能关键词" description="只保留和目标岗位强相关的技能标签。能支撑项目、实习、工作经历的关键词，才值得放进来。">
        <Field label="技能关键词" hint="每行一个，或使用逗号分隔">
          <Textarea
            value={toMultilineText(draft.skills)}
            onChange={(event) => setDraft((current) => ({ ...current, skills: parseMultilineText(event.target.value) }))}
            rows={8}
            className="min-h-36 rounded-2xl border-stone-300 bg-white px-4 py-3"
            placeholder="React\nTypeScript\nSQL\n活动策划\n数据分析"
          />
        </Field>
      </SectionPanel>
    );
  }

  function renderRoleExperienceSection(options: {
    eyebrow: string;
    title: string;
    description: string;
    items: WorkExperience[];
    emptyText: string;
    addLabel: string;
    onAdd: () => void;
    onDelete: (index: number) => void;
    onFieldChange: (index: number, field: RoleExperienceTextField, value: string) => void;
    onAchievementsChange: (index: number, value: string) => void;
  }) {
    return (
      <SectionPanel eyebrow={options.eyebrow} title={options.title} description={options.description}>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4">
          <p className="text-sm text-slate-600">建议每段经历写 2 到 4 条要点，尽量使用“做了什么 + 产出什么”的结果导向表达。</p>
          <Button type="button" variant="outline" className="h-10 rounded-full border-stone-300 bg-white px-4 text-slate-800 hover:bg-stone-100" onClick={options.onAdd}>
            <Plus className="h-4 w-4" />
            {options.addLabel}
          </Button>
        </div>

        {options.items.length === 0 ? <EmptyHint text={options.emptyText} /> : null}

        <div className="space-y-4">
          {options.items.map((item, index) => (
            <ItemCard key={`${options.eyebrow}-${index}`} title={item.role || item.company || `${options.title} ${index + 1}`} index={index} onDelete={() => options.onDelete(index)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="公司 / 机构">
                  <input value={item.company} onChange={(event) => options.onFieldChange(index, "company", event.target.value)} className={inputClassName} placeholder="例如：某互联网公司" />
                </Field>
                <Field label="岗位 / 角色">
                  <input value={item.role} onChange={(event) => options.onFieldChange(index, "role", event.target.value)} className={inputClassName} placeholder="例如：产品运营实习生" />
                </Field>
              </div>
              <Field label="时间">
                <input value={item.duration} onChange={(event) => options.onFieldChange(index, "duration", event.target.value)} className={inputClassName} placeholder="例如：2024.07 - 2024.10" />
              </Field>
              <Field label="经历亮点" hint="每行一个要点">
                <Textarea
                  value={toMultilineText(item.achievements)}
                  onChange={(event) => options.onAchievementsChange(index, event.target.value)}
                  rows={5}
                  className="min-h-28 rounded-2xl border-stone-300 bg-white px-4 py-3"
                  placeholder="例如：负责内容排期与选题执行，支持多渠道传播并完成数据复盘。"
                />
              </Field>
            </ItemCard>
          ))}
        </div>
      </SectionPanel>
    );
  }

  function renderEducationSection() {
    return (
      <SectionPanel eyebrow="Education" title="教育背景" description="学生阶段可以补充绩点、主修课程或研究方向；职场阶段则保持简洁，只保留和岗位相关的核心信息。">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4">
          <p className="text-sm text-slate-600">通常保留最高学历或与岗位最相关的一段教育经历即可。</p>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-stone-300 bg-white px-4 text-slate-800 hover:bg-stone-100"
            onClick={() => setDraft((current) => ({ ...current, education: [...current.education, createEducationItem()] }))}
          >
            <Plus className="h-4 w-4" />
            添加教育经历
          </Button>
        </div>

        {draft.education.length === 0 ? <EmptyHint text="还没有教育背景，点击右上角添加。" /> : null}

        <div className="space-y-4">
          {draft.education.map((education, index) => (
            <ItemCard
              key={`education-${index}`}
              title={education.school || `教育经历 ${index + 1}`}
              index={index}
              onDelete={() =>
                setDraft((current) => ({
                  ...current,
                  education: current.education.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="学校">
                  <input value={education.school} onChange={(event) => updateEducation(index, "school", event.target.value)} className={inputClassName} placeholder="例如：同济大学" />
                </Field>
                <Field label="时间">
                  <input value={education.duration} onChange={(event) => updateEducation(index, "duration", event.target.value)} className={inputClassName} placeholder="例如：2021.09 - 2025.06" />
                </Field>
                <Field label="专业">
                  <input value={education.major} onChange={(event) => updateEducation(index, "major", event.target.value)} className={inputClassName} placeholder="例如：计算机科学与技术" />
                </Field>
                <Field label="学历">
                  <input value={education.degree} onChange={(event) => updateEducation(index, "degree", event.target.value)} className={inputClassName} placeholder="例如：本科 / 硕士" />
                </Field>
              </div>
            </ItemCard>
          ))}
        </div>
      </SectionPanel>
    );
  }

  function renderCampusSection() {
    return (
      <SectionPanel eyebrow="Campus" title="校园经历" description="学生会、社团、竞赛组织、志愿活动都可以写，但重点依然是你承担的角色和结果，不是简单罗列参与过。">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4">
          <p className="text-sm text-slate-600">挑最能证明组织协调、执行力或岗位相关能力的经历来写。</p>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-stone-300 bg-white px-4 text-slate-800 hover:bg-stone-100"
            onClick={() => setDraft((current) => ({ ...current, campus_experience: [...current.campus_experience, createCampusItem()] }))}
          >
            <Plus className="h-4 w-4" />
            添加校园经历
          </Button>
        </div>

        {draft.campus_experience.length === 0 ? <EmptyHint text="暂无校园经历，可补充学生组织、社团、竞赛或志愿活动。" /> : null}

        <div className="space-y-4">
          {draft.campus_experience.map((item, index) => (
            <ItemCard
              key={`campus-${index}`}
              title={item.role || item.organization || `校园经历 ${index + 1}`}
              index={index}
              onDelete={() =>
                setDraft((current) => ({
                  ...current,
                  campus_experience: current.campus_experience.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="组织 / 团队">
                  <input value={item.organization} onChange={(event) => updateCampus(index, "organization", event.target.value)} className={inputClassName} placeholder="例如：校学生会宣传部" />
                </Field>
                <Field label="角色 / 职务">
                  <input value={item.role} onChange={(event) => updateCampus(index, "role", event.target.value)} className={inputClassName} placeholder="例如：部长 / 干事 / 项目负责人" />
                </Field>
              </div>
              <Field label="时间">
                <input value={item.duration} onChange={(event) => updateCampus(index, "duration", event.target.value)} className={inputClassName} placeholder="例如：2023.09 - 2024.06" />
              </Field>
              <Field label="经历亮点" hint="每行一个要点">
                <Textarea
                  value={toMultilineText(item.highlights)}
                  onChange={(event) => updateCampusHighlights(index, event.target.value)}
                  rows={5}
                  className="min-h-28 rounded-2xl border-stone-300 bg-white px-4 py-3"
                  placeholder="例如：负责校园讲座现场执行与嘉宾对接，协助完成宣传物料和报名流程搭建。"
                />
              </Field>
            </ItemCard>
          ))}
        </div>
      </SectionPanel>
    );
  }

  function renderProjectSection() {
    return (
      <SectionPanel eyebrow="Projects" title="项目经历" description="项目是承上启下的证明材料。无论是课程项目、社团项目还是业务项目，都要写清你负责了什么、做成了什么。">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4">
          <p className="text-sm text-slate-600">优先保留代表性项目，不要把所有事情都堆在简历里。</p>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-stone-300 bg-white px-4 text-slate-800 hover:bg-stone-100"
            onClick={() => setDraft((current) => ({ ...current, projects: [...current.projects, createProjectItem()] }))}
          >
            <Plus className="h-4 w-4" />
            添加项目
          </Button>
        </div>

        {draft.projects.length === 0 ? <EmptyHint text="还没有项目经历，可以补充课程项目、作品集项目或业务项目。" /> : null}

        <div className="space-y-4">
          {draft.projects.map((project, index) => (
            <ItemCard
              key={`project-${index}`}
              title={project.name || `项目 ${index + 1}`}
              index={index}
              onDelete={() =>
                setDraft((current) => ({
                  ...current,
                  projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="项目名称">
                  <input value={project.name} onChange={(event) => updateProject(index, "name", event.target.value)} className={inputClassName} placeholder="例如：增长运营中台" />
                </Field>
                <Field label="你的角色">
                  <input value={project.role} onChange={(event) => updateProject(index, "role", event.target.value)} className={inputClassName} placeholder="例如：项目负责人 / 核心成员" />
                </Field>
              </div>
              <Field label="时间">
                <input value={project.duration} onChange={(event) => updateProject(index, "duration", event.target.value)} className={inputClassName} placeholder="例如：2024.01 - 2024.12" />
              </Field>
              <Field label="项目亮点" hint="每行一个要点">
                <Textarea
                  value={toMultilineText(project.highlights)}
                  onChange={(event) => updateProjectHighlights(index, event.target.value)}
                  rows={5}
                  className="min-h-28 rounded-2xl border-stone-300 bg-white px-4 py-3"
                  placeholder="例如：设计后台数据看板和权限体系，支持运营团队自助分析和活动复盘。"
                />
              </Field>
            </ItemCard>
          ))}
        </div>
      </SectionPanel>
    );
  }

  function renderAwardsSection() {
    return (
      <SectionPanel eyebrow="Awards" title="荣誉奖项" description="奖项不是必填，但如果能强化你的竞争力，可以作为简历后半部分的信任补充。">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4">
          <p className="text-sm text-slate-600">奖项建议只保留高含金量、与岗位相关或最近两年的内容。</p>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-stone-300 bg-white px-4 text-slate-800 hover:bg-stone-100"
            onClick={() => setDraft((current) => ({ ...current, awards: [...current.awards, createAwardItem()] }))}
          >
            <Plus className="h-4 w-4" />
            添加奖项
          </Button>
        </div>

        {draft.awards.length === 0 ? <EmptyHint text="暂无荣誉奖项，可补充竞赛、奖学金、称号或认证结果。" /> : null}

        <div className="space-y-4">
          {draft.awards.map((award, index) => (
            <ItemCard
              key={`award-${index}`}
              title={award.name || `奖项 ${index + 1}`}
              index={index}
              onDelete={() =>
                setDraft((current) => ({
                  ...current,
                  awards: current.awards.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="奖项名称">
                  <input value={award.name} onChange={(event) => updateAward(index, "name", event.target.value)} className={inputClassName} placeholder="例如：国家奖学金" />
                </Field>
                <Field label="授予机构">
                  <input value={award.issuer} onChange={(event) => updateAward(index, "issuer", event.target.value)} className={inputClassName} placeholder="例如：教育部" />
                </Field>
                <Field label="日期">
                  <input value={award.date} onChange={(event) => updateAward(index, "date", event.target.value)} className={inputClassName} placeholder="例如：2024.12" />
                </Field>
              </div>
              <Field label="补充说明">
                <input value={award.detail ?? ""} onChange={(event) => updateAward(index, "detail", event.target.value)} className={inputClassName} placeholder="例如：省级二等奖，负责方案策划与答辩" />
              </Field>
            </ItemCard>
          ))}
        </div>
      </SectionPanel>
    );
  }

  function renderCredentialsSection() {
    return (
      <SectionPanel eyebrow="Credentials" title="证书与语言" description="英语、计算机和专业证书可以增强可信度，但只保留能帮助岗位判断的内容。">
        <div className="grid gap-4 xl:grid-cols-2">
          <WorkspaceCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Certifications</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">证书</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full min-w-[112px] justify-center rounded-full border-stone-300 bg-white px-3 text-slate-800 hover:bg-stone-100 sm:w-auto"
                onClick={() => setDraft((current) => ({ ...current, certifications: [...current.certifications, createCertificationItem()] }))}
              >
                <Plus className="h-4 w-4" />
                添加
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {draft.certifications.length === 0 ? <EmptyHint text="暂无证书信息。" /> : null}
              {draft.certifications.map((item, index) => (
                <ItemCard
                  key={`cert-${index}`}
                  title={item.name || `证书 ${index + 1}`}
                  index={index}
                  onDelete={() =>
                    setDraft((current) => ({
                      ...current,
                      certifications: current.certifications.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                >
                  <div className="grid gap-4">
                    <Field label="证书名称">
                      <input value={item.name} onChange={(event) => updateCertification(index, "name", event.target.value)} className={inputClassName} placeholder="例如：PMP / 普通话一级乙等" />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Languages</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">语言</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full min-w-[112px] justify-center rounded-full border-stone-300 bg-white px-3 text-slate-800 hover:bg-stone-100 sm:w-auto"
                onClick={() => setDraft((current) => ({ ...current, languages: [...current.languages, createLanguageItem()] }))}
              >
                <Plus className="h-4 w-4" />
                添加
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {draft.languages.length === 0 ? <EmptyHint text="暂无语言信息。" /> : null}
              {draft.languages.map((item, index) => (
                <ItemCard
                  key={`language-${index}`}
                  title={item.name || `语言 ${index + 1}`}
                  index={index}
                  onDelete={() =>
                    setDraft((current) => ({
                      ...current,
                      languages: current.languages.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="语言">
                      <input value={item.name} onChange={(event) => updateLanguage(index, "name", event.target.value)} className={inputClassName} placeholder="例如：英语" />
                    </Field>
                    <Field label="熟练度">
                      <input value={item.proficiency} onChange={(event) => updateLanguage(index, "proficiency", event.target.value)} className={inputClassName} placeholder="例如：CET-6 / 可用于工作沟通" />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </div>
          </WorkspaceCard>
        </div>
      </SectionPanel>
    );
  }

  function renderAiSection() {
    return (
      <SectionPanel eyebrow="AI Draft" title="先让 AI 起一版，再人工打磨" description="AI 负责把原始信息结构化，你再基于身份预设完善重点模块。最终简历结构会和当前身份策略保持一致。">
        <div className="grid gap-4 md:grid-cols-4">
          <MiniStat title="当前身份" value={personaDefinition.label} />
          <MiniStat title="目标岗位" value={targetRole.trim() || "未填写"} />
          <MiniStat title="草稿状态" value={isGenerating ? "AI 生成中" : "随时可生成"} />
          <MiniStat title="编辑保存" value={hydrated ? "本地自动保存" : "准备中"} />
        </div>

        <Field label="目标岗位" hint="可选，但有助于 AI 聚焦措辞">
          <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className={inputClassName} placeholder="例如：内容运营 / 前端工程师 / 产品经理" />
        </Field>

        <Field label="原始简历内容" hint="可以直接粘贴旧简历正文或 PDF 解析后的文本">
          <Textarea
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            rows={8}
            className="min-h-36 rounded-2xl border-stone-300 bg-white px-4 py-3"
            placeholder="粘贴当前简历正文，或 PDF 解析出的文本内容。"
          />
        </Field>

        <div className="grid gap-4 xl:grid-cols-2">
          <Field label="职位描述 JD">
            <Textarea
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              rows={7}
              className="min-h-32 rounded-2xl border-stone-300 bg-white px-4 py-3"
              placeholder="贴目标岗位 JD，让生成内容更贴近招聘方关注点。"
            />
          </Field>
          <Field label="补充说明">
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={7}
              className="min-h-32 rounded-2xl border-stone-300 bg-white px-4 py-3"
              placeholder="补充行业背景、想突出的问题、语气偏好或特殊经历。"
            />
          </Field>
        </div>

        {generateError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{generateError}</div> : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" className="h-11 rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800" onClick={handleGenerateDraft} disabled={isGenerating}>
            <WandSparkles className="h-4 w-4" />
            {isGenerating ? "AI 生成中..." : "生成结构化草稿"}
          </Button>
          <p className="text-sm text-slate-500">生成后会覆盖当前工作区内容。建议先确认输入文本和身份预设是否正确。</p>
        </div>
      </SectionPanel>
    );
  }

  function renderActiveSection() {
    switch (activeSection) {
      case "ai":
        return renderAiSection();
      case "profile":
        return renderProfileSection();
      case "summary":
        return renderSummarySection();
      case "skills":
        return renderSkillsSection();
      case "education":
        return renderEducationSection();
      case "internships":
        return renderRoleExperienceSection({
          eyebrow: "Internships",
          title: "实习经历",
          description: "即便时间不长，也值得写。招聘方看的是你是否已经在真实环境中接触过业务、流程和协作。",
          items: draft.internships,
          emptyText: "还没有实习经历，也可以先补充课程项目或校内项目。",
          addLabel: "添加实习经历",
          onAdd: () => setDraft((current) => ({ ...current, internships: [...current.internships, createInternshipItem()] })),
          onDelete: (index) =>
            setDraft((current) => ({
              ...current,
              internships: current.internships.filter((_, itemIndex) => itemIndex !== index),
            })),
          onFieldChange: updateInternship,
          onAchievementsChange: updateInternshipAchievements,
        });
      case "campus":
        return renderCampusSection();
      case "work":
        return renderRoleExperienceSection({
          eyebrow: "Work",
          title: "工作经历",
          description: "社招简历的核心模块。尽量用结果证明你的职责价值，而不是只写负责过什么。",
          items: draft.work_experience,
          emptyText: "还没有工作经历，当前身份下建议优先补足真实工作项目和量化成果。",
          addLabel: "添加工作经历",
          onAdd: () => setDraft((current) => ({ ...current, work_experience: [...current.work_experience, createRoleExperienceItem()] })),
          onDelete: (index) =>
            setDraft((current) => ({
              ...current,
              work_experience: current.work_experience.filter((_, itemIndex) => itemIndex !== index),
            })),
          onFieldChange: updateWorkExperience,
          onAchievementsChange: updateWorkAchievements,
        });
      case "projects":
        return renderProjectSection();
      case "awards":
        return renderAwardsSection();
      case "credentials":
        return renderCredentialsSection();
      default:
        return renderProfileSection();
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1660px] px-6 pb-16 text-slate-900">
      <div className="mb-5 space-y-5 rounded-[24px] border border-stone-300/70 bg-[rgba(255,252,247,0.78)] px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{documentTitle}</p>
            <p className="mt-1 text-sm text-slate-500">当前模块：{activeMeta.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{hydrated ? "内容已自动保存" : "正在准备编辑器"}</div>
            <Button type="button" className="h-10 rounded-full bg-slate-900 px-4 text-white hover:bg-slate-800" onClick={() => resumeBuilderRef.current?.print()}>
              <Download className="h-4 w-4" />
              导出 PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {personaOrder.map((persona) => {
            const definition = getResumePersonaDefinition(persona);
            return (
              <PersonaButton
                key={persona}
                active={draft.persona === persona}
                title={definition.label}
                description={definition.description}
                onClick={() => switchPersona(persona)}
              />
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,420px)_minmax(760px,1fr)] 2xl:grid-cols-[260px_minmax(0,450px)_minmax(820px,1fr)]">
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <WorkspaceCard className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <FileStack className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Outline</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">编辑结构</h2>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {sections.map((section) => (
                <NavigationButton
                  key={section.id}
                  active={section.id === activeSection}
                  title={section.title}
                  description={section.description}
                  badge={section.badge}
                  icon={section.icon}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f7efe6] text-[#b85c2c]">
                <Save className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">草稿状态</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{saveMessage}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" variant="outline" className="h-10 rounded-full border-stone-300 bg-white px-4 text-slate-800 hover:bg-stone-100" onClick={resetToStarter}>
                <RotateCcw className="h-4 w-4" />
                恢复示例
              </Button>
              <Button type="button" variant="outline" className="h-10 rounded-full border-red-200 bg-white px-4 text-red-600 hover:bg-red-50" onClick={resetToEmpty}>
                <Trash2 className="h-4 w-4" />
                清空草稿
              </Button>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="overflow-hidden">
            <div className="border-b border-stone-200 bg-[#f7efe6] px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="h-4 w-4 text-[#b85c2c]" />
                编排提醒
              </div>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm leading-6 text-slate-600">
              <p>身份按钮只控制模块优先级和显示顺序，不会删除你已经填写的内容。</p>
              <p>学生阶段尽量用教育、实习、项目和校园经历证明能力，社招阶段则要让工作经历和项目结果站到前面。</p>
              <p>右侧预览与 PDF 导出都使用同一套身份策略，切换后可以立即检查版面是否合理。</p>
            </div>
          </WorkspaceCard>
        </aside>

        <main>{renderActiveSection()}</main>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <ResumeBuilder ref={resumeBuilderRef} data={draft} />
        </aside>
      </div>
    </div>
  );
}


