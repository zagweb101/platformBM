"use client";

import { Eye, EyeOff } from "lucide-react";
import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      label,
      error,
      hint,
      icon,
      disabled,
      className,
      inputClassName,
      id: idProp,
      autoComplete = "current-password",
      ...props
    },
    ref
  ) {
    const [visible, setVisible] = useState(false);
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
              className="pointer-events-none absolute inset-y-0 end-12 flex items-center text-text-muted"
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}

          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={error ? true : undefined}
            aria-describedby={cx(errorId, hintId) || undefined}
            className={cx(
              "w-full min-h-[52px] rounded-md border-[1.5px] bg-white px-4 text-base text-[#151525] font-body",
              "transition-all duration-200 outline-none",
              "placeholder:text-text-muted",
              (icon ? "pe-20" : "pe-12"),
              error
                ? "border-[#DC2626] focus-visible:border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/20"
                : "border-border-default focus-visible:border-brand-violet-600 focus-visible:ring-2 focus-visible:ring-brand-violet-600/15",
              disabled && "opacity-50 cursor-not-allowed bg-surface-section",
              inputClassName
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            disabled={disabled}
            className={cx(
              "absolute inset-y-0 end-3 flex min-h-[44px] min-w-[44px] items-center justify-center",
              "rounded-md text-text-muted transition-colors hover:text-[#151525]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600"
            )}
            aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {visible ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
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
  }
);

PasswordInput.displayName = "PasswordInput";
