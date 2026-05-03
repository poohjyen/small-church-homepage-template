"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ActionResult = { ok: true } | { ok: false; error: string };

export function DeleteButton({
  itemLabel,
  iconOnly,
  action,
  redirectTo,
}: {
  itemLabel: string;
  iconOnly?: boolean;
  action: () => Promise<ActionResult>;
  redirectTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onConfirm() {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error || "삭제에 실패했습니다.");
        return;
      }
      setOpen(false);
      toast.success(`${itemLabel} 항목을 삭제했습니다.`);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size={iconOnly ? "icon-sm" : "sm"}
            className="text-warm-gray hover:text-red-600"
          >
            <Trash2 className="size-4" aria-hidden />
            {iconOnly ? <span className="sr-only">삭제</span> : "삭제"}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            「{itemLabel}」 항목이 영구히 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={pending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {pending ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
