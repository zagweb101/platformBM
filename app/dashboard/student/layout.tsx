import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StudentSidebar from "@/components/dashboard/student/StudentSidebar";
import StudentBottomNav from "@/components/dashboard/student/StudentBottomNav";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect(
      session.user.role === "ADMIN"
        ? "/dashboard/admin"
        : "/dashboard/instructor"
    );
  }

  return (
    <div className="min-h-screen bg-page lg:flex">
      <StudentSidebar
        userName={session.user.name ?? "طالب"}
        userEmail={session.user.email ?? ""}
        userImage={session.user.image}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <main id="main-content" tabIndex={-1} className="flex-1 pb-20 lg:pb-0">
          <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <StudentBottomNav />
    </div>
  );
}
