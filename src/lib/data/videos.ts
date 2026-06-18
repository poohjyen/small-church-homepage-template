import { createClient } from "@/lib/supabase/server";
import type { Video } from "@/types/database";

export type VideosPage = { data: Video[]; total: number };

export async function getVideos({
  page = 1,
  perPage = 9,
  search,
}: { page?: number; perPage?: number; search?: string } = {}): Promise<VideosPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let q = supabase
    .from("videos")
    .select("*", { count: "exact" })
    .is("deleted_at", null);
  if (search?.trim()) {
    const t = search.trim();
    q = q.or(`title.ilike.%${t}%,performer.ilike.%${t}%,description.ilike.%${t}%`);
  }
  q = q
    .order("video_date", { ascending: false })
    .order("display_order", { ascending: true })
    .range(start, start + perPage - 1);
  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getRecentVideos(limit = 4): Promise<Video[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .is("deleted_at", null)
    .order("video_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getVideoById(id: string): Promise<Video | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdjacentVideo(
  videoDate: string,
  currentId: string,
): Promise<{
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}> {
  const supabase = await createClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("videos")
      .select("id,title")
      .lt("video_date", videoDate)
      .neq("id", currentId)
      .is("deleted_at", null)
      .order("video_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("videos")
      .select("id,title")
      .gt("video_date", videoDate)
      .neq("id", currentId)
      .is("deleted_at", null)
      .order("video_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}
