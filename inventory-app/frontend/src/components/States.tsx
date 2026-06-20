// Loading / Empty / Error — every async surface gets all three.
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-muted" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-action" />
      {label}
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-hairline bg-white py-16 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-white py-12 text-center" role="alert">
      <p className="text-sm font-semibold text-danger">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm font-semibold text-action active:scale-95">
          Try again
        </button>
      )}
    </div>
  );
}
