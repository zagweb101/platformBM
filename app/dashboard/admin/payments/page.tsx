import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export const revalidate = 0; // Disable static cache to reflect new payments instantly

export default async function AdminPaymentsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all payments ordered by date desc
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
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
        <h2 className="text-2xl font-black text-text-primary mb-1">إدارة مدفوعات الطلاب</h2>
        <p className="text-sm text-text-secondary">
          راجع إيصالات التحويل البنكية المرفوعة من الطلاب وقم بالموافقة عليها لتفعيل حساباتهم في الدورات بشكل آلي.
        </p>
      </div>

      <PaymentsClient initialPayments={payments} />
    </div>
  );
}
