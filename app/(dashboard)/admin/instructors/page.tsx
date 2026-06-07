import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InstructorsClient from "./InstructorsClient";

export const revalidate = 0;

export default async function AdminInstructorsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all instructors with user details
  const instructors = await db.instructor.findMany({
    orderBy: { status: "asc" }, // Show pending first usually, or sorted by creation (though instructor doesn't have createdAt, user does)
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">إدارة طلبات المدربين</h2>
        <p className="text-sm text-text-secondary">
          راجع طلبات التقديم والانضمام كمدرب في الأكاديمية وامنحهم صلاحيات نشر وتعديل الدورات.
        </p>
      </div>

      <InstructorsClient initialInstructors={instructors} />
    </div>
  );
}
