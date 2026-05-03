import { createClient } from "@/lib/supabase/server";

export type TableStats = { total: number; recent: number };

const TABLES = [
  "notices",
  "bulletins",
  "sermons",
  "pastoral_columns",
  "videos",
  "galleries",
  "resources",
] as const;

export type ContentTableKey = (typeof TABLES)[number];

export async function getContentStats(): Promise<
  Record<ContentTableKey, TableStats>
> {
  const supabase = await createClient();
  const cutoff = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  async function statsFor(table: ContentTableKey): Promise<TableStats> {
    try {
      const [{ count: total }, { count: recent }] = await Promise.all([
        supabase.from(table).select("*", { count: "exact", head: true }),
        supabase
          .from(table)
          .select("*", { count: "exact", head: true })
          .gte("created_at", cutoff),
      ]);
      return { total: total ?? 0, recent: recent ?? 0 };
    } catch {
      return { total: 0, recent: 0 };
    }
  }

  const results = await Promise.all(TABLES.map((t) => statsFor(t)));
  return Object.fromEntries(
    TABLES.map((t, i) => [t, results[i]]),
  ) as Record<ContentTableKey, TableStats>;
}
