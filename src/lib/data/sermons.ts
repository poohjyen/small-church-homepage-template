import { createClient } from "@/lib/supabase/server";
import type { Sermon } from "@/types/database";

export type SermonsPage = { data: Sermon[]; total: number };

export async function getSermons({
  page = 1,
  perPage = 9,
  search,
  publishedOnly = false,
  draftOnly = false,
}: {
  page?: number;
  perPage?: number;
  search?: string;
  publishedOnly?: boolean;
  draftOnly?: boolean;
} = {}): Promise<SermonsPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let q = supabase
    .from("sermons")
    .select("*", { count: "exact" })
    .is("deleted_at", null);
  if (draftOnly) q = q.eq("is_draft", true);
  else if (publishedOnly) q = q.eq("is_draft", false);
  if (search?.trim()) {
    const t = search.trim();
    q = q.or(`title.ilike.%${t}%,preacher.ilike.%${t}%,scripture.ilike.%${t}%`);
  }
  q = q
    .order("sermon_date", { ascending: false })
    .range(start, start + perPage - 1);
  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getRecentSermons(
  limit = 3,
  opts: { publishedOnly?: boolean } = {},
): Promise<Sermon[]> {
  const { publishedOnly = true } = opts;
  const supabase = await createClient();
  let q = supabase
    .from("sermons")
    .select("*")
    .is("deleted_at", null)
    .order("sermon_date", { ascending: false })
    .limit(limit);
  if (publishedOnly) q = q.eq("is_draft", false);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getSermonById(
  id: string,
  opts: { publishedOnly?: boolean } = {},
): Promise<Sermon | null> {
  const { publishedOnly = true } = opts;
  const supabase = await createClient();
  let q = supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null);
  if (publishedOnly) q = q.eq("is_draft", false);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdjacentSermon(
  sermonDate: string,
  currentId: string,
): Promise<{
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}> {
  const supabase = await createClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("sermons")
      .select("id,title")
      .lt("sermon_date", sermonDate)
      .neq("id", currentId)
      .eq("is_draft", false)
      .is("deleted_at", null)
      .order("sermon_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sermons")
      .select("id,title")
      .gt("sermon_date", sermonDate)
      .neq("id", currentId)
      .eq("is_draft", false)
      .is("deleted_at", null)
      .order("sermon_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}

