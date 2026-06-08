"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: BottomSheetProps) {
  const titleId = useId();
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="إغلاق"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-xl bg-white shadow-hover"
        onTouchStart={(event) => {
          startY.current = event.touches[0].clientY;
          currentY.current = 0;
        }}
        onTouchMove={(event) => {
          const delta = event.touches[0].clientY - startY.current;
          if (delta > 0) currentY.current = delta;
        }}
        onTouchEnd={() => {
          if (currentY.current > 80) onClose();
          currentY.current = 0;
        }}
      >
        <div className="flex justify-center py-3">
          <span className="h-1.5 w-12 rounded-full bg-border-default" aria-hidden="true" />
        </div>

        <div className="flex items-center justify-between border-b border-border-soft px-5 pb-3">
          {title ? (
            <h2 id={titleId} className="text-lg font-bold text-[#151525] font-heading">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted hover:bg-surface-section"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="border-t border-border-soft p-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
