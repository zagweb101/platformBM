"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { logout } from "@/actions/auth.actions";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Users,
  GraduationCap,
  Sparkles,
  LogOut,
  Home,
  FileCheck,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  userName: string;
}

export default function DashboardSidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();

  // Define links based on roles
  const getLinks = () => {
    switch (role) {
      case "ADMIN":
        return [
          {
            href: "/dashboard/admin",
            label: "الإحصائيات العامة",
            icon: LayoutDashboard,
          },
          {
            href: "/dashboard/admin/payments",
            label: "مراجعة المدفوعات",
            icon: CreditCard,
          },
          {
            href: "/dashboard/admin/instructors",
            label: "طلبات المدربين",
            icon: Users,
          },
          {
            href: "/dashboard/admin/courses",
            label: "إدارة الدورات",
            icon: BookOpen,
          },
          {
            href: "/dashboard/admin/contacts",
            label: "رسائل التواصل",
            icon: MessageSquare,
          },
        ];
      case "INSTRUCTOR":
        return [
          {
            href: "/dashboard/instructor",
            label: "المحفظة والإحصائيات",
            icon: LayoutDashboard,
          },
          {
            href: "/dashboard/instructor/courses",
            label: "دوراتي التعليمية",
            icon: BookOpen,
          },
          {
            href: "/dashboard/instructor/onboarding",
            label: "تعديل بيانات المدرب",
            icon: Sparkles,
          },
        ];
      case "STUDENT":
      default:
        return [
          {
            href: "/dashboard/student",
            label: "دوراتي التعليمية",
            icon: GraduationCap,
          },
          {
            href: "/dashboard/student/payments",
            label: "سجل المدفوعات والاشتراك",
            icon: FileCheck,
          },
          {
            href: "/dashboard/instructor/onboarding",
            label: "التقديم كمدرب",
            icon: Sparkles,
          },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="w-64 border-l border-subtle bg-card h-screen flex flex-col justify-between sticky top-0">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-subtle flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-secondary border border-subtle">
          <div className="text-xs text-text-muted">مرحباً بك</div>
          <div className="text-sm font-bold text-text-primary truncate">{userName}</div>
          <div className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-cairo bg-brand-indigo/10 text-brand-indigo">
            {role === "ADMIN" ? "مدير المنصة" : role === "INSTRUCTOR" ? "مدرب معتمد" : "طالب"}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-text-secondary hover:bg-secondary hover:text-text-primary`}
          >
            <Home className="w-5 h-5" />
            الرئيسية
          </Link>
          
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-indigo/10 text-brand-indigo border-r-3 border-brand-fuchsia"
                    : "text-text-secondary hover:bg-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-subtle">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </form>
      </div>
    </div>
  );
}
