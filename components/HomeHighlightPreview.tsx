"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const mockAchievements = [
  "将多模块前端重构为组件化架构，页面渲染性能提升 38%。",
  "补充与目标岗位一致的 TypeScript、Next.js 关键词，提升 ATS 命中率。",
  "对核心项目描述增加业务指标，突出转化率与留存率结果。",
];

export default function HomeHighlightPreview() {
  const [highlightAiChanges, setHighlightAiChanges] = useState(true);

  return (
    <div className="p-6 md:p-7">
      <div className="flex min-h-[560px] flex-col rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#f7f3ec_100%)] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex justify-end">
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

        <div className="flex-1 rounded-[24px] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Optimization Preview</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">简历优化功能展示图</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">仅展示优化结果的高亮状态，不提供上传、优化与导出交互。</p>

          <div className="mt-8 space-y-6">
            <section>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b85c2c]">职业摘要</p>
              <p
                className={cn(
                  "rounded-[18px] border border-transparent text-sm leading-8 text-slate-700 transition",
                  highlightAiChanges && "border-[#ead7c8] bg-[#fbf2ea] px-4 py-3",
                )}
              >
                5 年前端开发经验，主导多个中后台与增长项目落地，具备从需求拆解到上线优化的完整交付能力。
              </p>
            </section>

            <section>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b85c2c]">优化后的工作亮点</p>
              <ul className="space-y-3 text-sm text-slate-700">
                {mockAchievements.map((item, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
