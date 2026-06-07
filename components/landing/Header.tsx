"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, LogIn, User, LogOut } from "lucide-react";
import { logout } from "@/actions/auth.actions";

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0f]/85 backdrop-blur-md border-b border-brand-indigo/20 shadow-[0_4px_30px_rgba(79,70,229,0.05)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-fuchsia p-[1.5px] transition-transform duration-300 group-hover:rotate-12 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-brand-fuchsia"
              >
                <path
                  d="M12 2L2 12L12 22L22 12L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="fill-brand-indigo/10"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-fuchsia bg-clip-text text-fill-transparent webkit-text-fill-transparent font-cairo">
            بيت المصور
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors font-tajawal"
          >
            الرئيسية
          </Link>
          <Link
            href="/#courses"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors font-tajawal"
          >
            الكورسات
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors font-tajawal"
          >
            عن الأكاديمية
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors font-tajawal"
          >
            تواصل معنا
          </Link>
        </nav>

        {/* Desktop CTA / Auth */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-violet hover:to-brand-fuchsia shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 font-cairo"
              >
                <User className="w-4 h-4" />
                {getDashboardLabel()}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center justify-center p-2.5 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all duration-300"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition-colors font-tajawal"
              >
                <LogIn className="w-4 h-4" />
                دخول
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-indigo to-brand-fuchsia hover:from-brand-violet hover:to-brand-fuchsia shadow-[0_0_20px_rgba(79,70,229,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 font-cairo"
              >
                ابدأ رحلتك
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu (RTL from right) */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-sm bg-[#0a0a0f] border-l border-gray-900 shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Drawer Close Button & Logo */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-lg font-black bg-gradient-to-r from-brand-indigo to-brand-fuchsia bg-clip-text text-fill-transparent webkit-text-fill-transparent font-cairo">
              بيت المصور
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center p-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-300 hover:text-white py-2 border-b border-gray-900 font-tajawal"
            >
              الرئيسية
            </Link>
            <Link
              href="/#courses"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-300 hover:text-white py-2 border-b border-gray-900 font-tajawal"
            >
              الكورسات
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-300 hover:text-white py-2 border-b border-gray-900 font-tajawal"
            >
              عن الأكاديمية
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-gray-300 hover:text-white py-2 border-b border-gray-900 font-tajawal"
            >
              تواصل معنا
            </Link>
          </nav>
        </div>

        {/* Drawer Footer Auth */}
        <div className="border-t border-gray-900 pt-6">
          {session?.user ? (
            <div className="flex flex-col gap-3">
              <div className="text-xs text-gray-500 mb-1">
                مرحباً بك، <strong className="text-white">{session.user.name}</strong>
              </div>
              <Link
                href={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-indigo to-brand-fuchsia font-cairo"
              >
                <User className="w-4 h-4" />
                {getDashboardLabel()}
              </Link>
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-colors text-sm font-bold font-cairo"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-800 text-gray-300 hover:text-white font-tajawal"
              >
                <LogIn className="w-4 h-4" />
                دخول
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-indigo to-brand-fuchsia font-cairo"
              >
                ابدأ رحلتك
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
