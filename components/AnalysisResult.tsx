"use client";

import { useRef } from "react";
import { RefreshCw } from "lucide-react";
import ScoreCard from "./ScoreCard";
import TranscriptView from "./TranscriptView";
import VocabularyView from "./VocabularyView";
import GrammarView from "./GrammarView";
import PDFDownload from "./PDFDownload";
import type { AnalysisResult } from "@/types/analysis";

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResultView({ result, onReset }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const langLabel = result.language === "en" ? "英文" : "日文";
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const filename = `課程分析報告_${langLabel}_${dateStr}.pdf`;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div data-no-print className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">分析報告</h1>
          <p className="text-sm text-gray-400">{result.identification_reason}</p>
        </div>
        <div className="flex items-center gap-2">
          <PDFDownload contentRef={printRef} filename={filename} />
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-300 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            分析新音檔
          </button>
        </div>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="space-y-6">
        <ScoreCard result={result} />
        <TranscriptView exchanges={result.exchanges} />
        <VocabularyView analysis={result.vocabulary_analysis} language={result.language} />
        <GrammarView analysis={result.grammar_analysis} language={result.language} />
      </div>
    </div>
  );
}
