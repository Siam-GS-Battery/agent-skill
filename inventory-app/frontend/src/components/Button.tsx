import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
const styles: Record<Variant, string> = {
  // pill primary in Action Blue + scale(0.95) press = the Apple grammar
  primary: "bg-action text-white hover:bg-action-focus",
  ghost: "bg-white text-action border border-action hover:bg-parchment",
  danger: "bg-danger text-white hover:opacity-90",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${styles[variant]} ${className}`}
    />
  );
}
