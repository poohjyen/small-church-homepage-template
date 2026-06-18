import "server-only";
import { GoogleGenAI, Type } from "@google/genai";

export type ExtractedBulletin = {
  title: string;
  bulletin_date: string;
  column_title: string;
  column_content: string;
  column_author: string;
  notice_items: string[];
  member_news: string[];
  schedule_motto: string;
  schedule_events: string[];
  schedule_content: string;
};

const MODEL_ID = "gemini-2.5-flash";

const PROMPT = `당신은 한국 개신교회 주보 PDF를 분석하는 도우미입니다.
첨부된 PDF 내용을 읽고 아래 JSON 스키마에 정확히 맞춰서만 출력하세요.

규칙:
- bulletin_date: 주보의 예배일(주일) 기준 YYYY-MM-DD. 한국어 "2026년 5월 24일"이면 "2026-05-24"로 변환.
- title: 정확히 "YYYY년 M월 D일 주보" 형식. 월·일은 앞에 0 없이. 예: "2026년 5월 24일 주보".
- column_title: 목양칼럼 / 담임목사 칼럼 / 이번 주의 말씀 등 칼럼 섹션의 제목만. 따옴표·괄호·라벨 제거.
- column_content: 칼럼 본문을 **순수 텍스트**로. HTML 태그(<p>, <br>, <strong> 등) 금지. 마크다운(**, ##) 금지.
  · 단락 구분은 빈 줄(\\n\\n)로.
  · 단락 안의 줄바꿈은 \\n 하나로.
  · 따옴표 안 글, 인용, 성구도 본문에 자연스럽게 포함.
- column_author: 칼럼 작성자(예: "○○○ 목사"). 없으면 "담임목사".
- notice_items: "교회 소식" / "광고" / "안내" 섹션의 각 항목을 짧은 문장으로 정리한 **문자열 배열**.
  · 각 항목은 한 문장의 plain text. HTML·마크다운·번호·불릿(·, -, *) 모두 금지(나중에 시스템이 붙임).
  · 일자·장소·대상이 있으면 문장 안에 자연스럽게 포함.
  · 인사말, 헌금자 명단, 예배 순서, 찬송 번호는 제외.
  · 생일·출생·결혼·부고·입원·심방·기도 요청 등 교우 개인과 관련된 소식은 notice_items에 넣지 말고 member_news에 넣을 것.
  · 항목이 없으면 빈 배열.
- member_news: "교우소식" 섹션용 **문자열 배열**. 생일·출생·결혼·부고·입원·심방, 교우 대상 기도 요청, 수련회 참가 안내 등 교우 개인과 관련된 소식을 "라벨: 내용" 형태의 한 줄 plain text로 정리.
  · 라벨은 소식 성격에 맞게: "생일 축하", "출생 감사", "기도 요청", "수련회 공지" 등.
  · 예: "생일 축하: 6월 둘째 주 생일을 맞으신 김◯◯·이◯◯ 성도님을 축하합니다."
  · HTML·마크다운·번호·불릿(·, -, *) 모두 금지(나중에 시스템이 붙임).
  · 해당 소식이 주보에 없으면 빈 배열.
- schedule_motto: 주보에 "이달의 표어" / "월 표어"가 있으면 표어 문구만 (예: "부활신앙의 달"). 따옴표나 "표어:" 같은 라벨은 제거. 없으면 "".
- schedule_events: 월간 주요일정(이달의 행사) 항목의 **문자열 배열**. 각 항목은 "M월 D일(요일) 행사명" 또는 "M월 20~21일(월~화) 행사명" 형식의 한 줄 plain text. 불릿·번호 금지. 월 단위 일정이 없으면 빈 배열.
- schedule_content: 주보에 **여러 주차(예: 1주~5주)에 걸친 월 단위 예배·봉사위원 운영표**가 있는 경우에만 다음 양식의 plain text로 정리. 단일 주만 있으면 빈 문자열 "".
  · 형식: 각 주차 헤더 "[1주]"·"[2주]"·... + 항목은 "· 필드: 값" 한 줄.
  · 주차 사이는 빈 줄 한 개.
  · 마지막에 "▶ 안내·헌금" 섹션과 "· 안내: 이름1 · 이름2", "· 헌금: 이름" 라인.
  · 출력 예시 (실제 PDF 값으로 채울 것):
    [1주]
    · 기도위원: 홍길동
    · 성경봉독: 이몽룡
    · 특별찬양: 김특찬
    · 수요기도: 박수요
    · 중식담당: 청년회

    [2주]
    · 기도위원: ...
    · 성경봉독: ...

    ▶ 안내·헌금
    · 안내: 홍길동 · 이몽룡
    · 헌금: 성춘향
- 추측이 필요한 부분은 PDF 맥락에서 가장 합리적인 값을 선택. 빈 문자열 대신 자연스러운 값으로 채우기 (schedule_motto·schedule_events·schedule_content는 예외 — 해당 내용이 없으면 반드시 ""/빈 배열 출력).`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    bulletin_date: { type: Type.STRING },
    column_title: { type: Type.STRING },
    column_content: { type: Type.STRING },
    column_author: { type: Type.STRING },
    notice_items: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    member_news: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    schedule_motto: { type: Type.STRING },
    schedule_events: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    schedule_content: { type: Type.STRING },
  },
  required: [
    "title",
    "bulletin_date",
    "column_title",
    "column_content",
    "column_author",
    "notice_items",
    "member_news",
    "schedule_motto",
    "schedule_events",
    "schedule_content",
  ],
};

