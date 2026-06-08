import { type HTMLAttributes } from "react";

type SkeletonVariant = "text" | "heading" | "card" | "image" | "circle" | "custom";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const variantClasses: Record<Exclude<SkeletonVariant, "custom">, string> = {
  text: "h-4 w-full rounded-md",
  heading: "h-8 w-3/4 rounded-md",
  card: "h-48 w-full rounded-lg",
  image: "aspect-video w-full rounded-lg",
  circle: "h-12 w-12 rounded-full",
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const isCustom = variant === "custom" || width !== undefined || height !== undefined;

  return (
    <div
      aria-hidden="true"
      className={cx(
        "animate-pulse bg-gray-200",
        !isCustom && variantClasses[variant as Exclude<SkeletonVariant, "custom">],
        className
      )}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      {...props}
    />
  );
}
