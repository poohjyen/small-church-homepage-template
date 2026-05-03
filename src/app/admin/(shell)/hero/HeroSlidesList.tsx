"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import type { HeroSlide } from "@/types/database";
import {
  deleteHeroSlide,
  reorderHeroSlide,
  toggleHeroSlide,
} from "./actions";
import { HeroSlideForm } from "./HeroSlideForm";

export function HeroSlidesList({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  function move(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderHeroSlide(id, direction);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function toggle(id: string, next: boolean) {
    startTransition(async () => {
      const result = await toggleHeroSlide(id, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(next ? "활성화되었습니다." : "비활성화되었습니다.");
      router.refresh();
    });
  }

  if (slides.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-sm text-warm-gray ring-1 ring-black/5">
        등록된 슬라이드가 없습니다. 위 폼에서 첫 슬라이드를 추가하세요.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {slides.map((s, idx) => (
        <li
          key={s.id}
          className="rounded-2xl bg-white p-4 ring-1 ring-black/5"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-soft md:w-56">
              <Image
                src={s.image_url}
                alt={s.title ?? "히어로 슬라이드"}
                fill
                sizes="(min-width: 768px) 224px, 100vw"
                className="object-cover"
              />
              {!s.is_active ? (
                <span className="absolute left-2 top-2 rounded-full bg-warm-gray px-2 py-0.5 text-[10px] font-semibold text-white">
                  비활성
                </span>
              ) : null}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-semibold text-charcoal">
                  {s.title || <span className="text-warm-gray">(제목 없음)</span>}
                </p>
                {s.subtitle ? (
                  <p className="text-sm text-warm-gray">{s.subtitle}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending || idx === 0}
                  onClick={() => move(s.id, "up")}
                >
                  <ArrowUp className="size-4" aria-hidden /> 위로
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending || idx === slides.length - 1}
                  onClick={() => move(s.id, "down")}
                >
                  <ArrowDown className="size-4" aria-hidden /> 아래로
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => toggle(s.id, !s.is_active)}
                >
                  {s.is_active ? (
                    <>
                      <EyeOff className="size-4" aria-hidden /> 비활성화
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" aria-hidden /> 활성화
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-warm-gray hover:text-primary-navy"
                  onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                >
                  <Pencil className="size-4" aria-hidden />
                  {editingId === s.id ? "수정 닫기" : "수정"}
                </Button>
                <DeleteButton
                  itemLabel={s.title || "(제목 없는 슬라이드)"}
                  action={deleteHeroSlide.bind(null, s.id)}
                />
              </div>
            </div>
          </div>
          {editingId === s.id ? (
            <div className="mt-4 border-t pt-4">
              <HeroSlideForm
                initial={s}
                onDone={() => setEditingId(null)}
              />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
