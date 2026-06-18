import { createClient } from "@/lib/supabase/server";
import type { PastoralColumn } from "@/types/database";

export type ColumnsPage = { data: PastoralColumn[]; total: number };

export async function getColumns({
  page = 1,
  perPage = 10,
  search,
  publishedOnly = false,
  draftOnly = false,
}: {
  page?: number;
  perPage?: number;
  search?: string;
  publishedOnly?: boolean;
  draftOnly?: boolean;
} = {}): Promise<ColumnsPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let q = supabase
    .from("pastoral_columns")
    .select("*", { count: "exact" })
    .is("deleted_at", null);
  if (draftOnly) q = q.eq("is_draft", true);
  else if (publishedOnly) q = q.eq("is_draft", false);
  if (search?.trim()) {
    const t = search.trim();
    q = q.or(`title.ilike.%${t}%,author.ilike.%${t}%,content.ilike.%${t}%`);
  }
  q = q
    .order("published_date", { ascending: false })
    .range(start, start + perPage - 1);
  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getColumnById(
  id: string,
  opts: { publishedOnly?: boolean } = {},
): Promise<PastoralColumn | null> {
  const { publishedOnly = true } = opts;
  const supabase = await createClient();
  let q = supabase
    .from("pastoral_columns")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null);
  if (publishedOnly) q = q.eq("is_draft", false);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdjacentColumn(
  publishedDate: string,
  currentId: string,
): Promise<{
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}> {
  const supabase = await createClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("pastoral_columns")
      .select("id,title")
      .lt("published_date", publishedDate)
      .neq("id", currentId)
      .is("deleted_at", null)
      .eq("is_draft", false)
      .order("published_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("pastoral_columns")
      .select("id,title")
      .gt("published_date", publishedDate)
      .neq("id", currentId)
      .is("deleted_at", null)
      .eq("is_draft", false)
      .order("published_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}

