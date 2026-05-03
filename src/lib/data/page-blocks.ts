import { createClient } from "@/lib/supabase/server";
import type { PageBlock } from "@/types/database";
import { isHardcodedPageKey } from "@/lib/page-keys";

export async function getPageBlocks(pageKey: string): Promise<PageBlock[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_blocks")
    .select("*")
    .eq("page_key", pageKey)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPageBlockById(id: string): Promise<PageBlock | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_blocks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type CustomPageSummary = {
  page_key: string;
  block_count: number;
  updated_at: string;
};

// 사용자가 만든 동적 페이지 (HARDCODED 제외) 요약 목록
export async function getCustomPageSummaries(): Promise<CustomPageSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_blocks")
    .select("page_key, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;

  const map = new Map<string, { count: number; updated_at: string }>();
  for (const row of data ?? []) {
    if (isHardcodedPageKey(row.page_key)) continue;
    const existing = map.get(row.page_key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(row.page_key, { count: 1, updated_at: row.updated_at });
    }
  }
  return Array.from(map.entries())
    .map(([page_key, v]) => ({
      page_key,
      block_count: v.count,
      updated_at: v.updated_at,
    }))
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}
