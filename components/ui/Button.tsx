"use client";

import Link from "next/link";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "gradient-brand text-white shadow-brand hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-violet-600 focus-visible:ring-offset-2",
  secondary:
    "bg-surface-section text-[#151525] border border-border-default hover:bg-surface-hover",
  outline:
    "border-[1.5px] border-brand-violet-600 text-brand-violet-600 bg-transparent hover:bg-brand-violet-600/5",
  ghost:
    "bg-transparent text-[#151525] hover:bg-surface-section border border-transparent",
  danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
  link: "bg-transparent text-brand-violet-600 hover:underline p-0 h-auto min-h-0 border-0 shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 min-h-9 px-4 text-sm gap-2",
  md: "h-11 min-h-11 px-6 text-base gap-2",
  lg: "h-14 min-h-14 px-8 text-lg gap-3",
  icon: "h-12 min-h-12 w-12 min-w-12 p-0 gap-0",
};

function Spinner({ size }: { size: ButtonSize }) {
  const dim = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <span
      className={cx(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        dim
      )}
      aria-hidden="true"
    />
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      href,
      className,
      icon,
      children,
      type = "button",
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;
    const isLinkVariant = variant === "link";

    const baseClasses = cx(
      "inline-flex items-center justify-center font-semibold font-body transition-all duration-200",
      "rounded-md focus-visible:outline-none",
      !isLinkVariant && "rounded-md",
      variantClasses[variant],
      !isLinkVariant && sizeClasses[size],
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
      className
    );

    const content = loading ? (
      <>
        <Spinner size={size} />
        <span className="sr-only">جاري التحميل</span>
      </>
    ) : (
      <>
        {icon ? <span className="inline-flex shrink-0">{icon}</span> : null}
        {children}
      </>
    );

    if (href && !isDisabled) {
      return (
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
