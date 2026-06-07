"use client";

import { useState, useTransition } from "react";
import { approveInstructor, rejectInstructor } from "@/actions/instructor.actions";
import { toast } from "sonner";
import { Loader2, UserCheck, UserX } from "lucide-react";

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
      if (res.error) {
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
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم رفض الطلب.");
        setInstructors((prev) =>
          prev.map((ins) => (ins.id === id ? { ...ins, status: "REJECTED" } : ins))
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
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ins.status === "PENDING"
                          ? "badge-pending"
                          : ins.status === "APPROVED"
                          ? "badge-approved"
                          : "badge-rejected"
                      }`}
                    >
                      {ins.status === "PENDING" && "معلق"}
                      {ins.status === "APPROVED" && "معتمد"}
                      {ins.status === "REJECTED" && "مرفوض"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {ins.status === "PENDING" && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(ins.id)}
                          disabled={isPending && processingId === ins.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold"
                          title="قبول واعتماد كمدرب"
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                          title="رفض الطلب"
                        >
                          {isPending && processingId === ins.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserX className="w-3.5 h-3.5" />
                          )}
                          رفض
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
