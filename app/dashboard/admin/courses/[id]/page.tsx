import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminCourseBuilderClient from "./AdminCourseBuilderClient";

export const revalidate = 0;

export default async function AdminCourseBuilderPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch course details with sections and lessons
  const course = await db.course.findUnique({
    where: { id: params.id },
    include: {
      instructor: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
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
    redirect("/dashboard/admin/courses");
  }

  return (
    <AdminCourseBuilderClient
      initialCourse={{
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        status: course.status,
        sections: course.sections,
        instructorName: course.instructor.user.name,
      }}
    />
  );
}
