"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Route,
  ListTodo,
  Award,
  Heart,
  Bell,
  Settings,
  LogOut,
  Calendar,
  CreditCard,
} from "lucide-react";
import Logo from "@/components/Logo";
import { logout } from "@/actions/auth.actions";

const NAV_ITEMS = [
  { href: "/dashboard/student", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student#courses", label: "كورساتي", icon: BookOpen },
  { href: "/dashboard/student/events", label: "فعالياتي", icon: Calendar },
  { href: "/dashboard/student/payments", label: "المدفوعات", icon: CreditCard },
  { href: "/#paths", label: "مساري", icon: Route },
  { href: "/dashboard/student#tasks", label: "المهام", icon: ListTodo },
  { href: "/dashboard/student#certificates", label: "الشهادات", icon: Award },
  { href: "/courses", label: "المفضلة", icon: Heart },
  { href: "/dashboard/student#notifications", label: "الإشعارات", icon: Bell },
  { href: "/dashboard/student/settings", label: "الملف الشخصي", icon: Settings },
] as const;

interface StudentSidebarProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function isActivePath(pathname: string, href: string, exact?: boolean) {
  const base = href.split("#")[0];
  if (exact) return pathname === base;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export default function StudentSidebar({
  userName,
  userEmail,
  userImage,
}: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-inline-start border-border-default bg-white lg:flex">
      <div className="border-b border-border-soft p-5">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="border-b border-border-soft p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-surface-section">
            {userImage ? (
              <Image src={userImage} alt={userName} fill sizes="44px" className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-brand-violet-600">
                {userName?.[0] ?? "ط"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#151525] font-heading">{userName}</p>
            <p className="truncate text-xs text-text-muted font-body">{userEmail}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="قائمة لوحة الطالب">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href, "exact" in item ? item.exact : false);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors font-body",
                active
                  ? "bg-[#F0EEF5] text-brand-violet-600"
                  : "text-text-secondary hover:bg-surface-section hover:text-[#151525]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border-soft p-3">
        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 font-body"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            تسجيل الخروج
          </button>
        </form>
      </div>
    </aside>
  );
}
