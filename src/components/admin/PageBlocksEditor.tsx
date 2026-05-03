"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  Type,
  X,
  AlignLeft,
  Image as ImageIcon,
  Quote,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PageBlock, PageBlockType } from "@/types/database";
import {
  createPageBlock,
  deletePageBlock,
  movePageBlock,
  updatePageBlock,
} from "@/lib/actions/page-blocks";

type Props = { pageKey: string; blocks: PageBlock[] };

const TYPE_LABELS: Record<PageBlockType, { label: string; Icon: typeof Type }> = {
  heading: { label: "제목", Icon: Type },
  paragraph: { label: "본문", Icon: AlignLeft },
  image: { label: "이미지", Icon: ImageIcon },
  quote: { label: "인용", Icon: Quote },
  youtube: { label: "동영상", Icon: Film },
};

const TYPE_ORDER: PageBlockType[] = [
  "heading",
  "paragraph",
  "image",
  "quote",
  "youtube",
];

export function PageBlocksEditor({ pageKey, blocks }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {blocks.length === 0 ? (
          <li className="rounded-2xl border-2 border-dashed border-warm-gray/30 bg-soft p-8 text-center text-sm text-warm-gray dark:bg-muted dark:text-muted-foreground">
            등록된 블록이 없습니다. 아래 [블록 추가]에서 시작하세요.
          </li>
        ) : (
          blocks.map((block, idx) => (
            <li
              key={block.id}
              className="rounded-2xl bg-white ring-1 ring-black/5 dark:bg-card dark:ring-border"
            >
              {editingId === block.id ? (
                <BlockForm
                  pageKey={pageKey}
                  initial={block}
                  onCancel={() => setEditingId(null)}
                  onDone={() => setEditingId(null)}
                />
              ) : (
                <BlockReadonly
                  pageKey={pageKey}
                  block={block}
                  isFirst={idx === 0}
                  isLast={idx === blocks.length - 1}
                  onEdit={() => setEditingId(block.id)}
                />
              )}
            </li>
          ))
        )}
      </ul>

      {adding ? (
        <div className="rounded-2xl bg-white ring-1 ring-primary-navy/30 dark:bg-card">
          <BlockForm
            pageKey={pageKey}
            onCancel={() => setAdding(false)}
            onDone={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-navy/30 bg-soft py-6 text-sm font-medium text-primary-navy transition hover:bg-primary-navy/5 dark:bg-muted dark:text-foreground dark:hover:bg-muted/70"
        >
          <Plus className="size-4" aria-hidden /> 블록 추가
        </button>
      )}
    </div>
  );
}

