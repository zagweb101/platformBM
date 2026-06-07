import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient";

export const revalidate = 0;

export default async function StudentCoursePlayerPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // 1. Verify that student is enrolled in this course
  const enrollment = await db.enrollment.findFirst({
    where: {
      userId: session.user.id,
      courseId: params.courseId,
    },
    include: {
      progress: {
        where: { completed: true },
        select: {
          lessonId: true,
        },
      },
    },
  });

  // Check if user is admin or course instructor to bypass enrollment check for previewing/debugging
  const isAdmin = session.user.role === "ADMIN";
  
  let instructorRecord = null;
  if (session.user.role === "INSTRUCTOR") {
    instructorRecord = await db.instructor.findUnique({
      where: { userId: session.user.id },
    });
  }

  const isInstructorOfCourse = instructorRecord
    ? await db.course.findFirst({
        where: { id: params.courseId, instructorId: instructorRecord.id },
      })
    : null;

  if (!enrollment && !isAdmin && !isInstructorOfCourse) {
    // If not enrolled and not admin/instructor, redirect to payments/register
    redirect("/dashboard/student/payments");
  }

  // 2. Fetch course details with sections and lessons
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
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
    redirect("/dashboard/student");
  }

  // 3. Find active lesson
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const activeLesson = allLessons.find((l) => l.id === params.lessonId);

  if (!activeLesson) {
    // Redirect to first lesson of the course if requested lesson id is invalid
    const firstLesson = allLessons[0];
    if (firstLesson) {
      redirect(`/dashboard/student/learn/${params.courseId}/${firstLesson.id}`);
    } else {
      redirect("/dashboard/student");
    }
  }

  const completedLessonIds = enrollment ? enrollment.progress.map((p) => p.lessonId) : [];

  return (
    <CoursePlayerClient
      courseId={course.id}
      courseTitle={course.title}
      sections={course.sections}
      activeLesson={activeLesson}
      enrollmentId={enrollment?.id || "admin_bypass"}
      completedLessonIds={completedLessonIds}
    />
  );
}
