"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { issueCertificateIfEligible } from "@/lib/certificate";

export async function markLessonComplete(
  enrollmentId: string,
  lessonId: string,
  completed: boolean
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  try {
    // Check if enrollment belongs to the current user
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment || enrollment.userId !== session.user.id) {
      return { error: "سجل الاشتراك هذا غير صالح أو لا ينتمي إليك." };
    }

    // Try to find if progress record already exists
    const progress = await db.lessonProgress.findFirst({
      where: {
        enrollmentId,
        lessonId,
      },
    });

    if (progress) {
      await db.lessonProgress.update({
        where: { id: progress.id },
        data: { completed },
      });
    } else {
      await db.lessonProgress.create({
        data: {
          enrollmentId,
          lessonId,
          completed,
        },
      });
    }

    if (completed) {
      await issueCertificateIfEligible(session.user.id, enrollment.courseId);
    }

    revalidatePath(`/dashboard/student/learn/${enrollment.courseId}/${lessonId}`);
    revalidatePath("/dashboard/student");
    return { success: "تم تحديث التقدم بنجاح." };
  } catch (error) {
    console.error("Mark lesson complete error:", error);
    return { error: "حدث خطأ أثناء تحديث تقدم الدرس." };
  }
}
