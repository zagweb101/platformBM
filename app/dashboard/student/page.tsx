import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getStudentDashboardData } from "@/lib/student-dashboard";
import StudentDashboardView, {
  StudentDashboardSkeleton,
  StudentDashboardError,
} from "@/components/dashboard/student/StudentDashboardView";

export const revalidate = 0;

async function StudentDashboardContent() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    const data = await getStudentDashboardData(session.user.id);
    return <StudentDashboardView data={data} />;
  } catch {
    return <StudentDashboardError />;
  }
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<StudentDashboardSkeleton />}>
      <StudentDashboardContent />
    </Suspense>
  );
}
