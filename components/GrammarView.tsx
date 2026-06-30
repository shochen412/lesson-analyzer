"use client";

import { BookMarked } from "lucide-react";
import { cefrColor, jlptColor, ieltsColor, toeicColor } from "@/lib/utils";
import type { GrammarAnalysis, Language } from "@/types/analysis";

interface Props {
  analysis: GrammarAnalysis;
  language: Language;
}

export default function GrammarView({ analysis, language }: Props) {
  if (!analysis?.recommended_patterns?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">文法與句型學習建議</h2>
      </div>

      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <BookMarked className="h-4 w-4 text-brand-500" />
          建議學習的文法句型
          <span className="text-xs text-gray-400 font-normal">（掌握這些句型可提升表達的豐富度）</span>
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {analysis.recommended_patterns.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
            >
              {/* Pattern + reading + badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="font-bold text-gray-800 text-base">{item.pattern}</span>
                  {item.reading && (
                    <span className="ml-2 text-sm text-gray-400 font-normal">{item.reading}</span>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cefrColor(item.level)}`}>
                    {item.level}
                  </span>
                  {item.jlpt_level && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${jlptColor(item.jlpt_level)}`}>
                      {item.jlpt_level}
                    </span>
                  )}
                  {item.ielts_band && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ieltsColor(item.ielts_band)}`}>
                      {item.ielts_band}
                    </span>
                  )}
                  {item.toeic_range && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${toeicColor(item.toeic_range)}`}>
                      {item.toeic_range}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-brand-700 font-medium mb-2">{item.usage_zh}</div>
              <div className="text-xs text-gray-500 italic leading-relaxed">{item.example}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
