import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  message?: string;
  icon?: ReactNode;
};

export function EmptyState({ message = "등록된 항목이 없습니다.", icon }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl bg-soft px-6 py-20 text-center ring-1 ring-black/5">
      <div className="text-warm-gray" aria-hidden>
        {icon ?? <Inbox className="size-12" strokeWidth={1.5} />}
      </div>
      <p className="mt-4 text-base text-warm-gray md:text-lg">{message}</p>
    </div>
  );
}
