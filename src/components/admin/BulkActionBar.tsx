"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Result = { ok: true; deleted?: number } | { ok: false; error: string };

type Props = {
  selectedCount: number;
  onClear: () => void;
  formId: string;
  action: (formData: FormData) => Promise<Result>;
  itemLabel?: string;
};

export function BulkActionBar({
  selectedCount,
  onClear,
  formId,
  action,
  itemLabel = "글",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (selectedCount === 0) return null;

  function onDelete() {
    if (!window.confirm(`선택한 ${selectedCount}건을 정말 삭제하시겠습니까?`)) {
      return;
    }
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) {
      toast.error("폼을 찾을 수 없습니다.");
      return;
    }
    const fd = new FormData(form);
    startTransition(async () => {
      const result = await action(fd);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`${result.deleted ?? selectedCount}건 삭제되었습니다.`);
      onClear();
      router.refresh();
    });
  }

  return (
    <div
      className="sticky bottom-4 z-20 mx-auto flex w-fit items-center gap-3 rounded-full bg-primary-navy px-4 py-2 text-white shadow-lg"
      role="status"
    >
      <span className="text-sm font-semibold">
        {itemLabel} {selectedCount}건 선택됨
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onClear}
        disabled={pending}
        className="border-white/30 bg-transparent text-white hover:bg-white/10"
      >
        선택 해제
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onDelete}
        disabled={pending}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        <Trash2 className="size-4" aria-hidden />
        {pending ? "삭제 중…" : "선택 삭제"}
      </Button>
    </div>
  );
}
