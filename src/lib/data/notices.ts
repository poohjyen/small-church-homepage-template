import { createClient } from "@/lib/supabase/server";
import type { Notice, NoticeCategory } from "@/types/database";

export type NoticesPage = { data: Notice[]; total: number };

export async function getNotices({
  page = 1,
  perPage = 10,
  category,
  search,
}: {
  page?: number;
  perPage?: number;
  category?: NoticeCategory;
  search?: string;
} = {}): Promise<NoticesPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let q = supabase.from("notices").select("*", { count: "exact" });
  if (category) q = q.eq("category", category);
  if (search && search.trim()) {
    const term = search.trim();
    q = q.or(`title.ilike.%${term}%,content.ilike.%${term}%`);
  }
  q = q
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(start, start + perPage - 1);
  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getRecentNotices(
  limit = 4,
  category: NoticeCategory = "news",
): Promise<Notice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("category", category)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type AdjacentItem = { id: string; title: string } | null;

export async function getAdjacentNotice(
  id: string,
  category: NoticeCategory,
  createdAt: string,
): Promise<{ prev: AdjacentItem; next: AdjacentItem }> {
  const supabase = await createClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("notices")
      .select("id,title")
      .eq("category", category)
      .lt("created_at", createdAt)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("notices")
      .select("id,title")
      .eq("category", category)
      .gt("created_at", createdAt)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}
