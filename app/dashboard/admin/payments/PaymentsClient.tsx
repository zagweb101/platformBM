"use client";

import { useState, useTransition } from "react";
import { approvePayment, rejectPayment } from "@/actions/payment.actions";
import { toast } from "sonner";
import { Check, X, Loader2, Eye } from "lucide-react";

import {
  getPaymentMethodLabel,
  isManualReviewMethod,
  type PaymentMethodType,
} from "@/lib/payment-labels";
import {
  AdminDesktopTable,
  AdminMobileCard,
  AdminMobileList,
  AdminTableScroll,
} from "@/components/dashboard/admin/AdminTableMobile";
import {
  AdminDesktopActions,
  AdminMobileActions,
  type AdminActionItem,
} from "@/components/dashboard/admin/AdminActionsMenu";

interface PaymentItem {
  id: string;
  amount: number;
  receiptUrl: string | null;
  method: PaymentMethodType;
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
      if ("error" in res && res.error) {
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
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم رفض الدفع.");
        setPayments((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
        );
      }
    });
  };

  const statusBadge = (status: PaymentItem["status"]) => (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
        status === "PENDING"
          ? "badge-pending"
          : status === "APPROVED"
            ? "badge-approved"
            : "badge-rejected"
      }`}
    >
      {status === "PENDING" && "معلق"}
      {status === "APPROVED" && "مقبول"}
      {status === "REJECTED" && "مرفوض"}
    </span>
  );

  const getPaymentActions = (payment: PaymentItem): AdminActionItem[] => {
    if (payment.status !== "PENDING" || !isManualReviewMethod(payment.method)) {
      return payment.receiptUrl
        ? [
            {
              id: "view",
              label: "عرض الإيصال",
              onClick: () => window.open(payment.receiptUrl!, "_blank", "noopener,noreferrer"),
            },
          ]
        : [];
    }

    const loading = isPending && processingId === payment.id;
    return [
      {
        id: "approve",
        label: "قبول وتفعيل",
        onClick: () => handleApprove(payment.id),
        disabled: loading,
        loading,
      },
      {
        id: "reject",
        label: "رفض الطلب",
        onClick: () => handleReject(payment.id),
        disabled: loading,
        loading,
        variant: "danger",
      },
    ];
  };

  return (
    <div className="card-brand bg-card overflow-hidden admin-form-shell">
      <AdminDesktopTable>
        <AdminTableScroll>
          <table className="w-full min-w-[920px] text-right border-collapse">
          <thead>
            <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
              <th className="p-4">اسم الطالب</th>
              <th className="p-4">الدورة التدريبية</th>
              <th className="p-4">المبلغ المدفوع</th>
              <th className="p-4">الطريقة</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">إيصال الدفع</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle text-sm">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-text-muted">
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
                  <td className="p-4 text-xs text-text-secondary">
                    {getPaymentMethodLabel(payment.method)}
                  </td>
                  <td className="p-4 text-xs text-text-secondary font-almarai">
                    {new Date(payment.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    {payment.receiptUrl ? (
                      <a
                        href={payment.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-fuchsia hover:underline font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        عرض الإيصال
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted">دفع إلكتروني</span>
                    )}
                  </td>
                  <td className="p-4">{statusBadge(payment.status)}</td>
                  <td className="p-4 text-center">
                    <AdminDesktopActions>
                      {payment.status === "PENDING" && isManualReviewMethod(payment.method) && (
                        <>
                          <button
                            onClick={() => handleApprove(payment.id)}
                            disabled={isPending && processingId === payment.id}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
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
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            title="رفض الطلب"
                          >
                            {isPending && processingId === payment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                    </AdminDesktopActions>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </AdminTableScroll>
      </AdminDesktopTable>

      <AdminMobileList>
        {payments.length === 0 ? (
          <p className="p-6 text-center text-sm text-text-muted font-body">
            لا توجد طلبات دفع مرفوعة حالياً.
          </p>
        ) : (
          payments.map((payment) => (
            <AdminMobileCard
              key={payment.id}
              title={payment.user.name}
              subtitle={payment.user.email}
              badge={statusBadge(payment.status)}
              fields={[
                { label: "الدورة", value: payment.course?.title || "غير معروف" },
                { label: "المبلغ", value: `${payment.amount} ر.س` },
                { label: "الطريقة", value: getPaymentMethodLabel(payment.method) },
                {
                  label: "التاريخ",
                  value: new Date(payment.createdAt).toLocaleDateString("ar-SA"),
                },
              ]}
              actions={
                <>
                  {payment.receiptUrl ? (
                    <a
                      href={payment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-violet-600"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      عرض الإيصال
                    </a>
                  ) : null}
                  <AdminMobileActions actions={getPaymentActions(payment)} />
                </>
              }
            />
          ))
        )}
      </AdminMobileList>
    </div>
  );
}
