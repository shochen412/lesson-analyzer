import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CEFRLevel, JLPTLevel } from "@/types/analysis";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cefrColor(level: CEFRLevel): string {
  const map: Record<CEFRLevel, string> = {
    A1: "bg-gray-100 text-gray-700",
    A2: "bg-blue-100 text-blue-700",
    B1: "bg-green-100 text-green-700",
    B2: "bg-yellow-100 text-yellow-700",
    C1: "bg-orange-100 text-orange-700",
    C2: "bg-purple-100 text-purple-700",
  };
  return map[level] ?? "bg-gray-100 text-gray-700";
}

export function jlptColor(level: JLPTLevel): string {
  const map: Record<JLPTLevel, string> = {
    N5: "bg-gray-100 text-gray-700",
    N4: "bg-blue-100 text-blue-700",
    N3: "bg-green-100 text-green-700",
    N2: "bg-yellow-100 text-yellow-700",
    N1: "bg-red-100 text-red-700",
  };
  return map[level] ?? "bg-gray-100 text-gray-700";
}

export function toeicColor(range: string): string {
  const score = parseFloat(range.split("-")[0]);
  if (score >= 860) return "bg-purple-100 text-purple-700";
  if (score >= 730) return "bg-orange-100 text-orange-700";
  if (score >= 600) return "bg-yellow-100 text-yellow-700";
  if (score >= 470) return "bg-green-100 text-green-700";
  return "bg-blue-100 text-blue-700";
}

export function ieltsColor(band: string): string {
  const score = parseFloat(band);
  if (score >= 7.5) return "bg-purple-100 text-purple-700";
  if (score >= 6.5) return "bg-orange-100 text-orange-700";
  if (score >= 5.5) return "bg-yellow-100 text-yellow-700";
  if (score >= 4.5) return "bg-green-100 text-green-700";
  return "bg-blue-100 text-blue-700";
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "優秀";
  if (score >= 80) return "良好";
  if (score >= 70) return "普通";
  if (score >= 60) return "及格";
  return "待加強";
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
