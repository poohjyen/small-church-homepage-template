import { createClient } from "@/lib/supabase/server";
import type { Bulletin } from "@/types/database";

export type BulletinsPage = { data: Bulletin[]; total: number };

export async function getBulletins({
  page = 1,
  perPage = 12,
  search,
}: { page?: number; perPage?: number; search?: string } = {}): Promise<BulletinsPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let q = supabase.from("bulletins").select("*", { count: "exact" });
  if (search?.trim()) {
    const t = search.trim();
    q = q.ilike("title", `%${t}%`);
  }
  q = q
    .order("bulletin_date", { ascending: false })
    .range(start, start + perPage - 1);
  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getLatestBulletin(): Promise<Bulletin | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bulletins")
    .select("*")
    .order("bulletin_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBulletinById(id: string): Promise<Bulletin | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bulletins")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdjacentBulletin(
  bulletinDate: string,
  currentId: string,
): Promise<{
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}> {
  const supabase = await createClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("bulletins")
      .select("id,title")
      .lt("bulletin_date", bulletinDate)
      .neq("id", currentId)
      .order("bulletin_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("bulletins")
      .select("id,title")
      .gt("bulletin_date", bulletinDate)
      .neq("id", currentId)
      .order("bulletin_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}
