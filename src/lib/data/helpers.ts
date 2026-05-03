// Pure utilities and constants from the data layer.
// Safe to import from both Server and Client Components.

import type { FormStatus } from "@/types/database";

export const GALLERY_CATEGORIES = [
  "전체",
  "예배",
  "특별행사",
  "교회학교",
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const RESOURCE_CATEGORIES = [
  "전체",
  "신청서식",
  "교육자료",
  "기타",
] as const;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const FORM_STATUS_LABEL: Record<FormStatus, string> = {
  new: "새 접수",
  contacted: "연락 완료",
  completed: "완료",
  archived: "보관",
};

export const FORM_STATUS_TONE: Record<FormStatus, string> = {
  new: "bg-accent-coral/15 text-accent-coral",
  contacted: "bg-amber-100 text-amber-700",
  completed: "bg-soft text-warm-gray",
  archived: "bg-warm-gray/10 text-warm-gray",
};

export function youtubeThumb(youtubeId: string, quality: "max" | "hq" = "max"): string {
  const tag = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${youtubeId}/${tag}.jpg`;
}

export function previewBody(body: string, max = 100): string {
  const single = body.replace(/\s+/g, " ").trim();
  return single.length <= max ? single : `${single.slice(0, max)}…`;
}

export function formatFileSize(bytes: number | null): string {
  if (bytes == null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
