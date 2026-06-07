import { db } from "@/lib/db";

type CourseWithInstructor = NonNullable<
  Awaited<ReturnType<typeof db.course.findUnique>>
> & {
  instructor: { userId: string };
};

export async function getCourseForEditor(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: { instructor: true },
  });
}

export async function assertCanEditCourse(
  courseId: string,
  userId: string,
  role: string
): Promise<{ course: CourseWithInstructor } | { error: string }> {
  const course = await getCourseForEditor(courseId);

  if (!course) {
    return { error: "الدورة غير موجودة." };
  }

  const isOwner = course.instructor.userId === userId;
  const isAdmin = role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return { error: "غير مصرح لك بتعديل هذه الدورة." };
  }

  return { course };
}

export async function assertCanEditSection(
  sectionId: string,
  userId: string,
  role: string
): Promise<{ courseId: string } | { error: string }> {
  const section = await db.section.findUnique({
    where: { id: sectionId },
    select: { courseId: true },
  });

  if (!section) {
    return { error: "القسم غير موجود." };
  }

  const access = await assertCanEditCourse(section.courseId, userId, role);
  if ("error" in access) {
    return access;
  }

  return { courseId: section.courseId };
}

export async function assertCanEditLesson(
  lessonId: string,
  userId: string,
  role: string
): Promise<{ courseId: string } | { error: string }> {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { select: { courseId: true } } },
  });

  if (!lesson) {
    return { error: "الدرس غير موجود." };
  }

  const access = await assertCanEditCourse(lesson.section.courseId, userId, role);
  if ("error" in access) {
    return access;
  }

  return { courseId: lesson.section.courseId };
}
