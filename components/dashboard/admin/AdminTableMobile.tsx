"use client";

import type { ReactNode } from "react";

interface AdminTableScrollProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableScroll({ children, className = "" }: AdminTableScrollProps) {
  return (
    <div
      className={`overflow-x-auto [-webkit-overflow-scrolling:touch] ${className}`}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {children}
    </div>
  );
}

interface AdminMobileCardProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  fields: { label: string; value: ReactNode }[];
  actions?: ReactNode;
}

export function AdminMobileCard({
  title,
  subtitle,
  badge,
  fields,
  actions,
}: AdminMobileCardProps) {
  return (
    <div className="rounded-lg border border-border-default bg-white p-4 shadow-sm md:hidden">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#151525] font-heading line-clamp-2">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-xs text-text-muted font-body line-clamp-2">{subtitle}</p>
          ) : null}
        </div>
        {badge}
      </div>
      <dl className="space-y-2 border-t border-border-soft pt-3">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-3 text-sm">
            <dt className="text-text-muted font-body shrink-0">{field.label}</dt>
            <dd className="text-end font-semibold text-[#151525] font-body">{field.value}</dd>
          </div>
        ))}
      </dl>
      {actions ? <div className="mt-4 border-t border-border-soft pt-3">{actions}</div> : null}
    </div>
  );
}

export function AdminDesktopTable({ children }: { children: ReactNode }) {
  return <div className="hidden md:block">{children}</div>;
}

export function AdminMobileList({ children }: { children: ReactNode }) {
  return <div className="space-y-3 md:hidden">{children}</div>;
}
