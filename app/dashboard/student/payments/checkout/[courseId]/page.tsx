import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CreditCard } from "lucide-react";
import { toNumber } from "@/lib/money";
import {
  getMoyasarPublishableKey,
  halalasFromAmount,
  isMoyasarConfigured,
} from "@/lib/moyasar";
import MoyasarCheckoutClient from "./MoyasarCheckoutClient";

export const revalidate = 0;

export default async function MoyasarCheckoutPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!isMoyasarConfigured()) {
    redirect("/dashboard/student/payments?error=moyasar_not_configured");
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.status !== "PUBLISHED") {
    redirect("/dashboard/student/payments");
  }

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      },
    },
  });

  if (enrollment) {
    redirect("/dashboard/student");
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/payments/moyasar/callback?courseId=${course.id}`;
  const price = toNumber(course.price);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/student/payments"
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-brand-indigo mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          العودة لصفحة المدفوعات
        </Link>
        <h2 className="text-2xl font-black text-text-primary mb-1 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand-indigo" />
          الدفع الإلكتروني
        </h2>
        <p className="text-sm text-text-secondary">{course.title}</p>
        <p className="text-lg font-bold text-brand-indigo font-almarai mt-2">
          {price} ر.س
        </p>
      </div>

      <div className="card-brand bg-card p-6">
        <MoyasarCheckoutClient
          courseTitle={course.title}
          amountHalalas={halalasFromAmount(course.price)}
          publishableKey={getMoyasarPublishableKey()}
          callbackUrl={callbackUrl}
        />
      </div>

      <p className="text-xs text-text-muted text-center leading-relaxed">
        يتم معالجة الدفع عبر Moyasar بشكل آمن. بعد إتمام العملية سيتم تفعيل الدورة
        تلقائياً.
      </p>
    </div>
  );
}
