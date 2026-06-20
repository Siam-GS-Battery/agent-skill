import type { InputHTMLAttributes } from "react";

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      <input
        id={inputId}
        {...props}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-action ${
          error ? "border-danger" : "border-hairline"
        } ${className}`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
