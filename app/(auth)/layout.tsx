import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthVisualPanel, { AuthMobileVisual } from "@/components/auth/AuthVisualPanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <AuthVisualPanel />

      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex items-center justify-between px-4 pt-4 sm:px-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-violet-600 font-body"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            الرئيسية
          </Link>
        </div>

        <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
          <AuthMobileVisual />
          <div className="mx-auto w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
