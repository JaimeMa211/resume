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
    <div className="p-6">
      <div className="flex min-h-[560px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-6 flex justify-end">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={highlightAiChanges}
              onChange={(event) => setHighlightAiChanges(event.target.checked)}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#ec5b13] peer-checked:after:translate-x-full peer-checked:after:border-white" />
            <span className="ml-3 text-sm font-medium text-slate-700">高亮 AI 修改内容</span>
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-2xl font-bold text-slate-700">简历优化功能展示图</p>
          <p className="mt-2 text-sm text-slate-500">仅展示高亮效果，不提供上传、优化与导出交互。</p>

          <div className="mt-6 space-y-6">
            <section>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#ec5b13]">职业摘要</p>
              <p
                className={cn(
                  "rounded-md text-sm leading-relaxed text-slate-700",
                  highlightAiChanges && "border-l-2 border-[#ec5b13] bg-orange-50/50 px-3 py-2",
                )}
              >
                5 年前端开发经验，主导多个中后台与增长项目落地，具备从需求拆解到上线优化的完整交付能力。
              </p>
            </section>

            <section>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#ec5b13]">优化后的工作亮点</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {mockAchievements.map((item, index) => (
                  <li
                    key={item}
                    className={cn(
                      "rounded-md px-2 py-1",
                      highlightAiChanges && index < 2 && "bg-orange-50/60 text-slate-900",
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
