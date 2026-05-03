export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-6 w-48 animate-pulse rounded bg-warm-gray/15" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-warm-gray/10" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        <div className="space-y-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-4"
            >
              <div className="h-4 w-1/3 animate-pulse rounded bg-warm-gray/15" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-warm-gray/10" />
              <div className="ml-auto h-6 w-16 animate-pulse rounded-full bg-warm-gray/10" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        관리자 페이지를 불러오는 중입니다.
      </span>
    </div>
  );
}
