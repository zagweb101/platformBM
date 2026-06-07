"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { calculateInstructorShare, toNumber } from "@/lib/money";
import { sendPaymentApprovedEmail } from "@/lib/email";
import { z } from "zod";

const ReceiptSchema = z.object({
  courseId: z.string().min(1),
  receiptUrl: z.string().url("رابط الإيصال غير صالح"),
});

export async function uploadReceipt(courseId: string, receiptUrl: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  const parsed = ReceiptSchema.safeParse({ courseId, receiptUrl });
  if (!parsed.success) {
    return { error: "البيانات المدخلة غير صالحة." };
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.status !== "PUBLISHED") {
      return { error: "الدورة غير متاحة للاشتراك." };
    }

    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return { error: "أنت مشترك بالفعل في هذه الدورة." };
    }

    const pendingPayment = await db.payment.findFirst({
      where: {
        userId: session.user.id,
        courseId,
        status: "PENDING",
      },
    });

    if (pendingPayment) {
      return { error: "لديك طلب تفعيل معلّق لهذه الدورة بالفعل." };
    }

    const amount = course.price;

    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        courseId,
        amount,
        receiptUrl,
        method: "BANK_TRANSFER",
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/student/payments");
    return {
      success: "تم رفع إيصال الدفع بنجاح وهو قيد المراجعة الآن.",
      payment: {
        id: payment.id,
        amount: toNumber(payment.amount),
        receiptUrl: payment.receiptUrl ?? "",
      },
    };
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

    const { course, userId } = payment;
    const instructor = course.instructor;

    if (!instructor) {
      return { error: "لم يتم العثور على مدرس لهذه الدورة." };
    }

    const expectedAmount = toNumber(course.price);
    const paidAmount = toNumber(payment.amount);

    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      return {
        error: `المبلغ المدفوع (${paidAmount} ر.س) لا يطابق سعر الدورة (${expectedAmount} ر.س).`,
      };
    }

    const instructorShare = calculateInstructorShare(
      payment.amount,
      instructor.revenueShare
    );

    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: { status: "APPROVED" },
      });

      await tx.enrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        create: {
          userId,
          courseId: course.id,
        },
        update: {},
      });

      await tx.instructor.update({
        where: { id: instructor.id },
        data: {
          walletBalance: {
            increment: instructorShare,
          },
        },
      });

      await tx.walletTransaction.create({
        data: {
          instructorId: instructor.id,
          amount: instructorShare,
          type: "CREDIT",
          description: `أرباح التسجيل في دورة "${course.title}" للمشترك ${payment.user.name}`,
        },
      });
    });

    if (payment.user.email && course.title) {
      await sendPaymentApprovedEmail(payment.user.email, course.title);
    }

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
