import { createClient } from "@/lib/supabase/server";
import type {
  NewcomerForm,
  PrayerRequest,
  VisitRequest,
} from "@/types/database";

export async function getNewcomerForms(): Promise<NewcomerForm[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newcomer_forms")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getVisitRequests(): Promise<VisitRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visit_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function countNewSubmissions(): Promise<{
  newcomer: number;
  prayer: number;
  visit: number;
}> {
  const supabase = await createClient();
  const [newcomer, prayer, visit] = await Promise.all([
    supabase
      .from("newcomer_forms")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("prayer_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("visit_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
  ]);
  return {
    newcomer: newcomer.count ?? 0,
    prayer: prayer.count ?? 0,
    visit: visit.count ?? 0,
  };
}
