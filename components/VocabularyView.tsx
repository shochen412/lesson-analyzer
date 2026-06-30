"use client";

import { BookOpen } from "lucide-react";
import { cefrColor, jlptColor, ieltsColor, toeicColor } from "@/lib/utils";
import type { VocabularyAnalysis, Language } from "@/types/analysis";

interface Props {
  analysis: VocabularyAnalysis;
  language: Language;
}

export default function VocabularyView({ analysis, language }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">詞彙分析</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="px-6 py-4 text-center">
          <div className="text-3xl font-bold text-brand-600">{analysis.total_words}</div>
          <div className="text-xs text-gray-500 mt-0.5">使用總字數</div>
        </div>
        <div className="px-6 py-4 text-center">
          <div className="text-3xl font-bold text-brand-600">{analysis.unique_words}</div>
          <div className="text-xs text-gray-500 mt-0.5">不重複單字</div>
        </div>
        <div className="px-6 py-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <span className={`text-xl font-bold px-2.5 py-0.5 rounded-lg ${cefrColor(analysis.estimated_cefr_vocabulary)}`}>
              {analysis.estimated_cefr_vocabulary}
            </span>
            {language === "ja" && analysis.estimated_jlpt && (
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${jlptColor(analysis.estimated_jlpt)}`}>
                {analysis.estimated_jlpt}
              </span>
            )}
            {language === "en" && analysis.estimated_ielts && (
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${ieltsColor(analysis.estimated_ielts)}`}>
                IELTS {analysis.estimated_ielts}
              </span>
            )}
            {language === "en" && analysis.estimated_toeic && (
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${toeicColor(analysis.estimated_toeic)}`}>
                多益 {analysis.estimated_toeic}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">詞彙程度</div>
        </div>
      </div>

      {/* Recommended words */}
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-brand-500" />
          建議學習的單字
          <span className="text-xs text-gray-400 font-normal">（學習這些單字可提升你的表達層次）</span>
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {analysis.recommended_words.map((word, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
            >
              {/* Word + reading + level badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="font-bold text-gray-800 text-base">{word.word}</span>
                  {word.reading && (
                    <span className="ml-2 text-sm text-gray-400 font-normal">{word.reading}</span>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cefrColor(word.level)}`}>
                    {word.level}
                  </span>
                  {word.jlpt_level && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${jlptColor(word.jlpt_level)}`}>
                      {word.jlpt_level}
                    </span>
                  )}
                  {word.ielts_band && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ieltsColor(word.ielts_band)}`}>
                      {word.ielts_band}
                    </span>
                  )}
                  {word.toeic_range && (
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${toeicColor(word.toeic_range)}`}>
                      {word.toeic_range}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-brand-700 font-medium mb-2">{word.meaning_zh}</div>
              <div className="text-xs text-gray-500 italic leading-relaxed">{word.example}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
