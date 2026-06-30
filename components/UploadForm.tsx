"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileAudio, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/types/analysis";

interface Props {
  onSubmit: (file: File, language: Language) => void;
  isLoading: boolean;
}

export default function UploadForm({ onSubmit, isLoading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type.startsWith("audio/") || /\.(mp3|wav|m4a|ogg|flac|aac)$/i.test(f.name)) {
      setFile(f);
    } else {
      alert("請上傳音訊檔案（MP3, WAV, M4A 等格式）");
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) onSubmit(file, language);
  };

  const formatSize = (bytes: number) =>
    bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language selector */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">課程語言</p>
        <div className="flex gap-3">
          {(["en", "ja"] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                language === lang
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              )}
            >
              {lang === "en" ? "🇺🇸 英文" : "🇯🇵 日文"}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
          isDragging
            ? "border-brand-500 bg-brand-50"
            : file
            ? "border-green-400 bg-green-50"
            : "border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.aac"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="space-y-2">
            <FileAudio className="mx-auto h-10 w-10 text-green-500" />
            <p className="font-medium text-green-700">{file.name}</p>
            <p className="text-sm text-green-600">{formatSize(file.size)}</p>
            <p className="text-xs text-gray-400">點擊更換檔案</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <div>
              <p className="font-medium text-gray-600">
                拖曳音檔至此，或點擊選擇
              </p>
              <p className="mt-1 text-sm text-gray-400">
                支援 MP3、WAV、M4A、AAC（最大 500MB）
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!file || isLoading}
        className={cn(
          "w-full py-3 px-6 rounded-xl font-semibold text-white transition-all",
          file && !isLoading
            ? "bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg"
            : "bg-gray-300 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            分析中...
          </span>
        ) : (
          "開始分析課程"
        )}
      </button>
    </form>
  );
}
