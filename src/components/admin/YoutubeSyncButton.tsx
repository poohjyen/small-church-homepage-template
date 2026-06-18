"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type SyncAction = () => Promise<
  | { ok: true; found?: number; inserted?: number }
  | { ok: false; error: string }
>;

/** sermons·videos 공용 — 유튜브 재생목록 수동 동기화 버튼 */
export function YoutubeSyncButton({ action }: { action: SyncAction }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const found = result.found ?? 0;
      const inserted = result.inserted ?? 0;
      if (inserted > 0) {
        toast.success(
          `새 영상 ${inserted}건을 등록했습니다 (재생목록 ${found}건 확인).`,
        );
      } else {
        toast.success(`재생목록 ${found}건 모두 이미 등록된 영상입니다.`);
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={pending}
    >
      <RefreshCw
        className={pending ? "size-4 animate-spin" : "size-4"}
        aria-hidden
      />
      {pending ? "동기화 중..." : "유튜브에서 새 영상 가져오기"}
    </Button>
  );
}
