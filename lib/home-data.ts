import { db } from "@/lib/db";
import { getCatalogCourses, type CatalogCourse } from "@/lib/courses-catalog";

export async function getFeaturedCourses() {
  const courses = await getCatalogCourses();
  return courses.slice(0, 6);
}

export type FeaturedCourse = CatalogCourse;

export async function getApprovedInstructors() {
  const instructors = await db.instructor.findMany({
    where: { status: "APPROVED" },
    include: {
      user: true,
      courses: {
        where: { status: "PUBLISHED" },
        include: {
          _count: { select: { enrollments: true } },
        },
      },
    },
    take: 6,
  });

  return instructors.map((instructor) => {
    const studentCount = instructor.courses.reduce(
      (total, course) => total + course._count.enrollments,
      0
    );

    return {
      id: instructor.id,
      name: instructor.user.name ?? "مدرب",
      image: instructor.user.image,
      bio: instructor.bio,
      courseCount: instructor.courses.length,
      studentCount,
    };
  });
}

export type HomeInstructor = Awaited<ReturnType<typeof getApprovedInstructors>>[number];

export async function getHeroStats() {
  const [platformCourses, platformStudents, lessonCount] = await Promise.all([
    db.course.count({ where: { status: "PUBLISHED" } }),
    db.user.count({ where: { role: "STUDENT" } }),
    db.lesson.count(),
  ]);

  return {
    courses: Math.max(platformCourses, 3),
    students: Math.max(platformStudents, 100),
    lessons: Math.max(lessonCount, 50),
  };
}
