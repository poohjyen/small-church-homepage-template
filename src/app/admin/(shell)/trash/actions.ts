"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { pathFromPublicUrl, type StorageBucket } from "@/lib/storage/paths";
import { TRASH_DOMAINS, TRASH_RETENTION_DAYS, findDomain } from "./domains";

type Result = { ok: true } | { ok: false; error: string };
type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

/**
 * 동적 테이블명에 대해 Supabase 타입 추론이 깨지므로 unknown으로 우회.
 * 컬럼 존재(deleted_at)는 마이그레이션으로 보장됨.
 */
function fromAny(supabase: SupabaseServerClient, table: string) {
  return (supabase as unknown as {
    from: (t: string) => {
      select: (
        cols: string,
      ) => {
        eq: (c: string, v: unknown) => Promise<{ data: Record<string, unknown> | null }>;
        in: (c: string, v: unknown[]) => Promise<{ data: Record<string, unknown>[] | null }>;
        not: (c: string, op: string, v: unknown) => {
          lt: (c: string, v: unknown) => Promise<{
            data: Record<string, unknown>[] | null;
          }>;
        };
        lt: (c: string, v: unknown) => {
          not: (c: string, op: string, v: unknown) => Promise<{
            data: Record<string, unknown>[] | null;
          }>;
        };
      };
      update: (values: Record<string, unknown>) => {
        eq: (c: string, v: unknown) => Promise<{ error: { message: string } | null }>;
        in: (c: string, v: unknown[]) => Promise<{ error: { message: string } | null }>;
      };
      delete: () => {
        eq: (c: string, v: unknown) => Promise<{ error: { message: string } | null }>;
        in: (c: string, v: unknown[]) => Promise<{ error: { message: string } | null }>;
      };
    };
  }).from(table);
}

async function removeStorageFiles(
  supabase: SupabaseServerClient,
  bucket: StorageBucket,
  rows: Record<string, unknown>[],
  fileFields: string[],
) {
  const paths: string[] = [];
  for (const row of rows) {
    for (const field of fileFields) {
      const v = row[field];
      if (typeof v === "string") {
        const p = pathFromPublicUrl(bucket, v);
        if (p) paths.push(p);
      }
    }
  }
  if (paths.length > 0) await supabase.storage.from(bucket).remove(paths);
}

export async function restoreItem(
  domainKey: string,
  id: string,
): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const d = findDomain(domainKey);
  if (!d) return { ok: false, error: "잘못된 도메인입니다." };

  const { error: updateError } = await fromAny(supabase, d.table)
    .update({ deleted_at: null })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };

  revalidatePath(d.publicPath);
  revalidatePath(d.adminPath);
  revalidatePath("/admin/trash");
  return { ok: true };
}

export async function purgeItem(
  domainKey: string,
  id: string,
): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const d = findDomain(domainKey);
  if (!d) return { ok: false, error: "잘못된 도메인입니다." };

  if (d.bucket && d.fileFields && d.fileFields.length > 0) {
    const { data } = await fromAny(supabase, d.table)
      .select(d.fileFields.join(","))
      .eq("id", id);
    if (data) {
      await removeStorageFiles(supabase, d.bucket, [data], d.fileFields);
    }
  }
  if (d.key === "gallery") {
    const { data: imgs } = await fromAny(supabase, "gallery_images")
      .select("image_url")
      .eq("gallery_id", id);
    if (imgs && Array.isArray(imgs) && imgs.length > 0) {
      await removeStorageFiles(supabase, "gallery", imgs, ["image_url"]);
    }
    await fromAny(supabase, "gallery_images").delete().eq("gallery_id", id);
  }

  const { error: deleteError } = await fromAny(supabase, d.table)
    .delete()
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };

  revalidatePath("/admin/trash");
  return { ok: true };
}

export async function purgeExpired(): Promise<{ purged: number; error?: string }> {
  const { supabase, error } = await requireAdmin();
  if (error) return { purged: 0, error };

  const cutoff = new Date(
    Date.now() - TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  let total = 0;

  for (const d of TRASH_DOMAINS) {
    const cols = d.fileFields ? ["id", ...d.fileFields].join(",") : "id";
    const { data } = await fromAny(supabase, d.table)
      .select(cols)
      .lt("deleted_at", cutoff)
      .not("deleted_at", "is", null);
    if (!data || !Array.isArray(data) || data.length === 0) continue;

    if (d.bucket && d.fileFields && d.fileFields.length > 0) {
      await removeStorageFiles(supabase, d.bucket, data, d.fileFields);
    }
    const ids = data.map((r) => String(r.id));

    if (d.key === "gallery") {
      const { data: imgs } = await fromAny(supabase, "gallery_images")
        .select("image_url")
        .in("gallery_id", ids);
      if (imgs && Array.isArray(imgs) && imgs.length > 0) {
        await removeStorageFiles(supabase, "gallery", imgs, ["image_url"]);
      }
      await fromAny(supabase, "gallery_images").delete().in("gallery_id", ids);
    }

    const { error: delError } = await fromAny(supabase, d.table)
      .delete()
      .in("id", ids);
    if (!delError) total += ids.length;
  }
  return { purged: total };
}
