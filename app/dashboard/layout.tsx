import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = session.user.role as "ADMIN" | "INSTRUCTOR" | "STUDENT";

  if (role === "STUDENT") {
    return <div className="min-h-screen bg-page">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-primary">
      {/* Sidebar - Desktop */}
      <DashboardSidebar
        role={role}
        userName={session.user.name || ""}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-subtle bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-text-primary font-cairo">
              لوحة التحكم
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-grow p-4 md:p-8 bg-secondary/30 relative overflow-x-hidden"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
