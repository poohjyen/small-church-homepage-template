"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POPUP_POSITIONS, type PopupPosition, type SitePopup } from "@/types/database";
import { createPopup, updatePopup } from "./actions";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const POSITION_LABELS: Record<PopupPosition, string> = {
  center: "중앙 모달",
  "top-right": "우측 상단",
  "bottom-right": "우측 하단",
  "top-left": "좌측 상단",
  "bottom-left": "좌측 하단",
};

function toLocalDatetime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultStart(): string {
  return toLocalDatetime(new Date().toISOString());
}

function defaultEnd(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return toLocalDatetime(d.toISOString());
}

export function PopupForm({ initial }: { initial?: SitePopup }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [linkUrl, setLinkUrl] = useState(initial?.link_url ?? "");
  const [linkTarget, setLinkTarget] = useState<"_self" | "_blank">(
    initial?.link_target ?? "_self",
  );
  const [startsAt, setStartsAt] = useState(
    initial ? toLocalDatetime(initial.starts_at) : defaultStart(),
  );
  const [endsAt, setEndsAt] = useState(
    initial ? toLocalDatetime(initial.ends_at) : defaultEnd(),
  );
  const [position, setPosition] = useState<PopupPosition>(
    initial?.position ?? "center",
  );
  const [width, setWidth] = useState(initial?.width ?? 480);
  const [widthMobile, setWidthMobile] = useState(initial?.width_mobile ?? 320);
  const [priority, setPriority] = useState(initial?.display_priority ?? 0);
  const [showDontShowToday, setShowDontShowToday] = useState(
    initial?.show_dont_show_today ?? true,
  );
  const [showCloseButton, setShowCloseButton] = useState(
    initial?.show_close_button ?? true,
  );
  const [pages, setPages] = useState((initial?.pages ?? ["/"]).join(", "));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = file
    ? URL.createObjectURL(file)
    : initial?.image_url ?? null;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_IMAGE_BYTES) {
      toast.error("이미지 크기는 5MB 이하여야 합니다.");
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
      toast.error("팝업 이미지를 업로드해 주세요.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("image_alt", imageAlt.trim());
    fd.set("link_url", linkUrl.trim());
    fd.set("link_target", linkTarget);
    fd.set("starts_at", startsAt);
    fd.set("ends_at", endsAt);
    fd.set("position", position);
    fd.set("width", String(width));
    fd.set("width_mobile", String(widthMobile));
    fd.set("display_priority", String(priority));
    if (showDontShowToday) fd.set("show_dont_show_today", "on");
    if (showCloseButton) fd.set("show_close_button", "on");
    if (isActive) fd.set("is_active", "on");
    fd.set("pages", pages);
    if (file) fd.set("image", file);

    startTransition(async () => {
      const result = isEdit
        ? await updatePopup(initial!.id, fd)
        : await createPopup(fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "팝업이 수정되었습니다." : "팝업이 추가되었습니다.");
      if (isEdit) {
        router.refresh();
      } else {
        router.push("/admin/popups");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="popup_title">관리용 제목 *</Label>
          <Input
            id="popup_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 이번 주 행사 안내"
            maxLength={100}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="popup_image_alt">이미지 설명 (접근성)</Label>
          <Input
            id="popup_image_alt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="예: 이번 주 행사 안내 포스터"
            maxLength={200}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          팝업 이미지 {isEdit ? "(교체 시에만 업로드)" : <span className="text-red-500">*</span>}
        </Label>
        {previewUrl ? (
          <div className="flex items-start justify-between gap-3 rounded-xl bg-soft p-3 ring-1 ring-black/5">
            <div className="flex min-w-0 items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                className="size-24 shrink-0 rounded object-contain bg-white"
              />
              <div className="min-w-0">
                {file ? (
                  <>
                    <p className="truncate text-sm font-medium text-charcoal">
                      {file.name}
                    </p>
                    <p className="text-xs text-warm-gray">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-warm-gray">
                    현재 이미지 — 새 파일을 선택하면 교체됩니다.
                  </p>
                )}
              </div>
            </div>
            {file ? (
              <Button type="button" variant="ghost" size="icon-sm" onClick={clearFile}>
                <X className="size-4" aria-hidden />
                <span className="sr-only">제거</span>
              </Button>
            ) : null}
          </div>
        ) : (
          <label
            htmlFor="popup_image"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-8 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5"
          >
            <ImagePlus className="size-6" aria-hidden />
            <p className="text-sm font-medium text-charcoal">
              이미지를 클릭해서 업로드 (최대 5MB)
            </p>
          </label>
        )}
        <input
          id="popup_image"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onFileChange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="popup_starts_at">노출 시작 *</Label>
          <Input
            id="popup_starts_at"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="popup_ends_at">노출 종료 *</Label>
          <Input
            id="popup_ends_at"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>노출 위치</Label>
        <div className="flex flex-wrap gap-2">
          {POPUP_POSITIONS.map((p) => (
            <label
              key={p}
              className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm transition ${
                position === p
                  ? "border-primary-navy bg-primary-navy text-white"
                  : "border-slate-300 text-charcoal hover:border-primary-navy"
              }`}
            >
              <input
                type="radio"
                name="position"
                value={p}
                checked={position === p}
                onChange={() => setPosition(p)}
                className="sr-only"
              />
              {POSITION_LABELS[p]}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="popup_width">데스크톱 너비 (px)</Label>
          <Input
            id="popup_width"
            type="number"
            min={200}
            max={1200}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="popup_width_mobile">모바일 너비 (px)</Label>
          <Input
            id="popup_width_mobile"
            type="number"
            min={200}
            max={600}
            value={widthMobile}
            onChange={(e) => setWidthMobile(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="popup_priority">
            우선순위 <span className="text-xs text-warm-gray">(큰 값이 먼저)</span>
          </Label>
          <Input
            id="popup_priority"
            type="number"
            min={0}
            max={9999}
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="popup_link_url">클릭 링크 (선택)</Label>
          <Input
            id="popup_link_url"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
          />
          <label className="mt-1 flex items-center gap-2 text-sm text-warm-gray">
            <input
              type="checkbox"
              checked={linkTarget === "_blank"}
              onChange={(e) =>
                setLinkTarget(e.target.checked ? "_blank" : "_self")
              }
              className="size-4 accent-primary-navy"
            />
            새 창에서 열기
          </label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="popup_pages">노출 페이지 (콤마로 구분)</Label>
          <Input
            id="popup_pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="/ 또는 /, /about — 모든 페이지는 /*"
          />
          <p className="text-xs text-warm-gray">
            예: <code>/</code> = 메인만, <code>/, /about</code> = 메인+소개, <code>{"/*"}</code> = 모든 페이지
          </p>
        </div>
      </div>

      <fieldset className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <legend className="px-2 text-sm font-semibold text-charcoal">옵션</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 accent-primary-navy"
          />
          활성화 (체크 해제 시 기간 안이라도 노출되지 않음)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showCloseButton}
            onChange={(e) => setShowCloseButton(e.target.checked)}
            className="size-4 accent-primary-navy"
          />
          닫기 버튼 표시
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showDontShowToday}
            onChange={(e) => setShowDontShowToday(e.target.checked)}
            className="size-4 accent-primary-navy"
          />
          &quot;오늘 하루 보지 않기&quot; 체크박스 표시
        </label>
      </fieldset>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/popups")}
          disabled={pending}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="bg-primary-navy text-white hover:bg-secondary-sky"
          disabled={pending}
        >
          {pending ? "저장 중..." : isEdit ? "수정" : "팝업 추가"}
        </Button>
      </div>
    </form>
  );
}
