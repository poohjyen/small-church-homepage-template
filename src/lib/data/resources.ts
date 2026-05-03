import { createClient } from "@/lib/supabase/server";
import type { Resource } from "@/types/database";

import type { ResourceCategory } from "@/lib/data/helpers";

export type ResourcesPage = { data: Resource[]; total: number };

export async function getResources({
  category,
  page = 1,
  perPage = 15,
  search,
}: {
  category?: ResourceCategory;
  page?: number;
  perPage?: number;
  search?: string;
} = {}): Promise<ResourcesPage> {
  const supabase = await createClient();
  const start = (page - 1) * perPage;
  let query = supabase.from("resources").select("*", { count: "exact" });
  if (category && category !== "전체") {
    query = query.eq("category", category);
  }
  if (search?.trim()) {
    const t = search.trim();
    query = query.or(`title.ilike.%${t}%,description.ilike.%${t}%`);
  }
  query = query
    .order("created_at", { ascending: false })
    .range(start, start + perPage - 1);
  const { data, count, error } = await query;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

