import { type HTMLAttributes } from "react";

type SectionHeadingAlign = "right" | "center" | "left";

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: SectionHeadingAlign;
  titleGradient?: boolean;
  className?: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const alignClasses: Record<SectionHeadingAlign, string> = {
  right: "text-start items-start",
  center: "text-center items-center",
  left: "text-end items-end",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "right",
  titleGradient = false,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cx(
        "flex flex-col gap-2 max-w-3xl",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-brand-violet-600 font-body">
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cx(
          "text-section font-heading font-bold text-[#151525]",
          titleGradient && "gradient-text text-transparent"
        )}
      >
        {title}
      </h2>

      {description ? (
        <p className="text-body text-text-secondary font-body">{description}</p>
      ) : null}
    </div>
  );
}
