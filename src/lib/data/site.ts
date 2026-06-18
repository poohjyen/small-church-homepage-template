import { createClient } from "@/lib/supabase/server";
import type { HeroSlide, SettingValueMap } from "@/types/database";

export async function getSiteSetting<K extends keyof SettingValueMap>(
  key: K,
): Promise<SettingValueMap[K] | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return (data?.value as SettingValueMap[K] | undefined) ?? null;
}

export async function getAllSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) throw error;
  return Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value]),
  );
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPageHeroImage(
  pageKey: string,
  fallback: string,
): Promise<string> {
  try {
    const map = await getSiteSetting("page_hero_images");
    const url = map?.[pageKey];
    return typeof url === "string" && url.length > 0 ? url : fallback;
  } catch {
    return fallback;
  }
}
