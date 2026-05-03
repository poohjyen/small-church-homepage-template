"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { extractYoutubeId } from "@/lib/forms/admin-schemas";
import type { PageBlockType } from "@/types/database";
import {
  HARDCODED_PAGE_META,
  isHardcodedPageKey,
  isValidPageKey,
  customPagePublicHref,
  customPageAdminHref,
} from "@/lib/page-keys";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function isAllowed(pageKey: string): boolean {
  return isValidPageKey(pageKey);
}

function revalidate(pageKey: string) {
  if (isHardcodedPageKey(pageKey)) {
    const meta = HARDCODED_PAGE_META[pageKey];
    revalidatePath(meta.publicHref);
    revalidatePath(meta.adminHref);
  } else {
    revalidatePath(customPagePublicHref(pageKey));
    revalidatePath(customPageAdminHref(pageKey));
    // 사용자 페이지 인덱스도 갱신
    revalidatePath("/admin/pages");
  }
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

async function nextOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pageKey: string,
): Promise<number> {
  const { data } = await supabase
    .from("page_blocks")
    .select("display_order")
    .eq("page_key", pageKey)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.display_order ?? -1) + 1;
}

async function uploadBlockImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pageKey: string,
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "이미지 크기는 10MB 이하여야 합니다." };
  }
  if (file.type && !file.type.startsWith("image/")) {
    return { ok: false, error: "이미지 파일만 업로드할 수 있습니다." };
  }
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `page-blocks/${pageKey}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage
    .from("site")
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) return { ok: false, error: error.message };
  const { data } = supabase.storage.from("site").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

const VALID_TYPES = ["heading", "paragraph", "image", "quote", "youtube"];

export async function createPageBlock(
  pageKey: string,
  formData: FormData,
): Promise<Result> {
  if (!isAllowed(pageKey)) {
    return { ok: false, error: "지원하지 않는 페이지입니다." };
  }
  const type = (formData.get("type") as string) as PageBlockType;
  if (!VALID_TYPES.includes(type)) {
    return { ok: false, error: "잘못된 블록 종류입니다." };
  }
  const title = (formData.get("title") as string | null)?.trim() || null;
  const body = (formData.get("body") as string | null)?.trim() || null;
  const imageAlt = (formData.get("image_alt") as string | null)?.trim() || null;
  const youtubeRaw = (formData.get("youtube_url") as string | null)?.trim() || "";

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  let imageUrl: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadBlockImage(supabase, pageKey, file);
    if (!upload.ok) return { ok: false, error: upload.error };
    imageUrl = upload.url;
  }

  let youtubeId: string | null = null;
  if (type === "youtube") {
    const id = extractYoutubeId(youtubeRaw);
    if (!id) {
      return { ok: false, error: "유효한 YouTube URL/ID가 아닙니다." };
    }
    youtubeId = id;
  }

  if (type === "heading" && !title) {
    return { ok: false, error: "제목을 입력해 주세요." };
  }
  if ((type === "paragraph" || type === "quote") && !body) {
    return { ok: false, error: "본문을 입력해 주세요." };
  }
  if (type === "image" && !imageUrl) {
    return { ok: false, error: "이미지를 업로드해 주세요." };
  }

  const display_order = await nextOrder(supabase, pageKey);

  const { data, error: insertError } = await supabase
    .from("page_blocks")
    .insert({
      page_key: pageKey,
      type,
      title,
      body,
      image_url: imageUrl,
      image_alt: imageAlt,
      youtube_id: youtubeId,
      display_order,
    })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };

  revalidate(pageKey);
  return { ok: true, id: data.id };
}

export async function updatePageBlock(
  pageKey: string,
  id: string,
  formData: FormData,
): Promise<Result> {
  if (!isAllowed(pageKey)) {
    return { ok: false, error: "지원하지 않는 페이지입니다." };
  }
  const type = (formData.get("type") as string) as PageBlockType;
  if (!VALID_TYPES.includes(type)) {
    return { ok: false, error: "잘못된 블록 종류입니다." };
  }
  const title = (formData.get("title") as string | null)?.trim() || null;
  const body = (formData.get("body") as string | null)?.trim() || null;
  const imageAlt = (formData.get("image_alt") as string | null)?.trim() || null;
  const youtubeRaw = (formData.get("youtube_url") as string | null)?.trim() || "";

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  let youtubeId: string | null = null;
  if (type === "youtube") {
    if (youtubeRaw) {
      const extracted = extractYoutubeId(youtubeRaw);
      if (!extracted) {
        return { ok: false, error: "유효한 YouTube URL/ID가 아닙니다." };
      }
      youtubeId = extracted;
    }
  }

  const update: {
    type: PageBlockType;
    title: string | null;
    body: string | null;
    image_alt: string | null;
    image_url?: string;
    youtube_id?: string | null;
    updated_at: string;
  } = {
    type,
    title,
    body,
    image_alt: imageAlt,
    updated_at: new Date().toISOString(),
  };

  if (type === "youtube") {
    update.youtube_id = youtubeId;
  }

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadBlockImage(supabase, pageKey, file);
    if (!upload.ok) return { ok: false, error: upload.error };
    update.image_url = upload.url;
  }

  const { error: updateError } = await supabase
    .from("page_blocks")
    .update(update)
    .eq("id", id)
    .eq("page_key", pageKey);
  if (updateError) return { ok: false, error: updateError.message };

  revalidate(pageKey);
  return { ok: true, id };
}

export async function deletePageBlock(
  pageKey: string,
  id: string,
): Promise<Result> {
  if (!isAllowed(pageKey)) {
    return { ok: false, error: "지원하지 않는 페이지입니다." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("page_blocks")
    .delete()
    .eq("id", id)
    .eq("page_key", pageKey);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidate(pageKey);
  return { ok: true };
}

// 사용자(custom) 페이지 전체 삭제 — 하드코딩된 페이지에는 사용 금지
export async function deleteCustomPage(pageKey: string): Promise<Result> {
  if (!isValidPageKey(pageKey)) {
    return { ok: false, error: "잘못된 페이지 키입니다." };
  }
  if (isHardcodedPageKey(pageKey)) {
    return { ok: false, error: "기본 페이지는 삭제할 수 없습니다." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: deleteError } = await supabase
    .from("page_blocks")
    .delete()
    .eq("page_key", pageKey);
  if (deleteError) return { ok: false, error: deleteError.message };
  revalidate(pageKey);
  return { ok: true };
}

export async function movePageBlock(
  pageKey: string,
  id: string,
  direction: "up" | "down",
): Promise<Result> {
  if (!isAllowed(pageKey)) {
    return { ok: false, error: "지원하지 않는 페이지입니다." };
  }
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { data: current } = await supabase
    .from("page_blocks")
    .select("id,display_order,page_key")
    .eq("id", id)
    .maybeSingle();
  if (!current) return { ok: false, error: "블록을 찾을 수 없습니다." };

  const op = direction === "up" ? "lt" : "gt";
  const ascending = op !== "lt";

  const query = supabase
    .from("page_blocks")
    .select("id,display_order")
    .eq("page_key", current.page_key);
  const filtered =
    op === "lt"
      ? query.lt("display_order", current.display_order)
      : query.gt("display_order", current.display_order);

  const { data: neighbor } = await filtered
    .order("display_order", { ascending })
    .limit(1)
    .maybeSingle();

  if (!neighbor) {
    return { ok: false, error: "이미 끝입니다." };
  }

  const tmp = current.display_order;
  await supabase
    .from("page_blocks")
    .update({ display_order: neighbor.display_order })
    .eq("id", current.id);
  await supabase
    .from("page_blocks")
    .update({ display_order: tmp })
    .eq("id", neighbor.id);

  revalidate(pageKey);
  return { ok: true };
}
