import { type HTMLAttributes, type ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand";

type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children?: ReactNode;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-section text-[#151525] border border-border-default",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-sky-50 text-sky-700 border border-sky-200",
  brand: "",
};

const brandClasses =
  "gradient-brand text-white border-0 shadow-sm";

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full font-semibold font-body whitespace-nowrap",
        variant === "brand" ? brandClasses : variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
