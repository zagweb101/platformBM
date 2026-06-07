"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { resolveSecureVideo } from "@/lib/video/secure-video";
import { revalidatePath } from "next/cache";

export async function getLessonSecureVideo(lessonId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "غير مصرح." };
  }

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  const isAdmin = session.user.role === "ADMIN";
  let isInstructorOfCourse = false;

  if (session.user.role === "INSTRUCTOR") {
    const instructor = await db.instructor.findUnique({
      where: { userId: session.user.id },
    });
    if (instructor) {
      const owned = await db.course.findFirst({
        where: { id: courseId, instructorId: instructor.id },
      });
      isInstructorOfCourse = Boolean(owned);
    }
  }

  if (!enrollment && !isAdmin && !isInstructorOfCourse) {
    return { error: "غير مصرح بمشاهدة هذا المحتوى." };
  }

  const lesson = await db.lesson.findFirst({
    where: {
      id: lessonId,
      section: { courseId },
    },
  });

  if (!lesson) {
    return { error: "الدرس غير موجود." };
  }

  const embed = await resolveSecureVideo(lesson);
  return { embed };
}

export async function refreshLessonVideoToken(lessonId: string, courseId: string) {
  revalidatePath(`/dashboard/student/learn/${courseId}/${lessonId}`);
  return getLessonSecureVideo(lessonId, courseId);
}
