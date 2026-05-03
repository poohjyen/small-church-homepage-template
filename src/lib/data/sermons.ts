import { createClient } from "@/lib/supabase/server";
import type { Sermon } from "@/types/database";

export type SermonsPage = { data: Sermon[]; total: number };

export async function getSermons({
  page = 1,
  perPage = 9,
  search,
}: { page?: number; perPage?: number; search?: string } = {}): Promise<SermonsPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let q = supabase.from("sermons").select("*", { count: "exact" });
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

export async function getRecentSermons(limit = 3): Promise<Sermon[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getSermonById(id: string): Promise<Sermon | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .maybeSingle();
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
      .order("sermon_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sermons")
      .select("id,title")
      .gt("sermon_date", sermonDate)
      .neq("id", currentId)
      .order("sermon_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}

