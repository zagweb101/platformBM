import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StudentPaymentsClient from "./StudentPaymentsClient";
import {
  serializeCoursePrice,
  serializePaymentAmount,
} from "@/lib/serialize-client";
import { isMoyasarConfigured } from "@/lib/moyasar";
import { isTamaraConfigured } from "@/lib/tamara";
import { isTabbyConfigured } from "@/lib/tabby";
import { Suspense } from "react";

export const revalidate = 0;

export default async function StudentPaymentsPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Fetch all published courses for the student to purchase
  const courses = await db.course.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      price: true,
    },
  });

  // Fetch student's payment history
  const payments = await db.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">الاشتراكات وتفعيل الحساب</h2>
        <p className="text-sm text-text-secondary">
          سجل في دوراتك التعليمية المفضلة عن طريق تحويل قيمة الدورة وإرفاق إيصال التحويل لتفعيل حسابك تلقائياً.
        </p>
      </div>

      <Suspense fallback={<div className="text-sm text-text-muted">جاري التحميل...</div>}>
        <StudentPaymentsClient
          courses={courses.map(serializeCoursePrice)}
          initialHistory={payments.map((p) => ({
            ...serializePaymentAmount(p),
            receiptUrl: p.receiptUrl,
            method: p.method,
          }))}
          moyasarEnabled={isMoyasarConfigured()}
          tamaraEnabled={isTamaraConfigured()}
          tabbyEnabled={isTabbyConfigured()}
        />
      </Suspense>
    </div>
  );
}
