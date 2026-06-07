"use client";

import { useState, useTransition } from "react";
import { uploadReceipt } from "@/actions/payment.actions";
import { toast } from "sonner";
import { FileUp, Loader2, Send, FileText } from "lucide-react";

interface CourseOption {
  id: string;
  title: string;
  price: number;
}

interface PaymentHistoryItem {
  id: string;
  amount: number;
  receiptUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  course: {
    title: string;
  } | null;
}

export default function StudentPaymentsClient({
  courses,
  initialHistory,
}: {
  courses: CourseOption[];
  initialHistory: PaymentHistoryItem[];
}) {
  const [history, setHistory] = useState(initialHistory);
  const [isPending, startTransition] = useTransition();

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [receiptUrl, setReceiptUrl] = useState("");

  const handleCourseChange = (id: string) => {
    setSelectedCourseId(id);
    const course = courses.find((c) => c.id === id);
    if (course) {
      setAmount(course.price);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || amount <= 0 || !receiptUrl) {
      toast.error("يرجى ملء كافة حقول التفعيل وإرفاق الإيصال.");
      return;
    }

    startTransition(async () => {
      const res = await uploadReceipt(selectedCourseId, amount, receiptUrl);
      if (res.error) {
        toast.error(res.error);
      } else if (res.payment) {
        toast.success(res.success || "تم إرسال إيصال الدفع بنجاح.");
        // Add to history
        const course = courses.find((c) => c.id === selectedCourseId);
        setHistory((prev) => [
          {
            id: res.payment!.id,
            amount: res.payment!.amount,
            receiptUrl: res.payment!.receiptUrl,
            status: "PENDING",
            createdAt: new Date(),
            course: course ? { title: course.title } : null,
          },
          ...prev,
        ]);
        // Reset form
        setSelectedCourseId("");
        setAmount(0);
        setReceiptUrl("");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Receipt Upload Form */}
      <div className="lg:col-span-1">
        <div className="card-brand bg-card p-6 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-indigo/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-base font-bold text-text-primary border-b border-subtle pb-2 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-brand-indigo" />
            تفعيل الاشتراك بدورة جديدة
          </h3>

          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">اختر الدورة التدريبية</label>
              <select
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">-- اختر الدورة المطلوبة --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.price} ر.س)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">المبلغ المدفوع (ر.س)</label>
              <input
                type="number"
                required
                min={0}
                className="w-full px-3.5 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">رابط إيصال التحويل البنكي</label>
              <input
                type="url"
                required
                placeholder="أدخل رابط صورة أو ملف الإيصال المرفوع"
                className="w-full px-3.5 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                value={receiptUrl}
                onChange={(e) => setReceiptUrl(e.target.value)}
              />
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                * يرجى رفع الإيصال على أي موقع لرفع الملفات وكتابة الرابط المباشر هنا لمراجعته وتفعيله.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full flex items-center justify-center gap-1.5 text-xs py-2.5 mt-4"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  إرسال طلب التفعيل
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Payment History List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-base font-bold text-text-primary">سجل الاشتراكات وعمليات التفعيل</h3>
        
        <div className="card-brand bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
                  <th className="p-4">اسم الدورة</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">إيصال الدفع</th>
                  <th className="p-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle text-sm">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">
                      لا توجد عمليات تفعيل مسجلة لحسابك.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-semibold text-text-primary">
                        {h.course?.title || "غير معروف"}
                      </td>
                      <td className="p-4 font-almarai text-brand-indigo font-bold">
                        {h.amount} ر.س
                      </td>
                      <td className="p-4 text-xs text-text-secondary font-almarai">
                        {new Date(h.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <a
                          href={h.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-fuchsia hover:underline font-bold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          عرض الملف
                        </a>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            h.status === "PENDING"
                              ? "badge-pending"
                              : h.status === "APPROVED"
                              ? "badge-approved"
                              : "badge-rejected"
                          }`}
                        >
                          {h.status === "PENDING" && "معلق"}
                          {h.status === "APPROVED" && "تم التفعيل"}
                          {h.status === "REJECTED" && "مرفوض"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
