import { db } from "@/lib/db";
import { calculateInstructorShare, toNumber } from "@/lib/money";
import { sendPaymentApprovedEmail } from "@/lib/email";
import type { PaymentMethod } from "@prisma/client";

export async function completeCoursePayment({
  userId,
  courseId,
  method,
  externalId,
}: {
  userId: string;
  courseId: string;
  method: PaymentMethod;
  externalId: string;
}) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { instructor: true },
  });

  if (!course || course.status !== "PUBLISHED") {
    return { error: "الدورة غير متاحة." };
  }

  const existingApproved = await db.payment.findFirst({
    where: {
      OR: [{ externalId }, { id: externalId }],
      status: "APPROVED",
      courseId,
      userId,
    },
  });

  if (existingApproved) {
    return { success: true, alreadyProcessed: true };
  }

  const instructor = course.instructor;
  if (!instructor) {
    return { error: "لم يتم العثور على مدرس للدورة." };
  }

  const instructorShare = calculateInstructorShare(
    course.price,
    instructor.revenueShare
  );

  const user = await db.user.findUnique({ where: { id: userId } });

  await db.$transaction(async (tx) => {
    const existing = await tx.payment.findFirst({
      where: {
        OR: [
          { externalId },
          { id: externalId },
          { externalId: externalId, userId, courseId },
        ],
      },
    });

    if (existing) {
      await tx.payment.update({
        where: { id: existing.id },
        data: {
          status: "APPROVED",
          externalId,
          method,
        },
      });
    } else {
      await tx.payment.create({
        data: {
          userId,
          courseId,
          amount: course.price,
          method,
          externalId,
          status: "APPROVED",
        },
      });
    }

    await tx.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      create: { userId, courseId },
      update: {},
    });

    await tx.instructor.update({
      where: { id: instructor.id },
      data: {
        walletBalance: { increment: instructorShare },
      },
    });

    await tx.walletTransaction.create({
      data: {
        instructorId: instructor.id,
        amount: instructorShare,
        type: "CREDIT",
        description: `أرباح الدفع — دورة "${course.title}" (${method})`,
      },
    });
  });

  if (user?.email) {
    await sendPaymentApprovedEmail(user.email, course.title);
  }

  return { success: true };
}

export async function findPaymentByReference(referenceId: string) {
  return db.payment.findFirst({
    where: {
      OR: [{ id: referenceId }, { externalId: referenceId }],
    },
    include: {
      user: true,
      course: true,
    },
  });
}

export async function assertCourseCheckoutAllowed(userId: string, courseId: string) {
  const course = await db.course.findUnique({ where: { id: courseId } });

  if (!course || course.status !== "PUBLISHED") {
    return { error: "الدورة غير متاحة للاشتراك." };
  }

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (enrollment) {
    return { error: "أنت مشترك بالفعل في هذه الدورة." };
  }

  const pendingPayment = await db.payment.findFirst({
    where: {
      userId,
      courseId,
      status: "PENDING",
      method: { not: "BANK_TRANSFER" },
    },
  });

  if (pendingPayment) {
    return { error: "لديك عملية دفع معلّقة لهذه الدورة." };
  }

  if (toNumber(course.price) < 100) {
    return {
      error: "الدفع بالأقساط متاح للدورات بقيمة 100 ر.س فأكثر.",
    };
  }

  return { course };
}
