import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import InstructorCoursesClient from "./InstructorCoursesClient";

export const revalidate = 0;

export default async function InstructorCoursesPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Find instructor record first
  const instructor = await db.instructor.findUnique({
    where: { userId: session.user.id },
  });

  if (!instructor || instructor.status !== "APPROVED") {
    redirect("/dashboard/instructor");
  }

  // Fetch all courses belonging to this instructor
  const courses = await db.course.findMany({
    where: { instructorId: instructor.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          sections: true,
          enrollments: true,
        },
      },
    },
  });

  return <InstructorCoursesClient initialCourses={courses} />;
}
