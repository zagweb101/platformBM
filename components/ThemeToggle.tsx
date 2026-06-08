"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-elevated animate-pulse" />;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-subtle bg-card p-2.5 transition-colors text-text-primary hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600 focus-visible:ring-offset-2 dark:hover:bg-dark-elevated"
      aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-500" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-brand-indigo" aria-hidden="true" />
      )}
    </button>
  );
}