function BlockReadonly({
  pageKey,
  block,
  isFirst,
  isLast,
  onEdit,
}: {
  pageKey: string;
  block: PageBlock;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const meta = TYPE_LABELS[block.type];

  function move(direction: "up" | "down") {
    startTransition(async () => {
      const result = await movePageBlock(pageKey, block.id, direction);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    if (!window.confirm("이 블록을 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const result = await deletePageBlock(pageKey, block.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("삭제되었습니다.");
      router.refresh();
    });
  }

  return (
    <div className="flex items-start gap-3 p-4">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-navy/8 text-primary-navy dark:bg-muted dark:text-foreground">
        <meta.Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray dark:text-muted-foreground">
            {meta.label}
          </span>
          <span className="text-[10px] text-warm-gray/70">#{block.display_order + 1}</span>
        </div>
        <div className="mt-1 text-sm text-charcoal dark:text-foreground">
          {block.type === "heading" && (
            <p className="font-bold">{block.title}</p>
          )}
          {block.type === "paragraph" && (
            <p className="line-clamp-3 whitespace-pre-line">{block.body}</p>
          )}
          {block.type === "image" && block.image_url && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.image_url}
                alt={block.image_alt ?? ""}
                className="h-16 w-24 rounded object-cover ring-1 ring-black/5"
              />
              <span className="text-xs text-warm-gray dark:text-muted-foreground">
                {block.image_alt || "(설명 없음)"}
              </span>
            </div>
          )}
          {block.type === "quote" && (
            <p className="line-clamp-2 whitespace-pre-line italic">
              “{block.body}”
              {block.image_alt ? (
                <span className="ml-1 text-xs not-italic text-warm-gray">
                  — {block.image_alt}
                </span>
              ) : null}
            </p>
          )}
          {block.type === "youtube" && block.youtube_id && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${block.youtube_id}/hqdefault.jpg`}
                alt=""
                className="h-16 w-24 rounded object-cover ring-1 ring-black/5"
              />
              <span className="text-xs text-warm-gray dark:text-muted-foreground">
                {block.title || `youtu.be/${block.youtube_id}`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => move("up")}
          disabled={pending || isFirst}
          aria-label="위로"
        >
          <ArrowUp className="size-4" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => move("down")}
          disabled={pending || isLast}
          aria-label="아래로"
        >
          <ArrowDown className="size-4" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onEdit}
          disabled={pending}
          aria-label="편집"
        >
          <Pencil className="size-4" aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={remove}
          disabled={pending}
          aria-label="삭제"
          className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function BlockForm({
  pageKey,
  initial,
  onCancel,
  onDone,
}: {
  pageKey: string;
  initial?: PageBlock;
  onCancel: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<PageBlockType>(initial?.type ?? "paragraph");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.image_url ?? null,
  );

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  }

  function clearFile() {
    setFile(null);
    setPreviewUrl(initial?.image_url ?? null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData();
    fd.set("type", type);
    if (title.trim()) fd.set("title", title.trim());
    if (body.trim()) fd.set("body", body.trim());
    if (imageAlt.trim()) fd.set("image_alt", imageAlt.trim());
    if (youtubeUrl.trim()) fd.set("youtube_url", youtubeUrl.trim());
    if (file) fd.set("image", file);

    startTransition(async () => {
      const result = initial
        ? await updatePageBlock(pageKey, initial.id, fd)
        : await createPageBlock(pageKey, fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(initial ? "수정되었습니다." : "추가되었습니다.");
      router.refresh();
      onDone();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {TYPE_ORDER.map((t) => {
            const meta = TYPE_LABELS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition",
                  type === t
                    ? "border-primary-navy bg-primary-navy text-white"
                    : "border-slate-300 bg-white text-charcoal hover:border-primary-navy/40 dark:border-border dark:bg-muted dark:text-foreground",
                )}
              >
                <meta.Icon className="size-3.5" aria-hidden />
                {meta.label}
              </button>
            );
          })}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
          aria-label="닫기"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>

      {type === "heading" && (
        <div className="space-y-2">
          <Label htmlFor="b_title">제목</Label>
          <Input
            id="b_title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="섹션 제목"
          />
        </div>
      )}

      {type === "paragraph" && (
        <div className="space-y-2">
          <Label htmlFor="b_body">본문</Label>
          <Textarea
            id="b_body"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="본문 내용 (빈 줄로 단락 구분)"
          />
        </div>
      )}

      {type === "quote" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="b_quote_body">인용문</Label>
            <Textarea
              id="b_quote_body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="인용할 글귀"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b_quote_source">출처 (선택)</Label>
            <Input
              id="b_quote_source"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="예: 빌립보서 2:2"
            />
          </div>
        </div>
      )}

      {type === "youtube" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="b_yt_url">YouTube URL 또는 ID</Label>
            <Input
              id="b_yt_url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtu.be/... 또는 11자리 영상 ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b_yt_title">동영상 제목 (선택, 캡션 표시)</Label>
            <Input
              id="b_yt_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2026 신년감사예배 영상"
            />
          </div>
        </div>
      )}

      {type === "image" && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>이미지</Label>
            {previewUrl ? (
              <div className="flex items-start gap-3 rounded-xl bg-soft p-3 ring-1 ring-black/5 dark:bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt=""
                  className="h-32 w-48 rounded object-cover ring-1 ring-black/5"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    교체
                  </Button>
                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFile}
                    >
                      취소
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <label
                htmlFor="b_image"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-warm-gray/30 bg-soft px-6 py-8 text-center text-warm-gray transition hover:border-primary-navy/40 hover:bg-primary-navy/5 dark:bg-muted dark:text-muted-foreground"
              >
                <ImagePlus className="size-6" aria-hidden />
                <p className="text-sm font-medium text-charcoal dark:text-foreground">
                  이미지 업로드 (최대 10MB)
                </p>
              </label>
            )}
            <input
              id="b_image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b_alt">이미지 설명 (alt, 선택)</Label>
            <Input
              id="b_alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="예: 필리핀 단기선교 단체사진"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-black/5 pt-3 dark:border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={pending}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="bg-primary-navy text-white hover:bg-secondary-sky"
          disabled={pending}
        >
          {pending ? "저장 중..." : initial ? "수정" : "추가"}
        </Button>
      </div>
    </form>
  );
}
