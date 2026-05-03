"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GALLERY_CATEGORY_OPTIONS } from "@/lib/forms/admin-schemas";
import type { Gallery } from "@/types/database";
import { useFormDirty } from "@/lib/hooks/useFormDirty";
import { createGallery, updateGallery } from "./actions";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function GalleryForm({ initial }: { initial?: Gallery }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useFormDirty(formRef, { pending });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "예배");
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [coverIdx, setCoverIdx] = useState(0);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    const valid: File[] = [];
    for (const f of list) {
      if (f.size > MAX_IMAGE_BYTES) {
        toast.error(`${f.name}: 10MB 이하만 가능합니다.`);
        continue;
      }
      if (f.type && !f.type.startsWith("image/")) {
        toast.error(`${f.name}: 이미지 파일이 아닙니다.`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setCoverIdx((c) => {
      if (idx === c) return 0;
      if (idx < c) return c - 1;
      return c;
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim().length < 2) {
      toast.error("앨범 제목을 입력해 주세요.");
      return;
    }
    if (!isEdit && files.length === 0) {
      toast.error("사진을 1장 이상 첨부해 주세요.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("category", category);
    if (eventDate) fd.set("event_date", eventDate);
    if (!isEdit) fd.set("cover_index", String(coverIdx));
    for (const f of files) fd.append("images", f);

    startTransition(async () => {
      const result = isEdit
        ? await updateGallery(initial!.id, fd)
        : await createGallery(fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "수정되었습니다." : "앨범이 생성되었습니다.");
      router.push("/admin/gallery");
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          앨범 제목 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 2026년 부활주일 연합예배"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">
            카테고리 <span className="text-red-500">*</span>
          </Label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "예배")}>
            <SelectTrigger id="category" className="h-10 w-full">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {GALLERY_CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_date">행사 날짜</Label>
          <Input
            id="event_date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          사진 업로드 {isEdit ? "(추가 업로드)" : <span className="text-red-500">*</span>}
        </Label>
        <label
          htmlFor="images"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-10 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5"
        >
          <ImagePlus className="size-7" aria-hidden />
          <p className="text-sm font-medium text-charcoal">
            사진 여러 장을 한 번에 선택해 주세요.
          </p>
          <p className="text-xs">
            ⭐ 표시한 사진이 대표사진이 됩니다 · 1장당 최대 10MB
          </p>
        </label>
        <input
          id="images"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={onFilesChange}
        />

        {files.length > 0 ? (
          <ul className="grid grid-cols-3 gap-3 pt-2 sm:grid-cols-4">
            {files.map((f, i) => {
              const isCover = !isEdit && i === coverIdx;
              return (
                <li
                  key={`${f.name}-${i}`}
                  className={cn(
                    "relative overflow-hidden rounded-lg ring-1 ring-black/5",
                    isCover && "ring-2 ring-primary-navy",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    className="aspect-square w-full object-cover"
                  />
                  {!isEdit ? (
                    <button
                      type="button"
                      onClick={() => setCoverIdx(i)}
                      className={cn(
                        "absolute left-1 top-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition",
                        isCover
                          ? "bg-primary-navy text-white"
                          : "bg-white/85 text-charcoal hover:bg-white",
                      )}
                      aria-label={isCover ? "대표사진" : "대표로 지정"}
                    >
                      <Star
                        className={cn("size-3", isCover && "fill-current")}
                        aria-hidden
                      />
                      {isCover ? "대표" : "대표 지정"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="size-3.5" aria-hidden />
                    <span className="sr-only">제거</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

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
          {pending ? "저장 중..." : isEdit ? "수정 완료" : "앨범 생성"}
        </Button>
      </div>
    </form>
  );
}
