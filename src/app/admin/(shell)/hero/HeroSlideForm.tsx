"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeroSlide } from "@/types/database";
import { useFormDirty } from "@/lib/hooks/useFormDirty";
import { createHeroSlide, updateHeroSlide } from "./actions";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function HeroSlideForm({
  initial,
  onDone,
}: {
  initial?: HeroSlide;
  onDone?: () => void;
}) {
  const router = useRouter();
  const isEdit = !!initial;
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useFormDirty(formRef, { pending });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [file, setFile] = useState<File | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_IMAGE_BYTES) {
      toast.error("이미지 크기는 10MB 이하여야 합니다.");
      e.target.value = "";
      return;
    }
    if (f && f.type && !f.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEdit && !file) {
      toast.error("이미지를 첨부해 주세요.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("subtitle", subtitle.trim());
    if (file) fd.set("image", file);

    startTransition(async () => {
      const result = isEdit
        ? await updateHeroSlide(initial!.id, fd)
        : await createHeroSlide(fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "슬라이드가 수정되었습니다." : "슬라이드가 추가되었습니다.");
      setTitle("");
      setSubtitle("");
      clearFile();
      onDone?.();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hero_title">제목 (선택)</Label>
          <Input
            id="hero_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 함께 세워가는 신앙 공동체"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero_subtitle">부제목 (선택)</Label>
          <Input
            id="hero_subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="예: 2026년 5월 첫 주일"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          이미지 {isEdit ? "(교체)" : <span className="text-red-500">*</span>}
        </Label>
        {file ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-soft px-4 py-3 ring-1 ring-black/5">
            <div className="flex min-w-0 items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="size-12 shrink-0 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-charcoal">
                  {file.name}
                </p>
                <p className="text-xs text-warm-gray">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={clearFile}>
              <X className="size-4" aria-hidden />
              <span className="sr-only">제거</span>
            </Button>
          </div>
        ) : (
          <label
            htmlFor="hero_image"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-8 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5"
          >
            <ImagePlus className="size-6" aria-hidden />
            <p className="text-sm font-medium text-charcoal">
              이미지를 클릭해서 업로드 (최대 10MB)
            </p>
          </label>
        )}
        <input
          id="hero_image"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onFileChange}
        />
      </div>

      <div className="flex justify-end gap-2">
        {isEdit && onDone ? (
          <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
            취소
          </Button>
        ) : null}
        <Button
          type="submit"
          className="bg-primary-navy text-white hover:bg-secondary-sky"
          disabled={pending}
        >
          {pending ? "저장 중..." : isEdit ? "수정" : "슬라이드 추가"}
        </Button>
      </div>
    </form>
  );
}
