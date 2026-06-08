"use client";

import { ChevronDown } from "lucide-react";
import {
  type ReactNode,
  type SelectHTMLAttributes,
  forwardRef,
  useId,
} from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
  icon?: ReactNode;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      options,
      error,
      hint,
      placeholder,
      disabled,
      className,
      selectClassName,
      icon,
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
              className="pointer-events-none absolute inset-y-0 end-10 flex items-center text-text-muted"
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}

          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={cx(errorId, hintId) || undefined}
            className={cx(
              "w-full min-h-[52px] appearance-none rounded-md border-[1.5px] bg-white px-4 text-base text-[#151525] font-body",
              "transition-all duration-200 outline-none",
              icon ? "pe-16" : "pe-10",
              error
                ? "border-[#DC2626] focus-visible:border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/20"
                : "border-border-default focus-visible:border-brand-violet-600 focus-visible:ring-2 focus-visible:ring-brand-violet-600/15",
              disabled && "opacity-50 cursor-not-allowed bg-surface-section",
              selectClassName
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute inset-y-0 end-4 my-auto h-5 w-5 text-text-muted"
            aria-hidden="true"
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
  }
);

Select.displayName = "Select";
