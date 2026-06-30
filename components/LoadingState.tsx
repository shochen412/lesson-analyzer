"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Props {
  currentStep: "uploading" | "transcribing" | "analyzing";
  message: string;
}

const STEPS = [
  { key: "uploading", label: "上傳音檔", desc: "將音檔傳送至分析伺服器" },
  { key: "transcribing", label: "語音轉錄", desc: "辨識說話者並逐字轉錄" },
  { key: "analyzing", label: "AI 語言分析", desc: "分析文法、詞彙與流暢度" },
] as const;

export default function LoadingState({ currentStep, message }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="py-8 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">課程分析中</h2>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-brand-300 bg-brand-50"
                  : isDone
                  ? "border-green-200 bg-green-50"
                  : "border-gray-100 bg-gray-50 opacity-50"
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <div>
                <p
                  className={`font-medium text-sm ${
                    isActive
                      ? "text-brand-700"
                      : isDone
                      ? "text-green-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
              {isActive && (
                <span className="ml-auto text-xs font-medium text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
                  進行中
                </span>
              )}
              {isDone && (
                <span className="ml-auto text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  完成
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400">
        首次分析約需 3-5 分鐘，請耐心等候
      </p>
    </div>
  );
}
