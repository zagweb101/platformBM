"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

export interface AdminActionItem {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "danger";
}

interface AdminActionsMenuProps {
  actions: AdminActionItem[];
  className?: string;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function AdminActionsMenu({ actions, className }: AdminActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (actions.length === 0) return null;

  return (
    <div ref={containerRef} className={cx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-md border border-border-default bg-white px-4 text-sm font-semibold text-[#151525] font-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="قائمة الإجراءات"
        aria-haspopup="menu"
      >
        الإجراءات
        <ChevronDown
          className={cx("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          id={menuId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-border-default bg-white shadow-hover"
          role="menu"
        >
          {actions.map((action) => (
            <li key={action.id} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={action.disabled || action.loading}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={cx(
                  "flex min-h-11 w-full items-center justify-between px-4 text-sm font-semibold font-body transition-colors",
                  action.variant === "danger"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-[#151525] hover:bg-surface-section",
                  (action.disabled || action.loading) && "opacity-50 cursor-not-allowed"
                )}
              >
                {action.label}
                {action.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** أزرار الإجراءات على Desktop — تُخفى على الجوال */
export function AdminDesktopActions({ children }: { children: React.ReactNode }) {
  return <div className="hidden items-center justify-center gap-2 md:flex">{children}</div>;
}

/** قائمة الإجراءات على الجوال فقط */
export function AdminMobileActions({
  actions,
}: {
  actions: AdminActionItem[];
}) {
  return (
    <div className="md:hidden">
      <AdminActionsMenu actions={actions} />
    </div>
  );
}
