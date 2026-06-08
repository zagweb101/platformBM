"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";

export type InputType =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "number"
  | "search"
  | "datetime-local";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  type?: InputType;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const inputModeMap: Partial<
  Record<InputType, InputHTMLAttributes<HTMLInputElement>["inputMode"]>
> = {
  email: "email",
  tel: "tel",
  number: "numeric",
  search: "search",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    type = "text",
    error,
    hint,
    icon,
    disabled,
    className,
    inputClassName,
    id: idProp,
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

      <div className="relative">
        {icon ? (
          <span
            className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-text-muted"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          inputMode={props.inputMode ?? inputModeMap[type]}
          aria-invalid={error ? true : undefined}
          aria-describedby={cx(errorId, hintId) || undefined}
          className={cx(
            "w-full min-h-[52px] rounded-md border-[1.5px] bg-white px-4 text-base text-[#151525] font-body",
            "transition-all duration-200 outline-none",
            "placeholder:text-text-muted",
            icon ? "pe-12" : undefined,
            error
              ? "border-[#DC2626] focus-visible:border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/20"
              : "border-border-default focus-visible:border-brand-violet-600 focus-visible:ring-2 focus-visible:ring-brand-violet-600/15",
            disabled && "opacity-50 cursor-not-allowed bg-surface-section",
            inputClassName
          )}
          {...props}
        />
      </div>

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
});

Input.displayName = "Input";
