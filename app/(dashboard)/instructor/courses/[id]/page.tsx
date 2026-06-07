import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CourseBuilderClient from "./CourseBuilderClient";

export const revalidate = 0;

export default async function InstructorCourseBuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Fetch course details with sections and lessons
  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: true,
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    redirect("/dashboard/instructor/courses");
  }

  // Verify ownership
  const isOwner = course.instructor.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/dashboard/instructor/courses");
  }

  return (
    <CourseBuilderClient
      initialCourse={{
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        status: course.status,
        sections: course.sections,
      }}
    />
  );
}
