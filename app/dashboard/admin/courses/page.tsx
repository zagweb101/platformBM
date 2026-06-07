import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CoursesClient from "./CoursesClient";

export const revalidate = 0;

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all courses in database
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          sections: true,
          enrollments: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">إدارة واعتماد الدورات</h2>
        <p className="text-sm text-text-secondary">
          تصفح الدورات التي تم إنشاؤها وتعديلها بواسطة المدربين بالمنصة، وقم بتفعيل نشرها أو إخفائها عن الطلاب.
        </p>
      </div>

      <CoursesClient initialCourses={courses} />
    </div>
  );
}
