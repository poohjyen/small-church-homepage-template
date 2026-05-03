"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESOURCE_CATEGORY_OPTIONS } from "@/lib/forms/admin-schemas";
import type { Resource } from "@/types/database";
import { useFormDirty } from "@/lib/hooks/useFormDirty";
import { createResource, updateResource } from "./actions";

const MAX_FILE_BYTES = 50 * 1024 * 1024;

export function ResourceForm({ initial }: { initial?: Resource }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useFormDirty(formRef, { pending });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string>(
    initial?.category ?? "신청서식",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [file, setFile] = useState<File | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_FILE_BYTES) {
      toast.error("파일은 50MB 이하여야 합니다.");
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
    if (title.trim().length < 2) {
      toast.error("자료 제목을 입력해 주세요.");
      return;
    }
    if (!isEdit && !file) {
      toast.error("파일을 첨부해 주세요.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("category", category);
    fd.set("description", description.trim());
    if (file) fd.set("file", file);

    startTransition(async () => {
      const result = isEdit
        ? await updateResource(initial!.id, fd)
        : await createResource(fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "수정되었습니다." : "업로드되었습니다.");
      router.push("/admin/resources");
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          자료 제목 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 새가족 등록 카드 (한글 / PDF)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">
          카테고리 <span className="text-red-500">*</span>
        </Label>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "신청서식")}>
          <SelectTrigger id="category" className="h-10 w-full">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="자료 사용처나 다운로드 방법을 짧게 적어주세요."
        />
      </div>

      <div className="space-y-2">
        <Label>
          파일 업로드 {isEdit ? "(교체)" : <span className="text-red-500">*</span>}
        </Label>
        {file ? (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-soft px-4 py-3 ring-1 ring-black/5">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="size-5 shrink-0 text-primary-navy" aria-hidden />
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
            htmlFor="file"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-10 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5"
          >
            <Upload className="size-7" aria-hidden />
            <p className="text-sm font-medium text-charcoal">
              파일을 클릭해서 업로드
            </p>
            <p className="text-xs">최대 50MB · PDF·HWP·DOCX·XLSX·이미지 등</p>
          </label>
        )}
        <input
          id="file"
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={onFileChange}
        />
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
          {pending ? "저장 중..." : isEdit ? "수정" : "업로드"}
        </Button>
      </div>
    </form>
  );
}
