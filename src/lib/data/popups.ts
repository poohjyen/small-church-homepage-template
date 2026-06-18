import { createClient } from "@/lib/supabase/server";
import type { SitePopup } from "@/types/database";

export async function getActivePopupsForPath(
  path: string,
): Promise<SitePopup[]> {
  // 레이아웃(모든 공개 페이지)에서 호출되므로, Supabase 미설정/오류 시에도
  // 절대 throw 하지 않고 빈 배열로 폴백한다.
  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("site_popups")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .lte("starts_at", nowIso)
      .gte("ends_at", nowIso)
      .order("display_priority", { ascending: false })
      .order("starts_at", { ascending: false });
    if (error) return [];
    return (data ?? []).filter(
      (p: SitePopup) => p.pages.includes(path) || p.pages.includes("/*"),
    );
  } catch {
    return [];
  }
}

export async function getAllPopups(): Promise<SitePopup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_popups")
    .select("*")
    .is("deleted_at", null)
    .order("is_active", { ascending: false })
    .order("display_priority", { ascending: false })
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPopupById(id: string): Promise<SitePopup | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_popups")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type PopupStatusGroup = "active" | "scheduled" | "ended";

export function classifyPopup(p: SitePopup, now = new Date()): PopupStatusGroup {
  const starts = new Date(p.starts_at);
  const ends = new Date(p.ends_at);
  if (!p.is_active || ends < now) return "ended";
  if (starts > now) return "scheduled";
  return "active";
}
