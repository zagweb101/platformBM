"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  assertCourseCheckoutAllowed,
} from "@/lib/complete-course-payment";
import {
  createTamaraCheckoutSession,
  isTamaraConfigured,
} from "@/lib/tamara";
import {
  createTabbyCheckoutSession,
  getTabbyCheckoutUrl,
  isTabbyConfigured,
} from "@/lib/tabby";
import { z } from "zod";

const BnplCheckoutSchema = z.object({
  courseId: z.string().min(1),
  phone: z
    .string()
    .min(9, "رقم الجوال مطلوب للدفع بالأقساط")
    .max(20),
});

function getBaseUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

async function createPendingBnplPayment(
  userId: string,
  courseId: string,
  amount: Parameters<typeof db.payment.create>[0]["data"]["amount"],
  method: "TAMARA" | "TABBY"
) {
  return db.payment.create({
    data: {
      userId,
      courseId,
      amount,
      method,
      status: "PENDING",
    },
  });
}

export async function startTamaraCheckout(values: z.infer<typeof BnplCheckoutSchema>) {
  if (!isTamaraConfigured()) {
    return { error: "تمارا غير مُفعّلة. يرجى ضبط TAMARA_API_TOKEN." };
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return { error: "يجب تسجيل الدخول أولاً." };
  }

  const parsed = BnplCheckoutSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة." };
  }

  const { courseId, phone } = parsed.data;
  const allowed = await assertCourseCheckoutAllowed(session.user.id, courseId);
  if ("error" in allowed) return allowed;

  const { course } = allowed;

  try {
    const payment = await createPendingBnplPayment(
      session.user.id,
      courseId,
      course.price,
      "TAMARA"
    );

    const checkout = await createTamaraCheckoutSession({
      paymentId: payment.id,
      courseTitle: course.title,
      courseId: course.id,
      amount: course.price,
      user: { name: session.user.name, email: session.user.email },
      phone,
      baseUrl: getBaseUrl(),
    });

    if (!checkout?.checkout_url) {
      await db.payment.delete({ where: { id: payment.id } });
      return { error: "تعذّر إنشاء جلسة تمارا. تحقق من إعدادات API." };
    }

    await db.payment.update({
      where: { id: payment.id },
      data: { externalId: checkout.order_id },
    });

    return { checkoutUrl: checkout.checkout_url };
  } catch (error) {
    console.error("Tamara checkout start error:", error);
    return { error: "حدث خطأ أثناء بدء الدفع عبر تمارا." };
  }
}

export async function startTabbyCheckout(values: z.infer<typeof BnplCheckoutSchema>) {
  if (!isTabbyConfigured()) {
    return { error: "تابي غير مُفعّل. يرجى ضبط TABBY_SECRET_KEY و TABBY_MERCHANT_CODE." };
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return { error: "يجب تسجيل الدخول أولاً." };
  }

  const parsed = BnplCheckoutSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة." };
  }

  const { courseId, phone } = parsed.data;
  const allowed = await assertCourseCheckoutAllowed(session.user.id, courseId);
  if ("error" in allowed) return allowed;

  const { course } = allowed;

  try {
    const payment = await createPendingBnplPayment(
      session.user.id,
      courseId,
      course.price,
      "TABBY"
    );

    const checkout = await createTabbyCheckoutSession({
      paymentId: payment.id,
      courseTitle: course.title,
      courseId: course.id,
      amount: course.price,
      user: { name: session.user.name, email: session.user.email },
      phone,
      baseUrl: getBaseUrl(),
    });

    const checkoutUrl = checkout ? getTabbyCheckoutUrl(checkout) : null;
    const tabbyPaymentId = checkout?.payment?.id;

    if (!checkout || checkout.status === "rejected" || !checkoutUrl) {
      await db.payment.delete({ where: { id: payment.id } });
      return {
        error:
          "تابي غير متاح لهذا الطلب حالياً. جرّب طريقة دفع أخرى أو تحقق من أهليتك.",
      };
    }

    await db.payment.update({
      where: { id: payment.id },
      data: { externalId: tabbyPaymentId || checkout.id },
    });

    return { checkoutUrl };
  } catch (error) {
    console.error("Tabby checkout start error:", error);
    return { error: "حدث خطأ أثناء بدء الدفع عبر تابي." };
  }
}

export async function getBnplProvidersStatus() {
  return {
    tamara: isTamaraConfigured(),
    tabby: isTabbyConfigured(),
  };
}
