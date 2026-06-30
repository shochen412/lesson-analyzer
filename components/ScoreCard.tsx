"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";
import { cefrColor, jlptColor, ieltsColor, toeicColor, scoreToGrade, scoreColor } from "@/lib/utils";
import type { AnalysisResult } from "@/types/analysis";

interface Props {
  result: AnalysisResult;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${scoreColor(score)}`}>{score}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            score >= 80
              ? "bg-green-400"
              : score >= 60
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ result }: Props) {
  const { overall_score } = result;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 px-6 py-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">總體評分</h2>
            <p className="text-brand-100 text-sm mt-0.5">
              {result.language === "en" ? "英文" : "日文"}課程分析報告
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{overall_score.score}</div>
            <div className="text-brand-200 text-sm">/ 100</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white border border-white/30">
            CEFR {overall_score.cefr_level}
          </span>
          {overall_score.jlpt_level && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${jlptColor(overall_score.jlpt_level)}`}>
              JLPT {overall_score.jlpt_level}
            </span>
          )}
          {overall_score.ielts_band && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${ieltsColor(overall_score.ielts_band)}`}>
              IELTS {overall_score.ielts_band}
            </span>
          )}
          {overall_score.toeic_range && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${toeicColor(overall_score.toeic_range)}`}>
              多益 {overall_score.toeic_range}
            </span>
          )}
          <span className="text-brand-100 text-sm">
            {scoreToGrade(overall_score.score)}
          </span>
        </div>
      </div>

      {/* Score bars */}
      <div className="px-6 py-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          各項分數
        </h3>
        <ScoreBar label="文法正確性" score={overall_score.grammar_score} />
        <ScoreBar label="詞彙豐富度" score={overall_score.vocabulary_score} />
        <ScoreBar label="表達流暢度" score={overall_score.fluency_score} />
      </div>

      {/* Summary */}
      <div className="px-6 pb-5">
        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4">
          {overall_score.summary_zh}
        </p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-2 border-t border-gray-100">
        <div className="px-6 py-5 border-r border-gray-100">
          <h3 className="text-sm font-semibold text-green-700 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="h-4 w-4" />
            優點
          </h3>
          <ul className="space-y-1.5">
            {overall_score.strengths_zh.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-orange-700 flex items-center gap-1.5 mb-3">
            <TrendingUp className="h-4 w-4" />
            改進建議
          </h3>
          <ul className="space-y-1.5">
            {overall_score.improvements_zh.map((s, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-orange-400 flex-shrink-0 mt-0.5">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
