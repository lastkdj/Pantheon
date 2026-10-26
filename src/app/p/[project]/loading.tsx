export default function Loading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <div className="h-9 w-72 animate-pulse rounded bg-ink-3" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded bg-ink-2" />
      <div className="panel h-64 animate-pulse" />
    </div>
  );
}
