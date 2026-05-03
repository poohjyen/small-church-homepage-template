"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  LANDING_SECTION_KEYS,
  isLandingSectionKey,
  type LandingSectionConfig,
} from "@/lib/landing-sections";

type Result = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

export async function saveLandingSections(input: unknown): Promise<Result> {
  if (!input || typeof input !== "object" || !Array.isArray((input as { items?: unknown }).items)) {
    return { ok: false, error: "잘못된 입력입니다." };
  }
  const raw = (input as { items: unknown[] }).items;
  const seen = new Set<string>();
  const items: LandingSectionConfig[] = [];

  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const key = (r as { key?: unknown }).key;
    const visible = (r as { visible?: unknown }).visible;
    if (!isLandingSectionKey(key)) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ key, visible: visible !== false });
  }

  // 누락된 키 추가
  for (const k of LANDING_SECTION_KEYS) {
    if (!seen.has(k)) items.push({ key: k, visible: true });
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { error: upsertError } = await supabase.from("site_settings").upsert({
    key: "landing_sections",
    value: { items },
    updated_at: new Date().toISOString(),
  });
  if (upsertError) return { ok: false, error: upsertError.message };

  revalidatePath("/");
  revalidatePath("/admin/landing");
  return { ok: true };
}
