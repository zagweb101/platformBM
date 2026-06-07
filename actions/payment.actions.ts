"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function uploadReceipt(courseId: string, amount: number, receiptUrl: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  try {
    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        courseId,
        amount,
        receiptUrl,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/student/payments");
    return { success: "تم رفع إيصال الدفع بنجاح وهو قيد المراجعة الآن.", payment };
  } catch (error) {
    console.error("Upload receipt error:", error);
    return { error: "حدث خطأ أثناء رفع إيصال الدفع." };
  }
}

export async function approvePayment(paymentId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "غير مصرح لك بالوصول. هذا الإجراء خاص بالمدير فقط." };
  }

  try {
    // 1. Fetch payment with user and course info
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    if (!payment) {
      return { error: "لم يتم العثور على سجل الدفع هذا." };
    }

    if (payment.status === "APPROVED") {
      return { error: "تمت الموافقة على هذا الدفع مسبقًا." };
    }

    if (!payment.courseId || !payment.course) {
      return { error: "سجل الدفع هذا غير مرتبط بدورة تدريبية." };
    }

    const { course, userId, amount } = payment;
    const instructor = course.instructor;

    if (!instructor) {
      return { error: "لم يتم العثور على مدرس لهذه الدورة." };
    }

    // 2. Calculate instructor share
    const instructorShare = amount * (instructor.revenueShare / 100);

    // 3. Execute prisma transaction
    await db.$transaction(async (tx) => {
      // 1. Set payment status = APPROVED
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: "APPROVED" },
      });

      // 2. Create Enrollment record (if not already exists)
      const existingEnrollment = await tx.enrollment.findFirst({
        where: { userId, courseId: course.id },
      });

      if (!existingEnrollment) {
        await tx.enrollment.create({
          data: {
            userId,
            courseId: course.id,
          },
        });
      }

      // 3. Add calculated amount to instructor.walletBalance
      await tx.instructor.update({
        where: { id: instructor.id },
        data: {
          walletBalance: {
            increment: instructorShare,
          },
        },
      });

      // 4. Create WalletTransaction record with type CREDIT
      await tx.walletTransaction.create({
        data: {
          instructorId: instructor.id,
          amount: instructorShare,
          type: "CREDIT",
          description: `أرباح التسجيل في دورة "${course.title}" للمشترك ${payment.user.name}`,
        },
      });
    });

    revalidatePath("/dashboard/admin/payments");
    revalidatePath("/dashboard/student/payments");
    return { success: "تمت الموافقة على الدفع وتفعيل الدورة للمشترك وشحن محفظة المدرب." };
  } catch (error) {
    console.error("Approve payment error:", error);
    return { error: "حدث خطأ أثناء الموافقة على الدفع." };
  }
}

export async function rejectPayment(paymentId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return { error: "غير مصرح لك بالوصول. هذا الإجراء خاص بالمدير فقط." };
  }

  try {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return { error: "لم يتم العثور على سجل الدفع." };
    }

    await db.payment.update({
      where: { id: paymentId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/dashboard/admin/payments");
    revalidatePath("/dashboard/student/payments");
    return { success: "تم رفض طلب الدفع." };
  } catch (error) {
    console.error("Reject payment error:", error);
    return { error: "حدث خطأ أثناء رفض الدفع." };
  }
}
