import {
  fetchMoyasarPayment,
  halalasFromAmount,
  isMoyasarPaymentPaid,
} from "@/lib/moyasar";
import { completeCoursePayment } from "@/lib/complete-course-payment";
import { db } from "@/lib/db";

export async function completeMoyasarPayment({
  moyasarPaymentId,
  courseId,
  userId,
}: {
  moyasarPaymentId: string;
  courseId: string;
  userId: string;
}) {
  const moyasarPayment = await fetchMoyasarPayment(moyasarPaymentId);
  if (!moyasarPayment || !isMoyasarPaymentPaid(moyasarPayment)) {
    return { error: "لم يتم التحقق من الدفع الإلكتروني." };
  }

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return { error: "الدورة غير متاحة." };
  }

  const expectedHalalas = halalasFromAmount(course.price);
  if (moyasarPayment.amount !== expectedHalalas) {
    return { error: "مبلغ الدفع لا يطابق سعر الدورة." };
  }

  const existing = await db.payment.findFirst({
    where: { externalId: moyasarPaymentId, status: "PENDING" },
  });

  if (existing) {
    await db.payment.update({
      where: { id: existing.id },
      data: { externalId: moyasarPaymentId, method: "MOYASAR" },
    });
  }

  return completeCoursePayment({
    userId,
    courseId,
    method: "MOYASAR",
    externalId: moyasarPaymentId,
  });
}
