"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  User,
  Route,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard/student", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student#courses", label: "كورساتي", icon: BookOpen },
  { href: "/#paths", label: "مساري", icon: Route },
  { href: "/dashboard/student/events", label: "فعاليات", icon: Calendar },
  { href: "/dashboard/student/settings", label: "حسابي", icon: User },
] as const;

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function isActivePath(pathname: string, href: string, exact?: boolean) {
  const base = href.split("#")[0];
  if (exact) return pathname === base;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export default function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-default bg-white pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
      aria-label="التنقل السفلي"
    >
      <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href, "exact" in item ? item.exact : false);

          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                className={cx(
                  "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold font-body",
                  active ? "text-brand-violet-600" : "text-text-muted"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
