"use client";

import { useState } from "react";
import { MicVocal, AlertCircle, History } from "lucide-react";
import UploadForm from "@/components/UploadForm";
import LoadingState from "@/components/LoadingState";
import AnalysisResultView from "@/components/AnalysisResult";
import HistoryPanel from "@/components/HistoryPanel";
import { saveReport } from "@/lib/history";
import type { AnalysisResult, Language, ProcessingEvent } from "@/types/analysis";

type AppState =
  | { phase: "idle" }
  | { phase: "loading"; step: ProcessingEvent["step"]; message: string }
  | { phase: "result"; data: AnalysisResult }
  | { phase: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<AppState>({ phase: "idle" });
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (file: File, language: Language) => {
    setState({ phase: "loading", step: "uploading", message: "正在上傳音檔..." });

    try {
      // Get AssemblyAI key, then upload directly from browser (bypasses Vercel body limit)
      const tokenRes = await fetch("/api/upload");
      if (!tokenRes.ok) throw new Error("無法取得上傳憑證");
      const { key } = await tokenRes.json();

      const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          authorization: key,
          "content-type": "application/octet-stream",
        },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("音檔上傳失敗，請重試");
      const { upload_url } = await uploadRes.json();

      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ audio_url: upload_url, language }),
      });

      if (!response.ok) throw new Error(`伺服器錯誤：${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const event: ProcessingEvent = JSON.parse(line.slice(6));

          if (event.step === "complete" && event.data) {
            saveReport(event.data);
            setState({ phase: "result", data: event.data });
          } else if (event.step === "error") {
            setState({ phase: "error", message: event.message ?? "未知錯誤" });
          } else if (
            event.step === "uploading" ||
            event.step === "transcribing" ||
            event.step === "analyzing"
          ) {
            setState({ phase: "loading", step: event.step, message: event.message ?? "" });
          }
        }
      }
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "網路連線錯誤，請重試",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header data-no-print className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <MicVocal className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">課堂語言分析系統</h1>
              <p className="text-xs text-gray-400">AI 驅動的英文 / 日文課程分析</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-700 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 px-3 py-2 rounded-xl transition-all"
          >
            <History className="h-4 w-4" />
            歷史記錄
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {state.phase === "idle" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-gray-800">上傳課程錄音，獲得即時語言回饋</h2>
              <p className="mt-2 text-gray-500">
                系統自動辨識老師與學生，分析文法錯誤、詞彙建議，並評估 CEFR / JLPT / IELTS 程度
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {[
                "🎙️ 說話者自動辨識",
                "📝 逐句文法分析",
                "📚 詞彙 + 文法學習建議",
                "🏆 CEFR / JLPT / IELTS 評估",
                "💾 自動儲存歷史記錄",
              ].map((f) => (
                <span key={f} className="bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full font-medium">
                  {f}
                </span>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <UploadForm onSubmit={handleSubmit} isLoading={false} />
            </div>
          </div>
        )}

        {state.phase === "loading" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <LoadingState
              currentStep={
                state.step === "complete" || state.step === "error" ? "analyzing" : state.step
              }
              message={state.message}
            />
          </div>
        )}

        {state.phase === "error" && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 space-y-4">
            <div className="flex items-start gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">分析失敗</p>
                <p className="text-sm mt-1 text-red-600">{state.message}</p>
              </div>
            </div>
            <button
              onClick={() => setState({ phase: "idle" })}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              重新上傳
            </button>
          </div>
        )}

        {state.phase === "result" && (
          <AnalysisResultView
            result={state.data}
            onReset={() => setState({ phase: "idle" })}
          />
        )}
      </main>

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelect={(result) => setState({ phase: "result", data: result })}
        />
      )}
    </div>
  );
}
