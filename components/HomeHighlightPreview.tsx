"use client";

import { useState } from "react";
import { Download, FileStack, ScanSearch, Sparkles, WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const personaPresets = {
  intern: {
    label: "实习生",
    score: 78,
    summary: "突出课程项目、校园实践和短期实习，把潜力表达清楚。",
    modules: ["教育背景", "实习经历", "项目经历", "校园经历"],
    bullets: [
      "把课程项目改写成可验证的结果表达，避免只写“负责协助”。",
      "补齐 SQL、数据分析、用户研究等与岗位更贴近的能力词。",
      "保留校园身份，但压缩无关社团描述，突出可迁移能力。",
    ],
  },
  graduate: {
    label: "应届生",
    score: 84,
    summary: "兼顾实习、项目和校园经历，强调成长速度与岗位匹配点。",
    modules: ["教育背景", "实习经历", "项目经历", "技能关键词"],
    bullets: [
      "将内容运营与活动策划经历压缩成更利于校招 HR 快速浏览的三条亮点。",
      "自动补入与 JD 高度一致的用户增长、复盘分析和跨团队协作关键词。",
      "把原本分散的执行项整理成“动作 + 结果 + 指标”的统一句式。",
    ],
  },
  experienced: {
    label: "职场人士",
    score: 91,
    summary: "优先突出工作成果、代表项目和管理复杂度，让社招价值更直接。",
    modules: ["工作经历", "项目经历", "技能关键词", "职业概述"],
    bullets: [
      "把项目中的业务结果改写成量化表述，补齐 38% 性能提升和转化指标。",
      "自动补入与岗位更贴近的 TypeScript、Next.js、工程化关键词，提高 ATS 命中率。",
      "将过长职责描述压缩成三条结果导向表达，适合招聘方快速扫描。",
    ],
  },
} as const;

const templatePresets = [
  { id: "harvard", label: "模板 1", alias: "Harvard", tone: "经典稳妥", accent: "bg-[#111827] text-white" },
  { id: "modern", label: "模板 2", alias: "Modern", tone: "现代双栏", accent: "bg-[#b85c2c] text-white" },
  { id: "minimal", label: "模板 3", alias: "Minimal", tone: "简约单页", accent: "bg-[#e9eef4] text-slate-700" },
] as const;

const inputChannels = [
  { title: "PDF 简历", description: "拖拽上传后自动提取文本" },
  { title: "原始文本", description: "直接粘贴旧简历内容" },
  { title: "岗位 JD", description: "单独输入目标职位要求" },
];

export default function HomeHighlightPreview() {
  const [activePersona, setActivePersona] = useState<keyof typeof personaPresets>("graduate");
  const [activeTemplate, setActiveTemplate] = useState<(typeof templatePresets)[number]["id"]>("modern");
  const [highlightAiChanges, setHighlightAiChanges] = useState(true);
  const persona = personaPresets[activePersona];
  const template = templatePresets.find((item) => item.id === activeTemplate) ?? templatePresets[1];

  return (
    <div className="p-6 md:p-7">
      <div className="flex min-h-[640px] flex-col rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#f7f3ec_100%)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Integrated Preview</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">首页直接模拟完整工作台</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center rounded-full border border-stone-200 bg-white px-3 py-2 shadow-sm">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={highlightAiChanges}
              onChange={(event) => setHighlightAiChanges(event.target.checked)}
            />
            <div className="peer h-6 w-11 rounded-full bg-stone-200 after:absolute after:left-[14px] after:top-[10px] after:h-5 after:w-5 after:rounded-full after:border after:border-stone-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#b85c2c] peer-checked:after:translate-x-full peer-checked:after:border-white" />
            <span className="ml-3 text-sm font-medium text-slate-700">高亮 AI 修改内容</span>
          </label>
        </div>

        <div className="grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-3">
            <div className="rounded-[22px] border border-stone-200 bg-white/80 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">输入入口</p>
              <div className="mt-3 space-y-2">
                {inputChannels.map((item) => (
                  <div key={item.title} className="rounded-[16px] bg-[#f8f4ed] px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-stone-200 bg-white/80 p-4 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">身份预设</p>
              <div className="mt-3 space-y-2">
                {Object.entries(personaPresets).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePersona(key as keyof typeof personaPresets)}
                    className={cn(
                      "w-full rounded-[16px] border px-3 py-3 text-left transition",
                      activePersona === key
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-stone-200 bg-[#fcfaf7] text-slate-700 hover:border-stone-300",
                    )}
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className={cn("mt-1 text-xs leading-5", activePersona === key ? "text-white/75" : "text-slate-500")}>{item.summary}</p>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[18px] border border-stone-200 bg-white/80 px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">匹配评分</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{persona.score}% 岗位匹配度</p>
              </div>
              <div className="rounded-[18px] border border-stone-200 bg-white/80 px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">模板联动</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{template.alias} 预览已联动</p>
              </div>
              <div className="rounded-[18px] border border-stone-200 bg-white/80 px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">结果动作</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">可继续进入制作页</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Optimization Result</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">当前展示的是 {persona.label} 工作流。</p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                    首页预览已经把优化工作台和制作工作台拼到一起，既能说明 AI 做了什么，也能说明后续如何接模板和导出。
                  </p>
                </div>
                <div className="rounded-full bg-[#f7efe6] px-4 py-2 text-sm font-semibold text-[#b85c2c]">{persona.score}% 岗位匹配度</div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-5">
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b85c2c]">AI 职业摘要</p>
                      <span className="rounded-full border border-[#ead7c8] bg-[#fbf2ea] px-3 py-1 text-xs font-semibold text-[#b85c2c]">
                        先分析 JD，再重写表述
                      </span>
                    </div>
                    <p
                      className={cn(
                        "rounded-[18px] border border-transparent text-sm leading-8 text-slate-700 transition",
                        highlightAiChanges && "border-[#ead7c8] bg-[#fbf2ea] px-4 py-3",
                      )}
                    >
                      {persona.summary}
                    </p>
                  </section>

                  <section>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b85c2c]">优化后的关键动作</p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      {persona.bullets.map((item, index) => (
                        <li
                          key={item}
                          className={cn(
                            "rounded-[18px] border border-stone-200 bg-[#fcfaf7] px-4 py-3 leading-7",
                            highlightAiChanges && index < 2 && "border-[#ead7c8] bg-[#fbf2ea] text-slate-900",
                          )}
                        >
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#b85c2c]">
                      <WandSparkles className="h-4 w-4" />
                      <span>进入制作页后的模块</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {persona.modules.map((item) => (
                        <span key={item} className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="space-y-3 rounded-[22px] border border-stone-200 bg-[linear-gradient(180deg,#fbf6f0_0%,#ffffff_100%)] p-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                      <FileStack className="h-4 w-4" />
                      <span>模板选择</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {templatePresets.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTemplate(item.id)}
                          className={cn(
                            "w-full rounded-[16px] border px-3 py-3 text-left transition",
                            activeTemplate === item.id
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-stone-200 bg-white text-slate-700 hover:border-stone-300",
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{item.label}</p>
                            <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", item.accent)}>{item.alias}</span>
                          </div>
                          <p className={cn("mt-1 text-xs", activeTemplate === item.id ? "text-white/75" : "text-slate-500")}>{item.tone}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-[#111827] p-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                      <ScanSearch className="h-4 w-4" />
                      <span>工作流状态</span>
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#f5c97a]" />
                        <span>JD 已分析</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <WandSparkles className="h-4 w-4 text-[#f5c97a]" />
                        <span>内容已改写</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-[#f5c97a]" />
                        <span>可导出 PDF</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
