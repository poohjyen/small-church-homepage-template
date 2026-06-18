"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminPopupSchema, type AdminPopupInput } from "@/lib/forms/admin-schemas";
import { POPUP_POSITIONS, type PopupPosition } from "@/types/database";

type Result = { ok: true; id?: string } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB hard limit

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "인증이 필요합니다." as const };
  return { supabase, user, error: null };
}

type UploadResult = { ok: true; url: string; path: string } | { ok: false; error: string };

async function uploadPopupImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
): Promise<UploadResult> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "이미지 크기는 5MB 이하여야 합니다." };
  }
  if (file.type && !file.type.startsWith("image/")) {
    return { ok: false, error: "이미지 파일만 업로드할 수 있습니다." };
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("popups")
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (uploadError) return { ok: false, error: uploadError.message };
  const { data } = supabase.storage.from("popups").getPublicUrl(path);
  return { ok: true, url: data.publicUrl, path };
}

async function removeImageByUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  url: string | null,
) {
  if (!url) return;
  const m = url.match(/\/storage\/v1\/object\/public\/popups\/(.+)$/);
  if (m && m[1]) {
    await supabase.storage.from("popups").remove([m[1]]);
  }
}

function clampInt(
  raw: FormDataEntryValue | null,
  min: number,
  max: number,
  fallback: number,
): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function parseForm(formData: FormData): AdminPopupInput {
  const image_alt = (formData.get("image_alt") as string | null)?.trim() ?? "";
  const link_url = (formData.get("link_url") as string | null)?.trim() ?? "";
  const link_target: "_self" | "_blank" =
    formData.get("link_target") === "_blank" ? "_blank" : "_self";
  const positionRaw = (formData.get("position") as string | null) ?? "center";
  const position: PopupPosition = (POPUP_POSITIONS as readonly string[]).includes(
    positionRaw,
  )
    ? (positionRaw as PopupPosition)
    : "center";
  const pagesRaw = (formData.get("pages") as string | null)?.trim() ?? "/";
  const pages = pagesRaw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return {
    title: (formData.get("title") as string | null)?.trim() ?? "",
    image_alt: image_alt.length > 0 ? image_alt : "",
    link_url: link_url.length > 0 ? link_url : "",
    link_target,
    starts_at: (formData.get("starts_at") as string | null)?.trim() ?? "",
    ends_at: (formData.get("ends_at") as string | null)?.trim() ?? "",
    position,
    width: clampInt(formData.get("width"), 200, 1200, 480),
    width_mobile: clampInt(formData.get("width_mobile"), 200, 600, 320),
    display_priority: clampInt(formData.get("display_priority"), 0, 9999, 0),
    show_dont_show_today: formData.get("show_dont_show_today") === "on",
    show_close_button: formData.get("show_close_button") === "on",
    is_active: formData.get("is_active") === "on",
    pages: pages.length > 0 ? pages : ["/"],
  };
}

function toRow(p: AdminPopupInput, image_url: string) {
  return {
    title: p.title,
    image_url,
    image_alt: p.image_alt && p.image_alt.length > 0 ? p.image_alt : null,
    link_url: p.link_url && p.link_url.length > 0 ? p.link_url : null,
    link_target: p.link_target,
    starts_at: new Date(p.starts_at).toISOString(),
    ends_at: new Date(p.ends_at).toISOString(),
    position: p.position,
    width: p.width,
    width_mobile: p.width_mobile,
    display_priority: p.display_priority,
    show_dont_show_today: p.show_dont_show_today,
    show_close_button: p.show_close_button,
    pages: p.pages,
    is_active: p.is_active,
    updated_at: new Date().toISOString(),
  };
}

export async function createPopup(formData: FormData): Promise<Result> {
  const parsed = adminPopupSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "팝업 이미지를 업로드해 주세요." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const upload = await uploadPopupImage(supabase, file);
  if (!upload.ok) return { ok: false, error: upload.error };

  const { data, error: insertError } = await supabase
    .from("site_popups")
    .insert(toRow(parsed.data, upload.url))
    .select("id")
    .single();
  if (insertError) {
    await removeImageByUrl(supabase, upload.url);
    return { ok: false, error: insertError.message };
  }

  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { ok: true, id: data.id };
}

export async function updatePopup(
  id: string,
  formData: FormData,
): Promise<Result> {
  const parsed = adminPopupSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "유효하지 않은 입력입니다." };
  }

  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { data: prev, error: fetchError } = await supabase
    .from("site_popups")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) return { ok: false, error: fetchError.message };
  if (!prev) return { ok: false, error: "팝업을 찾을 수 없습니다." };

  let image_url = prev.image_url as string;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const upload = await uploadPopupImage(supabase, file);
    if (!upload.ok) return { ok: false, error: upload.error };
    image_url = upload.url;
  }

  const { error: updateError } = await supabase
    .from("site_popups")
    .update(toRow(parsed.data, image_url))
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };

  // 이미지 교체된 경우 이전 이미지 정리
  if (image_url !== prev.image_url) {
    await removeImageByUrl(supabase, prev.image_url);
  }

  revalidatePath("/admin/popups");
  revalidatePath(`/admin/popups/${id}/edit`);
  revalidatePath("/");
  return { ok: true, id };
}

export async function deletePopup(id: string): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };

  const { error: deleteError } = await supabase
    .from("site_popups")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (deleteError) return { ok: false, error: deleteError.message };

  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { ok: true };
}

export async function togglePopupActive(
  id: string,
  next: boolean,
): Promise<Result> {
  const { supabase, error } = await requireAdmin();
  if (error) return { ok: false, error };
  const { error: updateError } = await supabase
    .from("site_popups")
    .update({ is_active: next, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  revalidatePath("/admin/popups");
  revalidatePath("/");
  return { ok: true };
}
