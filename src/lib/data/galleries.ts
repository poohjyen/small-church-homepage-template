import { createClient } from "@/lib/supabase/server";
import type { Gallery, GalleryImage } from "@/types/database";

import type { GalleryCategory } from "@/lib/data/helpers";

export type GalleriesPage = { data: Gallery[]; total: number };

export async function getGalleries({
  category,
  page = 1,
  perPage = 12,
  search,
}: {
  category?: GalleryCategory;
  page?: number;
  perPage?: number;
  search?: string;
} = {}): Promise<GalleriesPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let query = supabase
    .from("galleries")
    .select("*", { count: "exact" })
    .is("deleted_at", null);
  if (category && category !== "전체") {
    query = query.eq("category", category);
  }
  if (search?.trim()) {
    const t = search.trim();
    query = query.or(`title.ilike.%${t}%,category.ilike.%${t}%`);
  }
  query = query
    .order("event_date", { ascending: false, nullsFirst: false })
    .range(start, start + perPage - 1);
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getRecentGalleries(limit = 4): Promise<Gallery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .is("deleted_at", null)
    .order("event_date", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getGalleryById(id: string): Promise<Gallery | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getGalleryImages(galleryId: string): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("gallery_id", galleryId)
    .is("deleted_at", null)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAdjacentGallery(
  currentId: string,
  eventDate: string | null,
  createdAt: string,
): Promise<{
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}> {
  const supabase = await createClient();
  const sortKey = eventDate ?? createdAt;
  const sortColumn = eventDate ? "event_date" : "created_at";
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("galleries")
      .select("id,title")
      .lt(sortColumn, sortKey)
      .neq("id", currentId)
      .is("deleted_at", null)
      .order(sortColumn, { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("galleries")
      .select("id,title")
      .gt(sortColumn, sortKey)
      .neq("id", currentId)
      .is("deleted_at", null)
      .order(sortColumn, { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data ? { id: prevRes.data.id, title: prevRes.data.title } : null,
    next: nextRes.data ? { id: nextRes.data.id, title: nextRes.data.title } : null,
  };
}
