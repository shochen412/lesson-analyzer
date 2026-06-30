export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type JLPTLevel = "N5" | "N4" | "N3" | "N2" | "N1";
export type SpeakerRole = "TEACHER" | "STUDENT";
export type ErrorType = "grammar" | "vocabulary" | "structure";
export type Language = "en" | "ja";

export interface LanguageError {
  type: ErrorType;
  original: string;
  correction: string;
  explanation_zh: string;
}

export interface Exchange {
  speaker: SpeakerRole;
  start_time?: string;  // "MM:SS" format
  text: string;
  errors: LanguageError[];
}

export interface RecommendedWord {
  word: string;
  reading?: string;       // Japanese: hiragana reading
  meaning_zh: string;
  example: string;
  level: CEFRLevel;
  jlpt_level?: JLPTLevel; // Japanese only
  ielts_band?: string;    // English only, e.g. "5.5-6.0"
  toeic_range?: string;   // English only, e.g. "600-730"
}

export interface RecommendedGrammarPattern {
  pattern: string;
  reading?: string;       // Japanese: hiragana reading of pattern
  usage_zh: string;
  example: string;
  level: CEFRLevel;
  jlpt_level?: JLPTLevel;
  ielts_band?: string;
  toeic_range?: string;   // English only
}

export interface GrammarAnalysis {
  recommended_patterns: RecommendedGrammarPattern[];
}

export interface VocabularyAnalysis {
  total_words: number;
  unique_words: number;
  estimated_cefr_vocabulary: CEFRLevel;
  estimated_jlpt?: JLPTLevel;
  estimated_ielts?: string;
  estimated_toeic?: string;   // English only, e.g. "600-730"
  recommended_words: RecommendedWord[];
}

export interface OverallScore {
  score: number;
  cefr_level: CEFRLevel;
  jlpt_level?: JLPTLevel;
  ielts_band?: string;
  toeic_range?: string;   // English only, e.g. "600-730"
  grammar_score: number;
  vocabulary_score: number;
  fluency_score: number;
  strengths_zh: string[];
  improvements_zh: string[];
  summary_zh: string;
}

export interface AnalysisResult {
  teacher_speaker: string;
  student_speaker: string;
  language: Language;
  identification_reason: string;
  exchanges: Exchange[];
  vocabulary_analysis: VocabularyAnalysis;
  grammar_analysis: GrammarAnalysis;
  overall_score: OverallScore;
}

export interface ProcessingEvent {
  step: "uploading" | "transcribing" | "analyzing" | "complete" | "error";
  message?: string;
  data?: AnalysisResult;
}

export interface SavedReport {
  id: string;
  savedAt: string;
  language: Language;
  score: number;
  cefrLevel: CEFRLevel;
  jlptLevel?: JLPTLevel;
  ieltsband?: string;
  toeicRange?: string;
  result: AnalysisResult;
}
