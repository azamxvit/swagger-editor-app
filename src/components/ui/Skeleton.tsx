export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[var(--surface)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function EditorSkeleton() {
  return (
    <section className="flex h-full flex-col gap-3 p-4" aria-busy="true" aria-label="Loading editor">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
      <Skeleton className="min-h-[280px] flex-1" />
      <Skeleton className="h-4 w-40" />
    </section>
  );
}

export function ViewerSkeleton() {
  return (
    <section className="flex h-full flex-col gap-3 p-4" aria-busy="true" aria-label="Loading viewer">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-56" />
      <div className="flex min-h-0 flex-1 gap-3">
        <div className="w-1/3 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
        <Skeleton className="flex-1" />
      </div>
    </section>
  );
}

export function HistorySkeleton() {
  return (
    <section className="animate-pulse space-y-3" aria-busy="true" aria-label="Loading history">
      <Skeleton className="h-8 w-48" />
      <div className="overflow-hidden rounded border border-[var(--border)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 last:border-0"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeaderAuthSkeleton() {
  return (
    <div className="flex items-center gap-2" aria-busy="true" aria-label="Loading authentication">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
