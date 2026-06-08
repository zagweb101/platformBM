"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, Search, User, LogOut, X } from "lucide-react";
import { logout } from "@/actions/auth.actions";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", exact: true },
  { href: "/courses", label: "الكورسات" },
  { href: "/#paths", label: "المسارات" },
  { href: "/#instructors", label: "المدربون" },
  { href: "/about", label: "عن الأكاديمية" },
] as const;

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
      <div
        className={cx(
          "relative flex items-center justify-center rounded-xl gradient-brand p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-brand",
          compact ? "w-9 h-9" : "w-10 h-10"
        )}
      >
        <div className="w-full h-full bg-brand-navy-950 rounded-[10px] flex items-center justify-center">
          <svg
            width={compact ? 16 : 20}
            height={compact ? 16 : 20}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-brand-magenta"
            aria-hidden="true"
          >
            <path
              d="M12 2L2 12L12 22L22 12L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <span className="logo-text text-lg sm:text-xl">بيت المصور</span>
    </Link>
  );
}

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isScrolled = useScrollPosition(80);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isDarkSurface =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms-of-service";

  const isTransparent = isDarkSurface && !isScrolled;

  const getDashboardLink = () => {
    if (!session?.user) return "/login";
    if (session.user.role === "ADMIN") return "/dashboard/admin";
    if (session.user.role === "INSTRUCTOR") return "/dashboard/instructor";
    return "/dashboard/student";
  };

  const getDashboardLabel = () => {
    if (!session?.user) return "";
    if (session.user.role === "ADMIN") return "لوحة المدير";
    if (session.user.role === "INSTRUCTOR") return "لوحة المدرب";
    return "لوحة الطالب";
  };

  const isActive = (href: string, exact?: boolean) => {
    if (href.startsWith("/#")) return pathname === "/";
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  const navLinkClass = (href: string, exact?: boolean) =>
    cx(
      "relative text-sm font-semibold font-body transition-colors duration-200 py-1",
      isActive(href, exact)
        ? "text-brand-violet-600 after:absolute after:-bottom-1 after:inset-x-0 after:h-0.5 after:rounded-full after:bg-brand-violet-600"
        : isTransparent
          ? "text-white/85 hover:text-white"
          : "text-text-secondary hover:text-[#151525]"
    );

  const drawerLinkClass =
    "flex min-h-14 items-center text-base font-semibold text-[#151525] border-b border-border-soft hover:text-brand-violet-600 transition-colors font-body";

  return (
    <>
      <header
        className={cx(
          "sticky top-0 z-50 h-[72px] transition-all duration-300",
          isScrolled
            ? "bg-white shadow-sm border-b border-border-default"
            : isTransparent
              ? "bg-transparent backdrop-blur-sm"
              : "bg-white border-b border-border-default"
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* الشعار — يمين RTL */}
          <Logo />

          {/* Desktop navigation */}
          <nav
            className="hidden lg:flex flex-1 items-center justify-center gap-8"
            aria-label="التنقل الرئيسي"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(link.href, "exact" in link ? link.exact : false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions — يسار RTL */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/#courses"
              className={cx(
                "inline-flex min-h-12 min-w-12 items-center justify-center rounded-md transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600",
                isTransparent
                  ? "text-white/85 hover:text-white hover:bg-white/10"
                  : "text-text-secondary hover:text-[#151525] hover:bg-surface-section"
              )}
              aria-label="بحث"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>

            {session?.user ? (
              <>
                <Button
                  href={getDashboardLink()}
                  variant="outline"
                  size="md"
                  icon={<User className="h-4 w-4" aria-hidden="true" />}
                >
                  {getDashboardLabel()}
                </Button>
                <form action={logout}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    aria-label="تسجيل الخروج"
                    icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
                  />
                </form>
              </>
            ) : (
              <>
                <Button href="/login" variant="outline" size="md">
                  دخول
                </Button>
                <Button href="/register" variant="primary" size="md">
                  ابدأ التعلم
                </Button>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <Link
              href="/#courses"
              className={cx(
                "inline-flex min-h-12 min-w-12 items-center justify-center rounded-md transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600",
                isTransparent
                  ? "text-white/85 hover:text-white hover:bg-white/10"
                  : "text-text-secondary hover:text-[#151525] hover:bg-surface-section"
              )}
              aria-label="بحث"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={cx(
                "inline-flex min-h-12 min-w-12 items-center justify-center rounded-md transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600",
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-[#151525] hover:bg-surface-section"
              )}
              aria-label="فتح القائمة"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      ) : null}

      {/* Mobile drawer — من اليمين */}
      <aside
        id="mobile-nav-drawer"
        className={cx(
          "fixed inset-y-0 start-0 z-[70] flex w-[280px] max-w-[85vw] flex-col bg-white shadow-hover lg:hidden",
          "transition-transform duration-300 ease-in-out",
          drawerOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <Logo compact />
          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md text-text-secondary hover:bg-surface-section hover:text-[#151525] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-2" aria-label="قائمة الجوال">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              className={drawerLinkClass}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border-soft p-5 space-y-3">
          {session?.user ? (
            <>
              <p className="text-sm text-text-muted font-body mb-1">
                مرحباً،{" "}
                <span className="font-semibold text-[#151525]">{session.user.name}</span>
              </p>
              <Button
                href={getDashboardLink()}
                variant="outline"
                size="lg"
                className="w-full"
                icon={<User className="h-4 w-4" aria-hidden="true" />}
              >
                {getDashboardLabel()}
              </Button>
              <form action={logout} className="w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  size="lg"
                  className="w-full text-red-600"
                  icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
                >
                  تسجيل الخروج
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="outline" size="lg" className="w-full">
                دخول
              </Button>
              <Button href="/register" variant="primary" size="lg" className="w-full">
                ابدأ التعلم
              </Button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
