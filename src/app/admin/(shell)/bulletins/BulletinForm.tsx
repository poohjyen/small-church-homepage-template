"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { Upload, FileText, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Bulletin } from "@/types/database";
import { useFormDirty } from "@/lib/hooks/useFormDirty";
import { createBulletin, updateBulletin } from "./actions";

const MAX_PDF_BYTES = 50 * 1024 * 1024;
const MAX_THUMB_BYTES = 10 * 1024 * 1024;

export function BulletinForm({ initial }: { initial?: Bulletin }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  useFormDirty(formRef, { pending });
  const [file, setFile] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [bulletinDate, setBulletinDate] = useState(
    initial?.bulletin_date ?? format(new Date(), "yyyy-MM-dd"),
  );
  const [attachColumn, setAttachColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [columnContent, setColumnContent] = useState("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_PDF_BYTES) {
      toast.error("PDF 파일은 50MB 이하여야 합니다.");
      e.target.value = "";
      return;
    }
    if (f && f.type && !f.type.includes("pdf")) {
      toast.error("PDF 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_THUMB_BYTES) {
      toast.error("표지 이미지는 10MB 이하여야 합니다.");
      e.target.value = "";
      return;
    }
    if (f && f.type && !f.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }
    setThumb(f);
    setThumbPreview(f ? URL.createObjectURL(f) : null);
  }

  function clearThumb() {
    setThumb(null);
    setThumbPreview(null);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim().length < 2) {
      toast.error("주보 제목을 입력해 주세요.");
      return;
    }
    if (!isEdit && !file) {
      toast.error("PDF 파일을 첨부해 주세요.");
      return;
    }
    if (attachColumn) {
      if (columnTitle.trim().length < 2) {
        toast.error("칼럼 제목을 입력해 주세요.");
        return;
      }
      if (columnContent.trim().length < 5) {
        toast.error("칼럼 본문을 입력해 주세요.");
        return;
      }
    }

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("bulletin_date", bulletinDate);
    if (file) fd.set("pdf_file", file);
    if (thumb) fd.set("thumbnail_file", thumb);
    if (!isEdit && attachColumn) {
      fd.set("attach_column", "true");
      fd.set("column_title", columnTitle.trim());
      fd.set("column_content", columnContent.trim());
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateBulletin(initial!.id, fd)
        : await createBulletin(fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        attachColumn
          ? "주보 + 목양칼럼이 함께 등록되었습니다."
          : isEdit
            ? "수정되었습니다."
            : "등록되었습니다.",
      );
      router.push("/admin/bulletins");
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div className="space-y-2">
          <Label htmlFor="title">
            주보 제목 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 2026년 5월 3일 주일주보"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bulletin_date">
            주보 날짜 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="bulletin_date"
            type="date"
            value={bulletinDate}
            onChange={(e) => setBulletinDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          주보 PDF 파일 {isEdit ? null : <span className="text-red-500">*</span>}
        </Label>
        {file ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-soft px-4 py-3 ring-1 ring-black/5">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="size-5 shrink-0 text-primary-navy" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-charcoal">{file.name}</p>
                <p className="text-xs text-warm-gray">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={clearFile}>
              <X className="size-4" aria-hidden />
              <span className="sr-only">파일 제거</span>
            </Button>
          </div>
        ) : (
          <label
            htmlFor="pdf_file"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-10 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5"
          >
            <Upload className="size-7" aria-hidden />
            <p className="text-sm font-medium text-charcoal">
              PDF 파일을 클릭해서 업로드
            </p>
            <p className="text-xs">최대 50MB · 같은 이름이라도 자동으로 새 경로에 저장됩니다.</p>
            {isEdit && initial?.pdf_url ? (
              <p className="mt-1 text-xs text-warm-gray">
                기존 PDF가 있으며, 새 파일을 첨부하면 교체됩니다.
              </p>
            ) : null}
          </label>
        )}
        <input
          id="pdf_file"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={onFileChange}
        />
      </div>

      <div className="space-y-2">
        <Label>표지 이미지 (선택)</Label>
        {thumbPreview ? (
          <div className="flex items-start gap-3 rounded-xl bg-soft p-3 ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbPreview}
              alt="표지 미리보기"
              className="h-32 w-24 rounded-md object-cover ring-1 ring-black/5"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="truncate text-sm font-medium text-charcoal">
                {thumb?.name}
              </p>
              <p className="text-xs text-warm-gray">
                {thumb ? (thumb.size / (1024 * 1024)).toFixed(2) : "0"} MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearThumb}
                className="self-start"
              >
                <X className="size-3.5" aria-hidden /> 제거
              </Button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="thumbnail_file"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-8 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5"
          >
            <ImagePlus className="size-7" aria-hidden />
            <p className="text-sm font-medium text-charcoal">
              주보 표지 이미지를 업로드하세요
            </p>
            <p className="text-xs">
              주보 1페이지를 캡처해서 올리면 사용자가 클릭 시 미리볼 수 있어요 · 최대 10MB
            </p>
            {isEdit && initial?.thumbnail_url ? (
              <p className="mt-1 text-xs text-warm-gray">
                기존 표지가 있으며, 새 파일을 첨부하면 교체됩니다.
              </p>
            ) : null}
          </label>
        )}
        <input
          id="thumbnail_file"
          ref={thumbInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onThumbChange}
        />
      </div>

      {!isEdit ? (
        <div className="rounded-xl bg-primary-navy/5 p-4 ring-1 ring-primary-navy/15">
          <div className="flex items-start gap-3">
            <Checkbox
              id="attach_column"
              checked={attachColumn}
              onCheckedChange={(c) => setAttachColumn(c === true)}
            />
            <div className="-mt-0.5">
              <Label
                htmlFor="attach_column"
                className="text-sm font-semibold text-primary-navy"
              >
                ☑ 목양칼럼도 함께 등록하기
              </Label>
              <p className="mt-1 text-xs text-warm-gray">
                주보와 같은 날짜로 목양칼럼이 함께 발행됩니다.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!isEdit && attachColumn ? (
        <div className="space-y-4 rounded-xl bg-soft p-5 ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary-navy" aria-hidden />
            <p className="text-sm font-semibold text-charcoal">
              목양칼럼 함께 등록
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="column_title">
              칼럼 제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="column_title"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              placeholder="목양칼럼 제목"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="column_content">
              칼럼 본문 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="column_content"
              rows={8}
              value={columnContent}
              onChange={(e) => setColumnContent(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="bg-primary-navy text-white hover:bg-secondary-sky"
          disabled={pending}
        >
          {pending
            ? "저장 중..."
            : attachColumn
              ? "한 번에 등록"
              : isEdit
                ? "수정 발행"
                : "등록"}
        </Button>
      </div>
    </form>
  );
}
