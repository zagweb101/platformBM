import { db } from "@/lib/db";
import { getEnrollmentProgressMap } from "@/lib/course-progress";

export async function getStudentDashboardData(userId: string) {
  const [user, enrollments, certificates, recentPayments] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true },
    }),
    db.enrollment.findMany({
      where: { userId },
      include: {
        progress: { where: { completed: true }, select: { lessonId: true } },
        course: {
          include: {
            instructor: { include: { user: { select: { name: true } } } },
            sections: {
              orderBy: { order: "asc" },
              include: {
                lessons: { orderBy: { order: "asc" }, select: { id: true, title: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.certificate.findMany({
      where: { userId },
      select: { id: true, courseId: true, issuedAt: true },
    }),
    db.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { course: { select: { title: true } } },
    }),
  ]);

  const progressMap = await getEnrollmentProgressMap(userId);

  const enrollmentsWithProgress = enrollments.map((enrollment) => {
    const progress = progressMap[enrollment.courseId] ?? {
      percent: 0,
      isComplete: false,
      completedLessons: 0,
      totalLessons: 0,
    };

    const completedLessonIds = new Set(
      enrollment.progress.map((item) => item.lessonId)
    );

    let nextLesson: { id: string; title: string } | null = null;
    for (const section of enrollment.course.sections) {
      for (const lesson of section.lessons) {
        if (!completedLessonIds.has(lesson.id)) {
          nextLesson = lesson;
          break;
        }
      }
      if (nextLesson) break;
    }

    return {
      enrollmentId: enrollment.id,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
        instructorName: enrollment.course.instructor.user.name,
      },
      progress,
      nextLesson,
    };
  });

  const activeCourses = enrollmentsWithProgress.filter(
    (item) => !item.progress.isComplete && item.progress.percent < 100
  );
  const completedCourses = enrollmentsWithProgress.filter(
    (item) => item.progress.isComplete
  );

  const continueCourse =
    activeCourses.find((item) => item.progress.percent > 0) ??
    activeCourses[0] ??
    enrollmentsWithProgress[0] ??
    null;

  const notifications = recentPayments.map((payment) => ({
    id: payment.id,
    title:
      payment.status === "APPROVED"
        ? `تم تفعيل الدفع — ${payment.course?.title ?? "دورة"}`
        : payment.status === "PENDING"
          ? `دفع قيد المراجعة — ${payment.course?.title ?? "دورة"}`
          : `تحديث على الدفع — ${payment.course?.title ?? "دورة"}`,
    time: payment.createdAt,
  }));

  return {
    user,
    continueCourse,
    activeCourses: enrollmentsWithProgress.filter((item) => !item.progress.isComplete),
    stats: {
      completed: completedCourses.length,
      active: activeCourses.length,
      pendingTasks: 0,
      certificates: certificates.length,
    },
    notifications,
    hasCourses: enrollments.length > 0,
  };
}

export type StudentDashboardData = Awaited<ReturnType<typeof getStudentDashboardData>>;

export function getMotivationalLine() {
  const lines = [
    "كل درس اليوم يقربك من احتراف التصوير.",
    "استمر — الممارسة هي سر التقدم.",
    "شغفك بالتصوير يستحق أن تخصص له وقتاً يومياً.",
    "خطوة صغيرة اليوم تصنع فرقاً كبيراً غداً.",
  ];
  const dayIndex = new Date().getDate() % lines.length;
  return lines[dayIndex];
}

export function formatArabicDate(date = new Date()) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "منذ قليل";
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "منذ يوم";
  return `منذ ${diffDays} أيام`;
}
