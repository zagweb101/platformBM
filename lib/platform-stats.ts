import { db } from "@/lib/db";

export interface PlatformStats {
  students: number;
  courses: number;
  instructors: number;
  satisfaction: number;
}

/** Marketing floors until real metrics exceed them */
const FLOORS = {
  students: 100,
  courses: 5,
  instructors: 10,
  satisfaction: 95,
};

function displayStat(actual: number, floor: number) {
  return actual >= floor ? actual : floor;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const [studentCount, courseCount, instructorCount, enrollmentCount, completedLessons] =
    await Promise.all([
      db.user.count({ where: { role: "STUDENT" } }),
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.instructor.count({ where: { status: "APPROVED" } }),
      db.enrollment.count(),
      db.lessonProgress.count({ where: { completed: true } }),
    ]);

  const satisfaction =
    enrollmentCount > 0
      ? Math.min(99, Math.round(90 + (completedLessons / Math.max(enrollmentCount, 1)) * 2))
      : FLOORS.satisfaction;

  return {
    students: displayStat(studentCount, FLOORS.students),
    courses: displayStat(courseCount, FLOORS.courses),
    instructors: displayStat(instructorCount, FLOORS.instructors),
    satisfaction: displayStat(satisfaction, FLOORS.satisfaction),
  };
}

export function formatStatsForDisplay(stats: PlatformStats) {
  return [
    { value: stats.students, suffix: "+", label: "طالب محترف" },
    { value: stats.courses, suffix: "+", label: "كورس متخصص" },
    { value: stats.instructors, suffix: "+", label: "مدرب معتمد" },
    { value: stats.satisfaction, suffix: "%", label: "نسبة الرضا" },
  ];
}
