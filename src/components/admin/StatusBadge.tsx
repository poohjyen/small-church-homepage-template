import { cn } from "@/lib/utils";
import type { FormStatus } from "@/types/database";
import { FORM_STATUS_LABEL, FORM_STATUS_TONE } from "@/lib/data/helpers";

export function StatusBadge({ status }: { status: FormStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        FORM_STATUS_TONE[status],
      )}
    >
      {FORM_STATUS_LABEL[status]}
    </span>
  );
}
