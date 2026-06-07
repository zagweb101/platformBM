import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient";
import { resolveSecureVideo } from "@/lib/video/secure-video";
import type { SecureVideoEmbed } from "@/lib/video/secure-video";

export const revalidate = 0;

export default async function StudentCoursePlayerPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // 1. Verify that student is enrolled in this course
  const enrollment = await db.enrollment.findFirst({
    where: {
      userId: session.user.id,
      courseId,
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
        where: { id: courseId, instructorId: instructorRecord.id },
      })
    : null;

  if (!enrollment && !isAdmin && !isInstructorOfCourse) {
    // If not enrolled and not admin/instructor, redirect to payments/register
    redirect("/dashboard/student/payments");
  }

  // 2. Fetch course details with sections and lessons
  const course = await db.course.findUnique({
    where: { id: courseId },
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
  const activeLesson = allLessons.find((l) => l.id === lessonId);

  if (!activeLesson) {
    // Redirect to first lesson of the course if requested lesson id is invalid
    const firstLesson = allLessons[0];
    if (firstLesson) {
      redirect(`/dashboard/student/learn/${courseId}/${firstLesson.id}`);
    } else {
      redirect("/dashboard/student");
    }
  }

  const completedLessonIds = enrollment ? enrollment.progress.map((p) => p.lessonId) : [];

  const secureEmbed: SecureVideoEmbed = await resolveSecureVideo(activeLesson);

  const sectionsForClient = course.sections.map((section) => ({
    ...section,
    lessons: section.lessons.map(({ id, title, duration, order }) => ({
      id,
      title,
      duration,
      order,
    })),
  }));

  return (
    <CoursePlayerClient
      courseId={course.id}
      courseTitle={course.title}
      sections={sectionsForClient}
      activeLesson={{
        id: activeLesson.id,
        title: activeLesson.title,
        duration: activeLesson.duration,
        order: activeLesson.order,
      }}
      secureEmbed={secureEmbed}
      enrollmentId={enrollment?.id || "admin_bypass"}
      completedLessonIds={completedLessonIds}
    />
  );
}
