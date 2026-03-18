"use client";

import {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Expand, LayoutTemplate, Minimize2, Minus, Plus } from "lucide-react";

import { HarvardTemplate } from "@/components/templates/HarvardTemplate";
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
import { ModernTechTemplate } from "@/components/templates/ModernTechTemplate";
import type { ResumeData, WorkExperience } from "@/components/templates/types";
import { normalizeResumeData } from "@/lib/resume-data";
import { cn } from "@/lib/utils";

type ResumeBuilderProps = {
  data: ResumeData;
};

export type ResumeBuilderHandle = {
  print: () => void;
};

type TemplateKey = "harvard" | "modern-tech" | "minimalist";

type TemplateOption = {
  key: TemplateKey;
  label: string;
  subtitle: string;
};

const templateOptions: TemplateOption[] = [
  { key: "harvard", label: "经典结构", subtitle: "适合通用求职" },
  { key: "modern-tech", label: "现代双栏", subtitle: "适合互联网岗位" },
  { key: "minimalist", label: "极简单页", subtitle: "适合作品导向内容" },
];

const previewScaleSteps = [0.8, 0.9, 1, 1.1, 1.2, 1.35];
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PREVIEW_SAFE_PADDING_PX = 48;

function renderTemplateNode(template: TemplateKey, data: ResumeData) {
  if (template === "modern-tech") {
    return <ModernTechTemplate data={data} />;
  }

  if (template === "minimalist") {
    return <MinimalistTemplate data={data} />;
  }

  return <HarvardTemplate data={data} />;
}

function TemplateOptionCard({
  option,
  active,
  onClick,
  data,
}: {
  option: TemplateOption;
  active: boolean;
  onClick: () => void;
  data: ResumeData;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group rounded-[16px] border px-2.5 py-2 text-left transition",
        active
          ? "border-[#d7b08b] bg-[#fff7ef] text-slate-900 shadow-[0_10px_24px_rgba(184,92,44,0.10)]"
          : "border-stone-300 bg-white text-slate-700 hover:border-stone-400 hover:bg-stone-50",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative h-10 w-16 shrink-0 overflow-hidden rounded-[12px] border bg-[#f6f1ea]",
            active ? "border-[#e7c7ac]" : "border-stone-200",
          )}
        >
          <div className="pointer-events-none absolute left-0 top-0 h-[1123px] w-[794px] origin-top-left scale-[0.08] overflow-hidden">
            {renderTemplateNode(option.key, data)}
          </div>
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t",
              active ? "from-[#fff7ef] via-[#fff7ef]/70 to-transparent" : "from-white/95 via-white/65 to-transparent",
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold leading-5">{option.label}</p>
            {active ? <span className="rounded-full bg-[#f3dfcf] px-2 py-1 text-[11px] font-semibold text-[#9a5a33]">褰撳墠</span> : null}
          </div>
          <p className={cn("mt-0.5 text-xs leading-4", active ? "text-[#9a5a33]" : "text-slate-500")}>{option.subtitle}</p>
        </div>
      </div>
    </button>
  );
}

function getExperienceRank(duration: string): number {
  const normalized = duration.toLowerCase();
  if (/(present|current|now|\u81f3\u4eca)/.test(normalized)) {
    return Number.MAX_SAFE_INTEGER;
  }

  const years = duration.match(/(19|20)\d{2}/g);
  if (years && years.length > 0) {
    return Number(years[years.length - 1]);
  }

  return 0;
}

function sortExperienceByDateDesc(items: WorkExperience[]): WorkExperience[] {
  return [...items].sort((a, b) => getExperienceRank(b.duration) - getExperienceRank(a.duration));
}

