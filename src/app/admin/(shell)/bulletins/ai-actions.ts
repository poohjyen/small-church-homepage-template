"use server";

import { createClient } from "@/lib/supabase/server";
import {
  extractBulletinFromPdfUrl,
  type ExtractedBulletin,
} from "@/lib/ai/extract-bulletin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

export type AnalyzeResult =
  | { ok: true; data: ExtractedBulletin }
  | { ok: false; error: string };

export async function analyzeBulletinPdf(pdfUrl: string): Promise<AnalyzeResult> {
  const { error } = await requireAdmin();
  if (error) return { ok: false, error };

  if (!pdfUrl || typeof pdfUrl !== "string") {
    return { ok: false, error: "PDF URL이 비어 있습니다." };
  }

  let host: string;
  try {
    host = new URL(pdfUrl).host;
  } catch {
    return { ok: false, error: "PDF URL 형식이 올바르지 않습니다." };
  }
  const allowedHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
    : null;
  const isSupabase =
    host.endsWith(".supabase.co") && (!allowedHost || host === allowedHost);
  if (!isSupabase) {
    return { ok: false, error: "허용되지 않은 PDF 위치입니다." };
  }

  try {
    const data = await extractBulletinFromPdfUrl(pdfUrl);
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI 분석에 실패했습니다.";
    return { ok: false, error: msg };
  }
}
