"use client";

import { useEffect, useState } from "react";
import { X, Trash2, FileText, RefreshCw } from "lucide-react";
import { loadReports, deleteReport, clearReports } from "@/lib/history";
import { cefrColor, jlptColor, ieltsColor, toeicColor, scoreColor, formatDate } from "@/lib/utils";
import type { SavedReport, AnalysisResult } from "@/types/analysis";

interface Props {
  onClose: () => void;
  onSelect: (result: AnalysisResult) => void;
}

export default function HistoryPanel({ onClose, onSelect }: Props) {
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    setReports(loadReports());
  }, []);

  const handleDelete = (id: string) => {
    deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = () => {
    if (!confirm("確定要刪除所有歷史記錄嗎？")) return;
    clearReports();
    setReports([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">歷史記錄</h2>
          <div className="flex items-center gap-2">
            {reports.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                清除全部
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <FileText className="h-12 w-12 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">尚無歷史記錄</p>
              <p className="text-gray-300 text-sm mt-1">分析課程後會自動儲存在這裡</p>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:border-brand-200 hover:bg-brand-50/20 transition-colors"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{r.language === "en" ? "🇺🇸" : "🇯🇵"}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${cefrColor(r.cefrLevel)}`}>
                      CEFR {r.cefrLevel}
                    </span>
                    {r.jlptLevel && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${jlptColor(r.jlptLevel)}`}>
                        {r.jlptLevel}
                      </span>
                    )}
                    {r.ieltsband && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ieltsColor(r.ieltsband)}`}>
                        IELTS {r.ieltsband}
                      </span>
                    )}
                    {r.toeicRange && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${toeicColor(r.toeicRange)}`}>
                        多益 {r.toeicRange}
                      </span>
                    )}
                  </div>
                  <span className={`text-2xl font-bold ${scoreColor(r.score)}`}>
                    {r.score}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3">{formatDate(r.savedAt)}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { onSelect(r.result); onClose(); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    查看報告
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 text-center text-xs text-gray-300">
          最多儲存 30 筆記錄
        </div>
      </div>
    </div>
  );
}
