import React from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <ThemeToggle />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-6">
          <Logo />
        </Link>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-brand p-8 bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-fuchsia/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-indigo/5 rounded-full blur-2xl pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  );
}
