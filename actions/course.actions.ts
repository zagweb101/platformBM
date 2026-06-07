"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  assertCanEditCourse,
  assertCanEditSection,
  assertCanEditLesson,
} from "@/lib/course-access";
import { parseVideoProviderFromInput } from "@/lib/video/secure-video";

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

export async function adminCreateCourse(data: {
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  instructorId?: string;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id || session.user.role !== "ADMIN") {
    return { error: "غير مصرح لك بالوصول. هذه العملية متاحة للمدير فقط." };
  }

  try {
    let instructorId = data.instructorId;

    if (!instructorId) {
      let adminInstructor = await db.instructor.findUnique({
        where: { userId: session.user.id },
      });

      if (!adminInstructor) {
        adminInstructor = await db.instructor.create({
          data: {
            userId: session.user.id,
            bio: "مدير المنصة",
            status: "APPROVED",
            revenueShare: 100,
          },
        });
      }

      instructorId = adminInstructor.id;
    }

    const course = await db.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnail: data.thumbnail || null,
        instructorId: instructorId,
        status: "PUBLISHED",
      },
    });

    revalidatePath("/dashboard/admin/courses");
    return { success: "تم إنشاء الدورة بنجاح.", courseId: course.id };
  } catch (error) {
    console.error("Admin create course error:", error);
    return { error: "حدث خطأ أثناء إنشاء الدورة." };
  }
}

export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    return { error: "غير مصرح لك بالوصول." };
  }

  try {
    const sections = await db.section.findMany({
      where: { courseId },
      select: { id: true },
    });
    const sectionIds = sections.map((s) => s.id);

    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      select: { id: true },
    });
    const enrollmentIds = enrollments.map((e) => e.id);

    if (enrollmentIds.length > 0) {
      await db.lessonProgress.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      });
    }

    await db.enrollment.deleteMany({ where: { courseId } });

    if (sectionIds.length > 0) {
      await db.lesson.deleteMany({
        where: { sectionId: { in: sectionIds } },
      });
    }

    await db.section.deleteMany({ where: { courseId } });
    await db.payment.deleteMany({ where: { courseId } });
    await db.course.delete({ where: { id: courseId } });

    revalidatePath("/dashboard/admin/courses");
    return { success: "تم حذف الدورة بنجاح." };
  } catch (error) {
    console.error("Delete course error:", error);
    return { error: "حدث خطأ أثناء حذف الدورة." };
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
  if (!session || !session.user || !session.user.id) {
    return { error: "غير مصرح لك بالوصول." };
  }

  try {
    const access = await assertCanEditCourse(
      courseId,
      session.user.id,
      session.user.role
    );
    if ("error" in access) {
      return access;
    }

    const isAdmin = session.user.role === "ADMIN";
    const updateData = { ...data };

    if (!isAdmin && updateData.status) {
      if (updateData.status !== "DRAFT" && updateData.status !== "PENDING") {
        return {
          error: "يمكن للمدرب فقط حفظ الدورة كمسودة أو إرسالها للمراجعة.",
        };
      }
    }

    await db.course.update({
      where: { id: courseId },
      data: updateData,
    });

    revalidatePath(`/dashboard/instructor/courses/${courseId}`);
    revalidatePath(`/dashboard/instructor/courses`);
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/admin/courses");
    return { success: "تم تحديث الدورة بنجاح." };
  } catch (error) {
    console.error("Update course error:", error);
    return { error: "حدث خطأ أثناء تحديث الدورة." };
  }
}

export async function createSection(courseId: string, title: string, order: number) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return { error: "غير مصرح لك." };
  }

  const access = await assertCanEditCourse(
    courseId,
    session.user.id,
    session.user.role
  );
  if ("error" in access) {
    return access;
  }

  try {
    const section = await db.section.create({
      data: {
        courseId,
        title,
        order,
      },
    });
    revalidatePath(`/dashboard/instructor/courses/${courseId}`);
    revalidatePath(`/dashboard/admin/courses/${courseId}`);
    return { success: "تم إنشاء القسم بنجاح.", section };
  } catch (error) {
    return { error: "حدث خطأ أثناء إنشاء القسم." };
  }
}

