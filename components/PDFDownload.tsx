"use client";

import { Download } from "lucide-react";

interface Props {
  contentRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function PDFDownload({ filename = "課程分析報告" }: Props) {
  const handleDownload = () => {
    // Set document title so the saved PDF filename matches
    const prev = document.title;
    document.title = filename.replace(".pdf", "");
    window.print();
    document.title = prev;
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
    >
      <Download className="h-4 w-4" />
      下載 PDF 報告
    </button>
  );
}
