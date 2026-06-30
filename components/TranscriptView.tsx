"use client";

import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exchange, ErrorType } from "@/types/analysis";

const ERROR_LABELS: Record<ErrorType, { label: string; color: string }> = {
  grammar: { label: "文法", color: "bg-red-100 text-red-700" },
  vocabulary: { label: "詞彙", color: "bg-orange-100 text-orange-700" },
  structure: { label: "句型", color: "bg-blue-100 text-blue-700" },
};

function ErrorCard({ error }: { error: Exchange["errors"][0] }) {
  const tag = ERROR_LABELS[error.type];
  return (
    <div className="mt-2 bg-white rounded-lg border border-orange-200 p-3 text-sm space-y-1.5">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
        <span
          className={cn(
            "text-xs font-semibold px-1.5 py-0.5 rounded",
            tag.color
          )}
        >
          {tag.label}錯誤
        </span>
      </div>
      <div className="text-gray-500 line-through text-xs">❌ {error.original}</div>
      <div className="text-green-700 text-xs font-medium">✅ {error.correction}</div>
      <div className="text-gray-500 text-xs">{error.explanation_zh}</div>
    </div>
  );
}

function ExchangeItem({
  exchange,
  index,
}: {
  exchange: Exchange;
  index: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const isStudent = exchange.speaker === "STUDENT";
  const hasErrors = exchange.errors.length > 0;

  return (
    <div className={cn("flex gap-3", isStudent ? "flex-row" : "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
          isStudent ? "bg-brand-500" : "bg-gray-400"
        )}
      >
        {isStudent ? (
          <User className="h-4 w-4" />
        ) : (
          <GraduationCap className="h-4 w-4" />
        )}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[80%]", isStudent ? "" : "items-end flex flex-col")}>
        <div className={cn("flex items-center gap-2 mb-1", !isStudent && "flex-row-reverse")}>
          <span className="text-xs text-gray-400">{isStudent ? "學生" : "老師"}</span>
          {exchange.start_time && (
            <span className="text-xs text-gray-300 font-mono">{exchange.start_time}</span>
          )}
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isStudent
              ? hasErrors
                ? "bg-orange-50 border border-orange-200"
                : "bg-brand-50 border border-brand-100"
              : "bg-gray-100 border border-gray-200"
          )}
        >
          {exchange.text}

          {isStudent && hasErrors && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 mt-2 text-xs text-orange-600 font-medium"
            >
              <AlertCircle className="h-3 w-3" />
              {exchange.errors.length} 個語言建議
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>

        {isStudent && hasErrors && expanded && (
          <div className="mt-1 w-full space-y-1">
            {exchange.errors.map((err, i) => (
              <ErrorCard key={i} error={err} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  exchanges: Exchange[];
}

export default function TranscriptView({ exchanges }: Props) {
  const studentExchanges = exchanges.filter((e) => e.speaker === "STUDENT");
  const errorCount = studentExchanges.reduce(
    (sum, e) => sum + e.errors.length,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">課程對話記錄</h2>
        <div className="flex gap-3 text-sm">
          <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
            {exchanges.length} 句對話
          </span>
          {errorCount > 0 && (
            <span className="bg-orange-100 px-2.5 py-1 rounded-full text-orange-700">
              {errorCount} 個語言建議
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        {exchanges.map((exchange, i) => (
          <ExchangeItem key={i} exchange={exchange} index={i} />
        ))}
      </div>
    </div>
  );
}
