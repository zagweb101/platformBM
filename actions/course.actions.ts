"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  try {
    const instructor = await db.instructor.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructor || instructor.status !== "APPROVED") {
      return { error: "يجب أن تكون مدرسًا معتمدًا لإنشاء دورة." };
    }

    const course = await db.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnail: data.thumbnail || null,
        instructorId: instructor.id,
        status: "DRAFT",
      },
    });

    revalidatePath("/dashboard/instructor/courses");
    return { success: "تم إنشاء مسودة الدورة بنجاح.", courseId: course.id };
  } catch (error) {
    console.error("Create course error:", error);
    return { error: "حدث خطأ أثناء إنشاء الدورة." };
  }
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    thumbnail?: string;
    status?: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN";
  }
) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "غير مصرح لك بالوصول." };
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { instructor: true },
    });

    if (!course) {
      return { error: "الدورة غير موجودة." };
    }

    // Allow if they are the course instructor OR an ADMIN
    const isOwner = course.instructor.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return { error: "غير مصرح لك بتعديل هذه الدورة." };
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        ...data,
      },
    });

    revalidatePath(`/dashboard/instructor/courses/${courseId}`);
    revalidatePath(`/dashboard/instructor/courses`);
    revalidatePath("/dashboard/student");
    return { success: "تم تحديث الدورة بنجاح.", course: updatedCourse };
  } catch (error) {
    console.error("Update course error:", error);
    return { error: "حدث خطأ أثناء تحديث الدورة." };
  }
}

export async function createSection(courseId: string, title: string, order: number) {
  const session = await auth();
  if (!session) return { error: "غير مصرح لك." };

  try {
    const section = await db.section.create({
      data: {
        courseId,
        title,
        order,
      },
    });
    revalidatePath(`/dashboard/instructor/courses/${courseId}`);
    return { success: "تم إنشاء القسم بنجاح.", section };
  } catch (error) {
    return { error: "حدث خطأ أثناء إنشاء القسم." };
  }
}

export async function updateSection(sectionId: string, title: string, order: number) {
  try {
    const section = await db.section.update({
      where: { id: sectionId },
      data: { title, order },
    });
    revalidatePath(`/dashboard/instructor/courses/${section.courseId}`);
    return { success: "تم تحديث القسم بنجاح.", section };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث القسم." };
  }
}

export async function deleteSection(sectionId: string) {
  try {
    const section = await db.section.findUnique({
      where: { id: sectionId },
    });
    if (!section) return { error: "القسم غير موجود." };

    // Delete related lessons first
    await db.lesson.deleteMany({
      where: { sectionId },
    });

    await db.section.delete({
      where: { id: sectionId },
    });

    revalidatePath(`/dashboard/instructor/courses/${section.courseId}`);
    return { success: "تم حذف القسم ومحتوياته بنجاح." };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف القسم." };
  }
}

export async function createLesson(data: {
  sectionId: string;
  title: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}) {
  try {
    const section = await db.section.findUnique({
      where: { id: data.sectionId },
    });
    if (!section) return { error: "القسم غير موجود." };

    const lesson = await db.lesson.create({
      data: {
        sectionId: data.sectionId,
        title: data.title,
        videoUrl: data.videoUrl || null,
        duration: data.duration || null,
        order: data.order,
      },
    });

    revalidatePath(`/dashboard/instructor/courses/${section.courseId}`);
    return { success: "تم إضافة الدرس بنجاح.", lesson };
  } catch (error) {
    return { error: "حدث خطأ أثناء إضافة الدرس." };
  }
}

export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    videoUrl?: string;
    duration?: number;
    order?: number;
  }
) {
  try {
    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data,
      include: {
        section: true,
      },
    });
    revalidatePath(`/dashboard/instructor/courses/${lesson.section.courseId}`);
    return { success: "تم تحديث الدرس بنجاح.", lesson };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث الدرس." };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true },
    });
    if (!lesson) return { error: "الدرس غير موجود." };

    await db.lesson.delete({
      where: { id: lessonId },
    });

    revalidatePath(`/dashboard/instructor/courses/${lesson.section.courseId}`);
    return { success: "تم حذف الدرس بنجاح." };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الدرس." };
  }
}
