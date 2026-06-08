"use client";

import {
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  textareaClassName?: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
      disabled,
      className,
      textareaClassName,
      id: idProp,
      rows = 4,
      ...props
    },
    ref
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;

    return (
      <div className={cx("w-full space-y-2", className)}>
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[#151525] font-body"
        >
          {label}
        </label>

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={cx(errorId, hintId) || undefined}
          className={cx(
            "w-full min-h-[120px] resize-y rounded-md border-[1.5px] bg-white px-4 py-3 text-base text-[#151525] font-body",
            "transition-all duration-200 outline-none leading-relaxed",
            "placeholder:text-text-muted",
            error
              ? "border-[#DC2626] focus-visible:border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/20"
              : "border-border-default focus-visible:border-brand-violet-600 focus-visible:ring-2 focus-visible:ring-brand-violet-600/15",
            disabled && "opacity-50 cursor-not-allowed bg-surface-section",
            textareaClassName
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-sm text-[#DC2626] font-body" role="alert">
            {error}
          </p>
        ) : null}

        {!error && hint ? (
          <p id={hintId} className="text-sm text-text-muted font-body">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
