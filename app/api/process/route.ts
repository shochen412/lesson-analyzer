import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AssemblyAI } from "assemblyai";
import { readFileSync } from "fs";
import { join } from "path";
import type { AnalysisResult, Language } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 300;

// Read key from .env.local directly, bypassing empty system env vars
function getKey(name: string): string {
  const sysVal = process.env[name]?.trim();
  if (sysVal) return sysVal;
  try {
    const env = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of env.split("\n")) {
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim();
      const v = line.slice(eq + 1).trim();
      if (k === name && v) return v;
    }
  } catch {}
  return "";
}

function msToTime(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function buildPrompt(
  utterances: Array<{ speaker: string; text: string; start_time: string }>,
  language: Language
): string {
  const utteranceText = utterances
    .map((u) => `[${u.start_time}] 說話者${u.speaker}：${u.text}`)
    .join("\n");

  const langName = language === "ja" ? "日文" : "英文";
  const isJa = language === "ja";

  const wordExtraFields = isJa
    ? `"reading": "單字的平假名讀音（例：つうきんする）",
        "jlpt_level": "N5 或 N4 或 N3 或 N2 或 N1"`
    : `"ielts_band": "此單字對應的 IELTS 分數帶（例：5.5-6.0）",
        "toeic_range": "此單字對應的 TOEIC 分數區間（例：600-730）"`;

  const scoreExtraFields = isJa
    ? `"jlpt_level": "N5 或 N4 或 N3 或 N2 或 N1（學生整體推估的 JLPT 程度）",`
    : `"ielts_band": "學生推估的 IELTS 分數帶（例：5.0-5.5）",
    "toeic_range": "學生推估的 TOEIC 分數區間（例：550-650）",`;

  const vocabExtraFields = isJa
    ? `"estimated_jlpt": "N5 或 N4 或 N3 或 N2 或 N1",`
    : `"estimated_ielts": "學生推估的 IELTS 分數帶（例：5.0-5.5）",
    "estimated_toeic": "學生推估的 TOEIC 分數區間（例：550-650）",`;

  const grammarExtraFields = isJa
    ? `"reading": "文法句型的平假名讀音（選填）",
        "jlpt_level": "N5 或 N4 或 N3 或 N2 或 N1"`
    : `"ielts_band": "此文法對應的 IELTS 分數帶（例：5.5-6.0）",
        "toeic_range": "此文法對應的 TOEIC 分數區間（例：600-730）"`;

  return `你是一位專業的${langName}語言教師和教育分析師。請分析以下一對一${langName}課程的逐字稿，說話者標記為 A、B 等。

逐字稿：
${utteranceText}

請分析這份逐字稿並**只回傳以下格式的 JSON**（不要有任何其他文字，所有說明請用繁體中文）：

{
  "teacher_speaker": "A 或 B（哪位是老師）",
  "student_speaker": "A 或 B（哪位是學生）",
  "identification_reason": "如何判斷老師與學生的簡短說明",
  "exchanges": [
    {
      "speaker": "TEACHER 或 STUDENT",
      "start_time": "從逐字稿開頭的時間標記複製過來（例：01:23）",
      "text": "說話者的原文",
      "errors": [
        {
          "type": "grammar 或 vocabulary 或 structure",
          "original": "有問題的片語或句子",
          "correction": "正確或更好的版本",
          "explanation_zh": "中文說明（30字以內）"
        }
      ]
    }
  ],
  "vocabulary_analysis": {
    "total_words": 學生使用的總字數,
    "unique_words": 學生使用的不重複字數,
    "estimated_cefr_vocabulary": "A1/A2/B1/B2/C1/C2",
    ${vocabExtraFields}
    "recommended_words": [
      {
        "word": "${isJa ? "日文單字" : "英文單字"}",
        ${wordExtraFields},
        "meaning_zh": "中文意思",
        "example": "完整例句（${langName}）",
        "level": "A1/A2/B1/B2/C1/C2"
      }
    ]
  },
  "grammar_analysis": {
    "recommended_patterns": [
      {
        "pattern": "${isJa ? "文法句型（例：〜てしまう）" : "文法句型（例：not only…but also…）"}",
        ${grammarExtraFields},
        "usage_zh": "中文說明此句型的用法與情境（40字以內）",
        "example": "完整例句（${langName}）",
        "level": "A1/A2/B1/B2/C1/C2"
      }
    ]
  },
  "overall_score": {
    "score": 總分（0-100 整數）,
    "cefr_level": "A1/A2/B1/B2/C1/C2",
    ${scoreExtraFields}
    "grammar_score": 文法分數（0-100）,
    "vocabulary_score": 詞彙分數（0-100）,
    "fluency_score": 流暢度分數（0-100）,
    "strengths_zh": ["具體優點1", "具體優點2", "具體優點3"],
    "improvements_zh": ["具體改進方向1", "具體改進方向2", "具體改進方向3"],
    "summary_zh": "2-3句總結評語"
  }
}

重要規則：
- 只分析學生的語言錯誤，不分析老師的
- 如果學生某句話沒有錯誤，errors 必須為空陣列 []
- 建議 5-8 個能提升學生下一個程度的單字，每個單字都必須附上讀音和程度分級
- 建議 4-6 個文法句型，選擇學生目前程度稍高一級的句型
- 評語要具體、鼓勵但誠實
- 只回傳純 JSON，不要有 markdown 代碼區塊或其他說明文字`;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const assemblyKey = getKey("ASSEMBLYAI_API_KEY");
        const anthropicKey = getKey("ANTHROPIC_API_KEY");

        if (!assemblyKey) {
          throw new Error("請在 .env.local 中設定 ASSEMBLYAI_API_KEY");
        }
        if (!anthropicKey) {
          throw new Error("請在 .env.local 中設定 ANTHROPIC_API_KEY");
        }

        const body = await request.json();
        const uploadUrl: string = body.audio_url;
        const language = (body.language as Language) || "en";

        if (!uploadUrl) throw new Error("缺少音檔 URL");

        const assemblyClient = new AssemblyAI({
          apiKey: assemblyKey,
        });

        // Step 2: Transcribe with speaker diarization
        send({
          step: "transcribing",
          message: "正在轉錄音檔並辨識老師與學生的聲音（可能需要 2-5 分鐘）...",
        });

        const transcript = await assemblyClient.transcripts.transcribe({
          audio_url: uploadUrl,
          speaker_labels: true,
          speech_models: ["universal-2"],
          language_detection: true,
        });

        if (transcript.status === "error") {
          throw new Error(`語音轉錄失敗：${transcript.error}`);
        }

        const utterances = transcript.utterances ?? [];
        if (utterances.length === 0) {
          throw new Error(
            "無法辨識音檔中的對話內容，請確認音檔品質和語言設定是否正確"
          );
        }

        // Step 3: Analyze with Claude
        send({ step: "analyzing", message: "正在使用 AI 進行深度語言分析..." });

        const anthropic = new Anthropic({
          apiKey: anthropicKey,
        });

        const prompt = buildPrompt(
          utterances.map((u) => ({
            speaker: u.speaker ?? "A",
            text: u.text,
            start_time: msToTime(u.start ?? 0),
          })),
          language
        );

        const claudeResponse = await anthropic.messages.create({
          model: "claude-opus-4-7",
          max_tokens: 16000,
          messages: [{ role: "user", content: prompt }],
        });

        const responseText =
          claudeResponse.content[0].type === "text"
            ? claudeResponse.content[0].text
            : "";

        // Extract JSON (handle cases where model adds backticks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("AI 回傳格式異常，請重試");
        }

        const analysis: AnalysisResult = {
          ...JSON.parse(jsonMatch[0]),
          language,
        };

        send({ step: "complete", data: analysis });
      } catch (error) {
        send({
          step: "error",
          message:
            error instanceof Error ? error.message : "處理時發生未知錯誤",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