export const ResumeBuilder = forwardRef<ResumeBuilderHandle, ResumeBuilderProps>(function ResumeBuilder({ data }, ref) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("harvard");
  const [printScale, setPrintScale] = useState(1);
  const [previewScale, setPreviewScale] = useState(1);
  const [fitWidthScale, setFitWidthScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  const syncPrintScale = useCallback(() => {
    const contentNode = resumeContentRef.current;
    if (!contentNode) {
      setPrintScale(1);
      return 1;
    }

    const width = contentNode.scrollWidth;
    const height = contentNode.scrollHeight;
    const scale = Math.min(1, A4_WIDTH_PX / width, A4_HEIGHT_PX / height);
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

    setPrintScale(safeScale);
    return safeScale;
  }, []);

  useEffect(() => {
    const onBeforePrint = () => {
      syncPrintScale();
    };
    const onAfterPrint = () => {
      setPrintScale(1);
    };

    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [syncPrintScale]);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  const syncFitWidthScale = useCallback(() => {
    const viewportNode = previewViewportRef.current;
    if (!viewportNode) {
      setFitWidthScale(1);
      return 1;
    }

    const availableWidth = viewportNode.clientWidth - PREVIEW_SAFE_PADDING_PX;
    const nextScale = availableWidth > 0 ? availableWidth / A4_WIDTH_PX : 1;
    const safeScale = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;

    setFitWidthScale(safeScale);
    return safeScale;
  }, []);

  useEffect(() => {
    const viewportNode = previewViewportRef.current;
    if (!viewportNode) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      syncFitWidthScale();
    });

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncFitWidthScale);
      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", syncFitWidthScale);
      };
    }

    const observer = new ResizeObserver(() => {
      syncFitWidthScale();
    });

    observer.observe(viewportNode);
    window.addEventListener("resize", syncFitWidthScale);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", syncFitWidthScale);
    };
  }, [isFullscreen, syncFitWidthScale]);

  const handlePrint = useCallback(() => {
    syncPrintScale();
    window.setTimeout(() => window.print(), 50);
  }, [syncPrintScale]);

  const effectivePreviewScale = fitWidthScale * previewScale;
  const canZoomOut = previewScale > previewScaleSteps[0];
  const canZoomIn = previewScale < previewScaleSteps[previewScaleSteps.length - 1];

  const changePreviewScale = useCallback((direction: -1 | 1) => {
    setPreviewScale((current) => {
      const currentIndex = previewScaleSteps.findIndex((step) => step >= current - 0.001 && step <= current + 0.001);
      const safeIndex = currentIndex === -1 ? previewScaleSteps.indexOf(1) : currentIndex;
      const nextIndex = Math.min(previewScaleSteps.length - 1, Math.max(0, safeIndex + direction));
      return previewScaleSteps[nextIndex];
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      print: handlePrint,
    }),
    [handlePrint],
  );

  const normalizedData = useMemo<ResumeData>(
    () =>
      normalizeResumeData({
        ...data,
        work_experience: sortExperienceByDateDesc(data.work_experience ?? []),
      }),
    [data],
  );

  const templateNode = useMemo(() => renderTemplateNode(selectedTemplate, normalizedData), [normalizedData, selectedTemplate]);

  return (
    <section
      className={cn(
        "space-y-2",
        isFullscreen && "fixed inset-4 z-[70] overflow-hidden rounded-[32px] border border-stone-300/80 bg-[rgba(247,241,233,0.98)] p-4 shadow-[0_28px_90px_rgba(15,23,42,0.22)] backdrop-blur",
      )}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            background: #fff !important;
          }

          body * {
            visibility: hidden;
          }

          .resume-print-root,
          .resume-print-root * {
            visibility: visible;
          }

          .no-print {
            display: none !important;
          }

          .resume-print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }

          .resume-print-paper {
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
          }

          .resume-print-content {
            transform-origin: left top !important;
            transform: scale(var(--resume-print-scale, 1)) !important;
          }
        }
      `}</style>

      <div className="no-print rounded-[20px] border border-stone-300/80 bg-[#fffdfa] px-3 py-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <LayoutTemplate className="h-3.5 w-3.5 text-[#b85c2c]" />
              {"\u6a21\u677f\u5207\u6362"}
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-600">{"\u5207\u6362\u7248\u5f0f\u540e\uff0c\u53f3\u4fa7\u9884\u89c8\u548c PDF \u5bfc\u51fa\u4f1a\u540c\u6b65\u66f4\u65b0\u3002"}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="inline-flex items-center rounded-full border border-stone-300 bg-white p-1 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
              <button
                type="button"
                onClick={() => changePreviewScale(-1)}
                disabled={!canZoomOut}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label={"\u7f29\u5c0f\u9884\u89c8"}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[64px] text-center text-sm font-semibold text-slate-700">{Math.round(effectivePreviewScale * 100)}%</span>
              <button
                type="button"
                onClick={() => changePreviewScale(1)}
                disabled={!canZoomIn}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="鏀惧ぇ棰勮"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen((current) => !current)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              {isFullscreen ? "退出全屏" : "全屏预览"}
            </button>
          </div>
        </div>

        <div className="mt-2 w-full sm:hidden">
          <label className="sr-only" htmlFor="template-selector">
            {"\u9009\u62e9\u6a21\u677f"}
          </label>
          <select
            id="template-selector"
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value as TemplateKey)}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#d97745] focus:ring-4 focus:ring-[#f3d5c2]/60"
          >
            {templateOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label} 路 {option.subtitle}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 hidden gap-2 sm:grid sm:grid-cols-3">
          {templateOptions.map((option) => {
            const active = option.key === selectedTemplate;
            return (
              <TemplateOptionCard
                key={option.key}
                option={option}
                active={active}
                onClick={() => setSelectedTemplate(option.key)}
                data={normalizedData}
              />
            );
          })}
        </div>
      </div>

      <div
        ref={previewViewportRef}
        className={cn(
          "resume-print-root overflow-auto rounded-[30px] border border-stone-300/80 bg-[linear-gradient(180deg,#f3eadf_0%,#ede3d6_100%)] shadow-[0_18px_55px_rgba(15,23,42,0.08)] print:bg-white print:p-0",
          isFullscreen ? "h-[calc(100vh-11rem)]" : "max-h-[calc(100vh-11rem)]",
        )}
      >
        <div className="flex min-h-full min-w-full items-start justify-center p-4">
          <div
            className="mx-auto shrink-0"
            style={{
              width: `${A4_WIDTH_PX * effectivePreviewScale}px`,
              height: `${A4_HEIGHT_PX * effectivePreviewScale}px`,
              minWidth: `${A4_WIDTH_PX * effectivePreviewScale}px`,
              minHeight: `${A4_HEIGHT_PX * effectivePreviewScale}px`,
            }}
          >
            <div
              className="resume-print-paper origin-top-left overflow-hidden rounded-[22px] border border-stone-300 bg-white shadow-[0_28px_60px_rgba(15,23,42,0.14)] transition-transform duration-200 print:rounded-none print:border-0 print:shadow-none"
              style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px`, transform: `scale(${effectivePreviewScale})` }}
            >
              <div
                ref={resumeContentRef}
                className="resume-print-content h-full w-full"
                style={{ width: `${A4_WIDTH_PX}px`, height: `${A4_HEIGHT_PX}px`, "--resume-print-scale": `${printScale}` } as CSSProperties}
              >
                {templateNode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});











