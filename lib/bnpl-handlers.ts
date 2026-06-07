import { db } from "@/lib/db";
import {
  completeCoursePayment,
  findPaymentByReference,
} from "@/lib/complete-course-payment";
import {
  authoriseTamaraOrder,
  fetchTamaraOrder,
  isTamaraOrderApproved,
  verifyTamaraWebhookToken,
} from "@/lib/tamara";
import {
  captureTabbyPayment,
  fetchTabbyPayment,
  isTabbyPaymentAuthorized,
  verifyTabbyWebhookAuth,
} from "@/lib/tabby";
import { toNumber } from "@/lib/money";

export async function processTamaraApproval(orderId: string, orderReferenceId: string) {
  const payment = await findPaymentByReference(orderReferenceId);
  if (!payment?.courseId) {
    return { error: "لم يتم العثور على طلب الدفع." };
  }

  const order = await fetchTamaraOrder(orderId);
  if (!order || !isTamaraOrderApproved(order.status)) {
    return { error: "الطلب غير معتمد لدى تمارا." };
  }

  await authoriseTamaraOrder(orderId);

  return completeCoursePayment({
    userId: payment.userId,
    courseId: payment.courseId,
    method: "TAMARA",
    externalId: orderId,
  });
}

export async function processTabbyAuthorization(paymentId: string) {
  const tabbyPayment = await fetchTabbyPayment(paymentId);
  if (!tabbyPayment || !isTabbyPaymentAuthorized(tabbyPayment.status)) {
    return { error: "الدفع غير مُصرّح به لدى تابي." };
  }

  const payment = await findPaymentByReference(tabbyPayment.order.reference_id);
  if (!payment?.courseId) {
    return { error: "لم يتم العثور على طلب الدفع." };
  }

  if (tabbyPayment.status.toLowerCase() === "authorized") {
    await captureTabbyPayment(paymentId, payment.amount);
  }

  return completeCoursePayment({
    userId: payment.userId,
    courseId: payment.courseId,
    method: "TABBY",
    externalId: paymentId,
  });
}

export async function handleTamaraWebhook(body: {
  order_id?: string;
  order_reference_id?: string;
  event_type?: string;
}) {
  const { order_id, order_reference_id, event_type } = body;

  if (event_type !== "order_approved" || !order_id || !order_reference_id) {
    return { ok: true, skipped: true };
  }

  const result = await processTamaraApproval(order_id, order_reference_id);
  if ("error" in result && result.error) {
    console.error("Tamara webhook processing error:", result.error);
    return { ok: false, error: result.error };
  }

  return { ok: true };
}

export async function handleTabbyWebhook(body: {
  id?: string;
  status?: string;
  order?: { reference_id?: string };
}) {
  const paymentId = body.id;
  const status = body.status?.toLowerCase();

  if (!paymentId || status !== "authorized") {
    return { ok: true, skipped: true };
  }

  const result = await processTabbyAuthorization(paymentId);
  if ("error" in result && result.error) {
    console.error("Tabby webhook processing error:", result.error);
    return { ok: false, error: result.error };
  }

  return { ok: true };
}

export async function verifyTamaraRequest(token: string | null) {
  if (!token) return false;
  return verifyTamaraWebhookToken(token);
}

export function verifyTabbyRequest(authHeader: string | null) {
  return verifyTabbyWebhookAuth(authHeader);
}

export async function markBnplPaymentFailed(referenceId: string) {
  const payment = await findPaymentByReference(referenceId);
  if (!payment || payment.status !== "PENDING") return;

  await db.payment.update({
    where: { id: payment.id },
    data: { status: "REJECTED" },
  });
}

export async function verifyTamaraReturnOrder(orderId: string) {
  const order = await fetchTamaraOrder(orderId);
  if (!order?.order_reference_id) return { error: "طلب غير صالح." };

  if (!isTamaraOrderApproved(order.status)) {
    await markBnplPaymentFailed(order.order_reference_id);
    return { error: "لم تكتمل عملية الدفع عبر تمارا." };
  }

  return processTamaraApproval(order.order_id, order.order_reference_id);
}

export async function verifyTabbyReturnPayment(paymentId: string) {
  const tabbyPayment = await fetchTabbyPayment(paymentId);
  if (!tabbyPayment) {
    return { error: "تعذّر التحقق من الدفع." };
  }

  if (!isTabbyPaymentAuthorized(tabbyPayment.status)) {
    if (tabbyPayment.order?.reference_id) {
      await markBnplPaymentFailed(tabbyPayment.order.reference_id);
    }
    return { error: "لم تكتمل عملية الدفع عبر تابي." };
  }

  if (toNumber(tabbyPayment.amount) <= 0) {
    return { error: "مبلغ الدفع غير صالح." };
  }

  return processTabbyAuthorization(paymentId);
}
