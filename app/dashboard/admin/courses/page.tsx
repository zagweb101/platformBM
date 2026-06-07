import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CoursesClient from "./CoursesClient";
import { serializeCoursePrice } from "@/lib/serialize-client";

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

  // Fetch approved instructors for the create course dropdown
  const instructors = await db.instructor.findMany({
    where: { status: "APPROVED" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">إدارة واعتماد الدورات</h2>
        <p className="text-sm text-text-secondary">
          أنشئ دورات جديدة، أو تصفح الدورات التي تم إنشاؤها بواسطة المدربين. يمكنك تعديل محتواها أو نشرها أو إخفائها.
        </p>
      </div>

      <CoursesClient
        initialCourses={courses.map(serializeCoursePrice)}
        instructors={instructors}
      />
    </div>
  );
}
