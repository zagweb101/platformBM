"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function applyAsInstructor(data: { bio: string }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  try {
    const existingInstructor = await db.instructor.findUnique({
      where: { userId: session.user.id },
    });

    if (existingInstructor) {
      if (existingInstructor.status === "APPROVED") {
        return { error: "أنت بالفعل مدرس معتمد بالمنصة." };
      }
      if (existingInstructor.status === "PENDING") {
        return { error: "طلبك قيد المراجعة بالفعل." };
      }
      // If rejected, let them update bio and apply again
      await db.instructor.update({
        where: { userId: session.user.id },
        data: {
          bio: data.bio,
          status: "PENDING",
        },
      });
    } else {
      await db.instructor.create({
        data: {
          userId: session.user.id,
          bio: data.bio,
          status: "PENDING",
          revenueShare: 60, // Default revenue share
        },
      });
    }

    revalidatePath("/dashboard/instructor/onboarding");
    return { success: "تم تقديم طلب الانضمام كمدرب بنجاح وهو قيد المراجعة حاليًا." };
  } catch (error) {
    console.error("Apply instructor error:", error);
    return { error: "حدث خطأ أثناء تقديم الطلب." };
  }
}

export async function approveInstructor(instructorId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "غير مصرح لك بالوصول. هذا الإجراء خاص بالمدير فقط." };
  }

  try {
    const instructor = await db.instructor.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      return { error: "لم يتم العثور على طلب المدرب." };
    }

    await db.$transaction([
      // 1. Update instructor status to APPROVED
      db.instructor.update({
        where: { id: instructorId },
        data: { status: "APPROVED" },
      }),
      // 2. Change User role to INSTRUCTOR
      db.user.update({
        where: { id: instructor.userId },
        data: { role: "INSTRUCTOR" },
      }),
    ]);

    revalidatePath("/dashboard/admin/instructors");
    return { success: "تمت الموافقة على طلب المدرب وتفعيل صلاحياته بنجاح." };
  } catch (error) {
    console.error("Approve instructor error:", error);
    return { error: "حدث خطأ أثناء الموافقة على طلب المدرب." };
  }
}

export async function rejectInstructor(instructorId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "غير مصرح لك بالوصول. هذا الإجراء خاص بالمدير فقط." };
  }

  try {
    const instructor = await db.instructor.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      return { error: "لم يتم العثور على طلب المدرب." };
    }

    await db.instructor.update({
      where: { id: instructorId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/dashboard/admin/instructors");
    return { success: "تم رفض طلب المدرب." };
  } catch (error) {
    console.error("Reject instructor error:", error);
    return { error: "حدث خطأ أثناء رفض الطلب." };
  }
}