export async function extractBulletinFromPdfUrl(
  pdfUrl: string,
): Promise<ExtractedBulletin> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI 키가 설정되지 않았습니다. (GOOGLE_GENERATIVE_AI_API_KEY)",
    );
  }

  const res = await fetch(pdfUrl);
  if (!res.ok) {
    throw new Error(`PDF 파일을 가져오지 못했습니다. (HTTP ${res.status})`);
  }
  const buf = await res.arrayBuffer();
  const base64 = Buffer.from(buf).toString("base64");

  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({
    model: MODEL_ID,
    contents: [
      {
        role: "user",
        parts: [
          { text: PROMPT },
          { inlineData: { data: base64, mimeType: "application/pdf" } },
        ],
      },
    ],
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const text = result.text;
  if (!text) throw new Error("AI가 응답을 생성하지 못했습니다.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI 응답을 JSON으로 변환할 수 없습니다.");
  }

  return normalizeExtracted(parsed);
}

export function normalizeExtracted(raw: unknown): ExtractedBulletin {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("AI 응답 형식이 올바르지 않습니다.");
  }
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const trim = (v: unknown, max: number) =>
    stripTags(str(v)).trim().slice(0, max);
  const strArray = (v: unknown, max: number) =>
    Array.isArray(v)
      ? v
          .map((i) => stripTags(str(i)).trim())
          .filter((i) => i.length > 0)
          .map((i) => i.slice(0, max))
      : [];

  return {
    title: trim(r.title, 200),
    bulletin_date: normalizeDate(str(r.bulletin_date)),
    column_title: trim(r.column_title, 200),
    column_content: stripTags(str(r.column_content)).trim().slice(0, 20000),
    column_author: trim(r.column_author, 50) || "담임목사",
    notice_items: strArray(r.notice_items, 500),
    member_news: strArray(r.member_news, 500),
    schedule_motto: trim(r.schedule_motto, 100),
    schedule_events: strArray(r.schedule_events, 200),
    schedule_content: stripTags(str(r.schedule_content)).trim().slice(0, 20000),
  };
}

function stripTags(s: string): string {
  return s
    .replace(/<\/?(p|br|ul|ol|li|strong|b|em|i|u|span|div|h[1-6])[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n");
}

function normalizeDate(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (m) {
    const [, y, mo, d] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return "";
}
