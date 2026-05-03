import { Inbox } from "lucide-react";

export function AdminEmptyState({
  message,
  hint,
}: {
  message: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center ring-1 ring-black/5">
      <Inbox
        className="size-10 text-warm-gray/60"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="mt-4 text-sm font-medium text-charcoal">{message}</p>
      {hint ? <p className="mt-1 text-xs text-warm-gray">{hint}</p> : null}
    </div>
  );
}