export async function updateSection(sectionId: string, title: string, order: number) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return { error: "غير مصرح لك." };
  }

  const access = await assertCanEditSection(
    sectionId,
    session.user.id,
    session.user.role
  );
  if ("error" in access) {
    return access;
  }

  try {
    const section = await db.section.update({
      where: { id: sectionId },
      data: { title, order },
    });
    revalidatePath(`/dashboard/instructor/courses/${access.courseId}`);
    revalidatePath(`/dashboard/admin/courses/${access.courseId}`);
    return { success: "تم تحديث القسم بنجاح.", section };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث القسم." };
  }
}

export async function deleteSection(sectionId: string) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return { error: "غير مصرح لك." };
  }

  const access = await assertCanEditSection(
    sectionId,
    session.user.id,
    session.user.role
  );
  if ("error" in access) {
    return access;
  }

  try {
    await db.lesson.deleteMany({
      where: { sectionId },
    });

    await db.section.delete({
      where: { id: sectionId },
    });

    revalidatePath(`/dashboard/instructor/courses/${access.courseId}`);
    revalidatePath(`/dashboard/admin/courses/${access.courseId}`);
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
  const session = await auth();
  if (!session || !session.user?.id) {
    return { error: "غير مصرح لك." };
  }

  const section = await db.section.findUnique({
    where: { id: data.sectionId },
  });
  if (!section) return { error: "القسم غير موجود." };

  const access = await assertCanEditCourse(
    section.courseId,
    session.user.id,
    session.user.role
  );
  if ("error" in access) {
    return access;
  }

  try {
    const videoFields = data.videoUrl
      ? parseVideoProviderFromInput(data.videoUrl)
      : {
          videoProvider: "DIRECT" as const,
          videoId: null,
          videoPrivacyHash: null,
        };

    const lesson = await db.lesson.create({
      data: {
        sectionId: data.sectionId,
        title: data.title,
        videoUrl: data.videoUrl || null,
        ...videoFields,
        duration: data.duration || null,
        order: data.order,
      },
    });

    revalidatePath(`/dashboard/instructor/courses/${section.courseId}`);
    revalidatePath(`/dashboard/admin/courses/${section.courseId}`);
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
  const session = await auth();
  if (!session || !session.user?.id) {
    return { error: "غير مصرح لك." };
  }

  const access = await assertCanEditLesson(
    lessonId,
    session.user.id,
    session.user.role
  );
  if ("error" in access) {
    return access;
  }

  try {
    const updateData: typeof data & {
      videoProvider?: ReturnType<typeof parseVideoProviderFromInput>["videoProvider"];
      videoId?: string | null;
      videoPrivacyHash?: string | null;
    } = { ...data };

    if (data.videoUrl !== undefined) {
      if (data.videoUrl) {
        Object.assign(updateData, parseVideoProviderFromInput(data.videoUrl));
      } else {
        updateData.videoProvider = "DIRECT";
        updateData.videoId = null;
        updateData.videoPrivacyHash = null;
      }
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: updateData,
      include: {
        section: true,
      },
    });
    revalidatePath(`/dashboard/instructor/courses/${access.courseId}`);
    revalidatePath(`/dashboard/admin/courses/${access.courseId}`);
    return { success: "تم تحديث الدرس بنجاح.", lesson };
  } catch (error) {
    return { error: "حدث خطأ أثناء تحديث الدرس." };
  }
}

export async function deleteLesson(lessonId: string) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return { error: "غير مصرح لك." };
  }

  const access = await assertCanEditLesson(
    lessonId,
    session.user.id,
    session.user.role
  );
  if ("error" in access) {
    return access;
  }

  try {
    await db.lesson.delete({
      where: { id: lessonId },
    });

    revalidatePath(`/dashboard/instructor/courses/${access.courseId}`);
    revalidatePath(`/dashboard/admin/courses/${access.courseId}`);
    return { success: "تم حذف الدرس بنجاح." };
  } catch (error) {
    return { error: "حدث خطأ أثناء حذف الدرس." };
  }
}
