import { type HTMLAttributes, type ReactNode } from "react";

type CardVariant = "default" | "elevated" | "bordered" | "ghost";
type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  clickable?: boolean;
  className?: string;
  children?: ReactNode;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white shadow-card",
  elevated: "bg-white shadow-hover",
  bordered: "bg-white border-[1.5px] border-border-default shadow-none",
  ghost: "bg-surface-section shadow-none",
};

const paddingClasses: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "default",
  padding = "md",
  clickable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cx(
        "rounded-lg transition-all duration-[240ms]",
        variantClasses[variant],
        paddingClasses[padding],
        clickable &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-hover focus-within:-translate-y-0.5 focus-within:shadow-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
