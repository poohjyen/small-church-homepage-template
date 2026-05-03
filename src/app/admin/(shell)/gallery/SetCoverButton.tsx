"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { setGalleryCover } from "./actions";

type Props = {
  galleryId: string;
  imageUrl: string;
  isCover: boolean;
};

export function SetCoverButton({ galleryId, imageUrl, isCover }: Props) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (isCover) return;
    startTransition(async () => {
      const result = await setGalleryCover(galleryId, imageUrl);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("대표사진이 변경되었습니다.");
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending || isCover}
      className={cn(
        "absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold shadow-sm transition disabled:opacity-80",
        isCover
          ? "bg-primary-navy text-white"
          : "bg-white/90 text-charcoal hover:bg-white",
      )}
      aria-label={isCover ? "현재 대표사진" : "대표로 지정"}
    >
      <Star className={cn("size-3", isCover && "fill-current")} aria-hidden />
      {pending ? "변경 중…" : isCover ? "대표" : "대표 지정"}
    </button>
  );
}
