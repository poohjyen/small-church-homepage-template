export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-16">
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-warm-gray/15" />
        <div className="h-9 w-64 animate-pulse rounded bg-warm-gray/15" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-warm-gray/10" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl bg-white p-5 ring-1 ring-black/5"
          >
            <div className="aspect-video w-full animate-pulse rounded-lg bg-warm-gray/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-warm-gray/15" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-warm-gray/10" />
          </div>
        ))}
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        페이지를 불러오는 중입니다.
      </span>
    </div>
  );
}
