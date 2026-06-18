// 주보 PDF → 페이지 이미지 변환 + Supabase Storage 업로드 (브라우저 전용 — admin 폼에서만 import)

import type { PDFDocumentProxy } from "pdfjs-dist";

import { createClient } from "@/lib/supabase/client";

import {
  JPEG_QUALITY,
  MAX_PAGES,
  WEBP_QUALITY,
  computeRenderScale,
  pageImageFileName,
} from "./page-image-params";

type Pdfjs = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<Pdfjs> | null = null;

function loadPdfjs(): Promise<Pdfjs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** WebP 시도 후 미지원 브라우저(Safari 등)는 JPEG로 폴백 */
async function encodePage(canvas: HTMLCanvasElement): Promise<Blob> {
  const webp = await canvasToBlob(canvas, "image/webp", WEBP_QUALITY);
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY);
  if (jpeg) return jpeg;
  throw new Error("페이지 이미지 인코딩에 실패했습니다.");
}

type PageUploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/** bulletins 버킷 pages/<batchId>/ 아래 페이지 이미지 1장 업로드 */
async function uploadPageImage(
  file: File,
  batchId: string,
): Promise<PageUploadResult> {
  const supabase = createClient();
  const path = `pages/${batchId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("bulletins")
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) return { ok: false, error: error.message };
  const { data } = supabase.storage.from("bulletins").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export type ConvertResult =
  | { ok: true; urls: string[]; truncated: boolean }
  | { ok: false; error: string };

/**
 * PDF 전체 페이지를 이미지로 렌더해 bulletins 버킷 pages/ 아래 순차 업로드.
 * 일부 페이지라도 실패하면 전체 실패 처리 (페이지 누락된 주보 방지).
 * 주의: data의 소유권이 pdfjs로 이전되므로 호출 후 재사용하려면 slice()로 복사해 넘길 것.
 */
export async function convertAndUploadPdfPages(
  data: ArrayBuffer,
  onProgress?: (done: number, total: number) => void,
): Promise<ConvertResult> {
  let task: ReturnType<Pdfjs["getDocument"]> | null = null;
  const canvas = document.createElement("canvas");
  try {
    const pdfjs = await loadPdfjs();
    task = pdfjs.getDocument({ data });
    const doc: PDFDocumentProxy = await task.promise;
    const total = Math.min(doc.numPages, MAX_PAGES);
    const truncated = doc.numPages > MAX_PAGES;
    const batchId = Date.now().toString(36);
    const urls: string[] = [];

    for (let i = 0; i < total; i++) {
      const page = await doc.getPage(i + 1);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({
        scale: computeRenderScale(base.width, base.height),
      });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvas, viewport }).promise;
      page.cleanup();

      const blob = await encodePage(canvas);
      const file = new File([blob], pageImageFileName(i, blob.type), {
        type: blob.type,
      });
      const r = await uploadPageImage(file, batchId);
      if (!r.ok) {
        return { ok: false, error: `${i + 1}페이지 업로드 실패: ${r.error}` };
      }
      urls.push(r.url);
      onProgress?.(i + 1, total);
    }

    return { ok: true, urls, truncated };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "PDF를 이미지로 변환하지 못했습니다.";
    return { ok: false, error: msg };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
    await task?.destroy().catch(() => undefined);
  }
}
