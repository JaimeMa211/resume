"use client";

import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HarvardTemplate } from "@/components/templates/HarvardTemplate";
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
import { ModernTechTemplate } from "@/components/templates/ModernTechTemplate";
import type { ResumeData, WorkExperience } from "@/components/templates/types";
import { Button } from "@/components/ui/button";

type ResumeBuilderProps = {
  data: ResumeData;
};

type TemplateKey = "harvard" | "modern-tech" | "minimalist";

type TemplateOption = {
  key: TemplateKey;
  label: string;
  subtitle: string;
};

const templateOptions: TemplateOption[] = [
  { key: "harvard", label: "Harvard", subtitle: "投行经典款" },
  { key: "modern-tech", label: "Modern Tech", subtitle: "互联网双栏款" },
  { key: "minimalist", label: "Minimalist", subtitle: "极简干练款" },
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

export function ResumeBuilder({ data }: ResumeBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("harvard");
  const [printScale, setPrintScale] = useState(1);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  const syncPrintScale = useCallback(() => {
    const contentNode = resumeContentRef.current;
    if (!contentNode) {
      setPrintScale(1);
      return 1;
    }

    // A4 at CSS 96 DPI: 210mm x 297mm => ~794px x ~1123px
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

  const normalizedData = useMemo<ResumeData>(
    () => ({
      ...data,
      work_experience: sortExperienceByDateDesc(data.work_experience),
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
    <section className="space-y-4">
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

      <div className="no-print flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
        <div className="w-full sm:hidden">
          <label className="sr-only" htmlFor="template-selector">
            选择模板
          </label>
          <select
            id="template-selector"
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value as TemplateKey)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-zinc-600"
          >
            {templateOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label} · {option.subtitle}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden flex-wrap gap-2 sm:flex">
          {templateOptions.map((option) => {
            const active = option.key === selectedTemplate;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelectedTemplate(option.key)}
                className={`rounded-md border px-3 py-2 text-left transition ${
                  active
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500"
                }`}
              >
                <p className="text-xs font-semibold">{option.label}</p>
                <p className={`text-[11px] ${active ? "text-zinc-100" : "text-zinc-500"}`}>{option.subtitle}</p>
              </button>
            );
          })}
        </div>

        <Button type="button" className="shrink-0 bg-zinc-900 text-white hover:bg-zinc-800" onClick={handlePrint}>
          一键导出高清 PDF
        </Button>
      </div>

      <div className="resume-print-root overflow-auto rounded-lg border border-zinc-300 bg-zinc-100 p-4 print:bg-white print:p-0">
        <div className="resume-print-paper mx-auto h-[297mm] w-[210mm] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] print:shadow-none">
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
}
