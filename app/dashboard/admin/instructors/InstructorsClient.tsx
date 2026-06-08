"use client";

import { useState, useTransition } from "react";
import { approveInstructor, rejectInstructor } from "@/actions/instructor.actions";
import { toast } from "sonner";
import { Loader2, UserCheck, UserX } from "lucide-react";
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

interface InstructorItem {
  id: string;
  bio: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  revenueShare: number;
  walletBalance: number;
  user: {
    name: string;
    email: string;
  };
}

export default function InstructorsClient({ initialInstructors }: { initialInstructors: InstructorItem[] }) {
  const [instructors, setInstructors] = useState(initialInstructors);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await approveInstructor(id);
      setProcessingId(null);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم قبول المدرب بنجاح!");
        setInstructors((prev) =>
          prev.map((ins) => (ins.id === id ? { ...ins, status: "APPROVED" } : ins))
        );
      }
    });
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await rejectInstructor(id);
      setProcessingId(null);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم رفض الطلب.");
        setInstructors((prev) =>
          prev.map((ins) => (ins.id === id ? { ...ins, status: "REJECTED" } : ins))
        );
      }
    });
  };

  const statusBadge = (status: InstructorItem["status"]) => (
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
      {status === "APPROVED" && "معتمد"}
      {status === "REJECTED" && "مرفوض"}
    </span>
  );

  const getInstructorActions = (ins: InstructorItem): AdminActionItem[] => {
    if (ins.status !== "PENDING") return [];
    const loading = isPending && processingId === ins.id;
    return [
      {
        id: "approve",
        label: "قبول",
        onClick: () => handleApprove(ins.id),
        disabled: loading,
        loading,
      },
      {
        id: "reject",
        label: "رفض",
        onClick: () => handleReject(ins.id),
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
          <table className="w-full min-w-[860px] text-right border-collapse">
            <thead>
              <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
                <th className="p-4">اسم المتقدم</th>
                <th className="p-4">السيرة الذاتية</th>
                <th className="p-4">نسبة الأرباح الأساسية</th>
                <th className="p-4">رصيد المحفظة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle text-sm">
              {instructors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">
                    لا توجد طلبات انضمام للمدربين حالياً.
                  </td>
                </tr>
              ) : (
                instructors.map((ins) => (
                  <tr key={ins.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-text-primary">{ins.user.name}</div>
                      <div className="text-xs text-text-muted">{ins.user.email}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-2" title={ins.bio || ""}>
                        {ins.bio || "لا توجد سيرة ذاتية مرفقة"}
                      </p>
                    </td>
                    <td className="p-4 font-almarai text-brand-violet font-semibold">
                      %{ins.revenueShare}
                    </td>
                    <td className="p-4 font-almarai text-text-primary">
                      {ins.walletBalance} ر.س
                    </td>
                    <td className="p-4">{statusBadge(ins.status)}</td>
                    <td className="p-4 text-center">
                      <AdminDesktopActions>
                        {ins.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(ins.id)}
                              disabled={isPending && processingId === ins.id}
                              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold"
                            >
                              {isPending && processingId === ins.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                              قبول
                            </button>
                            <button
                              onClick={() => handleReject(ins.id)}
                              disabled={isPending && processingId === ins.id}
                              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-red-500/10 px-3 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                            >
                              {isPending && processingId === ins.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                              رفض
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
        {instructors.length === 0 ? (
          <p className="p-6 text-center text-sm text-text-muted font-body">
            لا توجد طلبات انضمام للمدربين حالياً.
          </p>
        ) : (
          instructors.map((ins) => (
            <AdminMobileCard
              key={ins.id}
              title={ins.user.name}
              subtitle={ins.user.email}
              badge={statusBadge(ins.status)}
              fields={[
                { label: "نسبة الأرباح", value: `%${ins.revenueShare}` },
                { label: "رصيد المحفظة", value: `${ins.walletBalance} ر.س` },
                {
                  label: "السيرة",
                  value: ins.bio ? ins.bio.slice(0, 80) : "—",
                },
              ]}
              actions={<AdminMobileActions actions={getInstructorActions(ins)} />}
            />
          ))
        )}
      </AdminMobileList>
    </div>
  );
}
