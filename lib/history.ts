import type { AnalysisResult, SavedReport } from "@/types/analysis";

const KEY = "lesson-analyzer-history";
const MAX = 30;

export function saveReport(result: AnalysisResult): SavedReport {
  const entry: SavedReport = {
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
    language: result.language,
    score: result.overall_score.score,
    cefrLevel: result.overall_score.cefr_level,
    jlptLevel: result.overall_score.jlpt_level,
    ieltsband: result.overall_score.ielts_band,
    toeicRange: result.overall_score.toeic_range,
    result,
  };
  const list = [entry, ...loadReports()].slice(0, MAX);
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
  return entry;
}

export function loadReports(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function deleteReport(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify(loadReports().filter((r) => r.id !== id))
  );
}

export function clearReports(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
