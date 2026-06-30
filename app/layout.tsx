import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "課堂語言分析系統",
  description: "AI 驅動的英文/日文課程錄音分析，獲得即時語言學習回饋",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
