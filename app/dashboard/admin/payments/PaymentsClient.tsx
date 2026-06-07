"use client";

import { useState, useTransition } from "react";
import { approvePayment, rejectPayment } from "@/actions/payment.actions";
import { toast } from "sonner";
import { Check, X, Loader2, Eye } from "lucide-react";

interface PaymentItem {
  id: string;
  amount: number;
  receiptUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  course: {
    title: string;
  } | null;
}

export default function PaymentsClient({ initialPayments }: { initialPayments: PaymentItem[] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await approvePayment(id);
      setProcessingId(null);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تمت الموافقة بنجاح!");
        // Update local state
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p))
        );
      }
    });
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await rejectPayment(id);
      setProcessingId(null);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم رفض الدفع.");
        // Update local state
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
        );
      }
    });
  };

  return (
    <div className="card-brand bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
              <th className="p-4">اسم الطالب</th>
              <th className="p-4">الدورة التدريبية</th>
              <th className="p-4">المبلغ المدفوع</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">إيصال الدفع</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle text-sm">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-muted">
                  لا توجد طلبات دفع مرفوعة حالياً.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-text-primary">{payment.user.name}</div>
                    <div className="text-xs text-text-muted">{payment.user.email}</div>
                  </td>
                  <td className="p-4 font-semibold text-text-primary">
                    {payment.course?.title || "غير معروف"}
                  </td>
                  <td className="p-4 font-almarai text-brand-indigo font-bold">
                    {payment.amount} ر.س
                  </td>
                  <td className="p-4 text-xs text-text-secondary font-almarai">
                    {new Date(payment.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <a
                      href={payment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-fuchsia hover:underline font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      عرض الإيصال
                    </a>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "PENDING"
                          ? "badge-pending"
                          : payment.status === "APPROVED"
                          ? "badge-approved"
                          : "badge-rejected"
                      }`}
                    >
                      {payment.status === "PENDING" && "معلق"}
                      {payment.status === "APPROVED" && "مقبول"}
                      {payment.status === "REJECTED" && "مرفوض"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {payment.status === "PENDING" && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(payment.id)}
                          disabled={isPending && processingId === payment.id}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="قبول وتفعيل الدورة"
                        >
                          {isPending && processingId === payment.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(payment.id)}
                          disabled={isPending && processingId === payment.id}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          title="رفض الطلب"
                        >
                          {isPending && processingId === payment.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
