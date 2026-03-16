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

import { HarvardTemplate } from "@/components/templates/HarvardTemplate";
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
import { ModernTechTemplate } from "@/components/templates/ModernTechTemplate";
import type { ResumeData, WorkExperience } from "@/components/templates/types";
import { normalizeResumeData } from "@/lib/resume-data";

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

function getExperienceRank(duration: string): number {
  const normalized = duration.toLowerCase();
  if (/(present|current|至今|now)/.test(normalized)) {
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
  const resumeContentRef = useRef<HTMLDivElement>(null);

  const syncPrintScale = useCallback(() => {
    const contentNode = resumeContentRef.current;
    if (!contentNode) {
      setPrintScale(1);
      return 1;
    }

    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;
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

  const handlePrint = useCallback(() => {
    syncPrintScale();
    window.setTimeout(() => window.print(), 50);
  }, [syncPrintScale]);

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

  const templateNode = useMemo(() => {
    if (selectedTemplate === "modern-tech") {
      return <ModernTechTemplate data={normalizedData} />;
    }

    if (selectedTemplate === "minimalist") {
      return <MinimalistTemplate data={normalizedData} />;
    }

    return <HarvardTemplate data={normalizedData} />;
  }, [normalizedData, selectedTemplate]);

  return (
    <section className="space-y-3">
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

      <div className="no-print rounded-[18px] border border-stone-300/80 bg-[#fffdfa] p-2.5 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
        <div className="w-full sm:hidden">
          <label className="sr-only" htmlFor="template-selector">
            选择模板
          </label>
          <select
            id="template-selector"
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value as TemplateKey)}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#d97745] focus:ring-4 focus:ring-[#f3d5c2]/60"
          >
            {templateOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label} · {option.subtitle}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden gap-2 sm:flex sm:flex-wrap">
          {templateOptions.map((option) => {
            const active = option.key === selectedTemplate;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedTemplate(option.key)}
                className={`rounded-[18px] border px-4 py-2.5 text-left transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white shadow-[0_10px_18px_rgba(15,23,42,0.12)]"
                    : "border-stone-300 bg-white text-slate-800 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <p className="text-sm font-semibold leading-5">{option.label}</p>
                <p className={`mt-1 text-xs leading-5 ${active ? "text-white/75" : "text-slate-500"}`}>{option.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="resume-print-root overflow-auto rounded-[30px] border border-stone-300/80 bg-[linear-gradient(180deg,#f3eadf_0%,#ede3d6_100%)] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] print:bg-white print:p-0">
        <div className="resume-print-paper mx-auto h-[297mm] w-[210mm] max-w-none overflow-hidden rounded-[22px] border border-stone-300 bg-white shadow-[0_28px_60px_rgba(15,23,42,0.14)] print:rounded-none print:border-0 print:shadow-none">
          <div
            ref={resumeContentRef}
            className="resume-print-content h-full w-full"
            style={{ "--resume-print-scale": `${printScale}` } as CSSProperties}
          >
            {templateNode}
          </div>
        </div>
      </div>
    </section>
  );
});
