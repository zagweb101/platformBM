import { db } from "@/lib/db";

export async function getCourseProgress(userId: string, courseId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      progress: { where: { completed: true } },
      course: {
        include: {
          sections: { include: { lessons: true } },
        },
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  const totalLessons = enrollment.course.sections.reduce(
    (acc, s) => acc + s.lessons.length,
    0
  );
  const completedLessons = enrollment.progress.length;
  const percent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    enrollmentId: enrollment.id,
    totalLessons,
    completedLessons,
    percent,
    isComplete: totalLessons > 0 && completedLessons >= totalLessons,
  };
}

export async function getEnrollmentProgressMap(userId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      progress: { where: { completed: true } },
      course: {
        include: {
          sections: { include: { lessons: true } },
        },
      },
    },
  });

  const map: Record<
    string,
    { percent: number; isComplete: boolean; completedLessons: number; totalLessons: number }
  > = {};

  for (const e of enrollments) {
    const totalLessons = e.course.sections.reduce(
      (acc, s) => acc + s.lessons.length,
      0
    );
    const completedLessons = e.progress.length;
    const percent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    map[e.courseId] = {
      percent,
      isComplete: totalLessons > 0 && completedLessons >= totalLessons,
      completedLessons,
      totalLessons,
    };
  }

  return map;
}
