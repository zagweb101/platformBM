"use client";

import { useState, useTransition, useEffect } from "react";
import { uploadReceipt } from "@/actions/payment.actions";
import { startTamaraCheckout, startTabbyCheckout } from "@/actions/bnpl.actions";
import { toast } from "sonner";
import {
  FileUp,
  Loader2,
  Send,
  FileText,
  CreditCard,
  CheckCircle2,
  Smartphone,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getPaymentMethodLabel,
  type PaymentMethodType,
} from "@/lib/payment-labels";

interface CourseOption {
  id: string;
  title: string;
  price: number;
}

interface PaymentHistoryItem {
  id: string;
  amount: number;
  receiptUrl: string | null;
  method: PaymentMethodType;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  course: {
    title: string;
  } | null;
}

export default function StudentPaymentsClient({
  courses,
  initialHistory,
  moyasarEnabled,
  tamaraEnabled,
  tabbyEnabled,
}: {
  courses: CourseOption[];
  initialHistory: PaymentHistoryItem[];
  moyasarEnabled: boolean;
  tamaraEnabled: boolean;
  tabbyEnabled: boolean;
}) {
  const searchParams = useSearchParams();
  const [history, setHistory] = useState(initialHistory);
  const [isPending, startTransition] = useTransition();
  const [isBnplPending, startBnplTransition] = useTransition();

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [phone, setPhone] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const bnplAvailable =
    selectedCourse &&
    selectedCourse.price >= 100 &&
    (tamaraEnabled || tabbyEnabled);

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error === "moyasar_not_configured") {
      toast.error("الدفع الإلكتروني غير مفعّل حالياً.");
    } else if (error) {
      toast.error(decodeURIComponent(error));
    }

    if (success === "tamara_pending" || success === "tabby_pending") {
      toast.info("جاري تأكيد الدفع. ستُفعَّل الدورة خلال لحظات.");
    }
  }, [searchParams]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !receiptUrl) {
      toast.error("يرجى اختيار الدورة ورفع إيصال التحويل.");
      return;
    }

    startTransition(async () => {
      const res = await uploadReceipt(selectedCourseId, receiptUrl);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else if ("payment" in res && res.payment) {
        toast.success(res.success || "تم إرسال إيصال الدفع بنجاح.");
        const course = courses.find((c) => c.id === selectedCourseId);
        setHistory((prev) => [
          {
            id: res.payment!.id,
            amount: res.payment!.amount,
            receiptUrl: res.payment!.receiptUrl,
            method: "BANK_TRANSFER",
            status: "PENDING",
            createdAt: new Date(),
            course: course ? { title: course.title } : null,
          },
          ...prev,
        ]);
        setReceiptUrl("");
      }
    });
  };

  const handleBnplCheckout = (provider: "tamara" | "tabby") => {
    if (!selectedCourseId) {
      toast.error("يرجى اختيار الدورة أولاً.");
      return;
    }
    if (!phone || phone.replace(/\D/g, "").length < 9) {
      toast.error("يرجى إدخال رقم جوال سعودي صالح.");
      return;
    }

    startBnplTransition(async () => {
      const payload = { courseId: selectedCourseId, phone };
      const res =
        provider === "tamara"
          ? await startTamaraCheckout(payload)
          : await startTabbyCheckout(payload);

      if ("error" in res && res.error) {
        toast.error(res.error);
      } else if ("checkoutUrl" in res && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <div className="card-brand bg-card p-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary">اختر الدورة</h3>
          <select
            className="w-full px-3.5 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- اختر الدورة --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.price} ر.س)
              </option>
            ))}
          </select>
          {selectedCourse && (
            <p className="text-sm font-bold text-brand-indigo font-almarai">
              المبلغ: {selectedCourse.price} ر.س
            </p>
          )}
        </div>

        {selectedCourseId && moyasarEnabled && (
          <div className="card-brand bg-card p-6 space-y-3 border border-brand-indigo/20">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-indigo" />
              {getPaymentMethodLabel("MOYASAR")}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              بطاقة، Apple Pay، STC Pay — تفعيل فوري.
            </p>
            <Link
              href={`/dashboard/student/payments/checkout/${selectedCourseId}`}
              className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2.5"
            >
              ادفع {selectedCourse?.price} ر.س
            </Link>
          </div>
        )}

        {bnplAvailable && (
          <div className="card-brand bg-card p-6 space-y-4 border border-brand-fuchsia/20">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-brand-fuchsia" />
              الدفع بالأقساط
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              قسّط على 3–4 دفعات بدون فوائد عبر تمارا أو تابي.
            </p>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                رقم الجوال (مطلوب)
              </label>
              <input
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-fuchsia focus:ring-1 focus:ring-brand-fuchsia font-almarai"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {tamaraEnabled && (
                <button
                  type="button"
                  disabled={isBnplPending}
                  onClick={() => handleBnplCheckout("tamara")}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#000] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBnplPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>ادفع عبر تمارا</>
                  )}
                </button>
              )}
              {tabbyEnabled && (
                <button
                  type="button"
                  disabled={isBnplPending}
                  onClick={() => handleBnplCheckout("tabby")}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#3bffc1] text-[#1a1a2e] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBnplPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>ادفع عبر تابي</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="card-brand bg-card p-6 space-y-4 relative overflow-hidden">
          <h3 className="text-base font-bold text-text-primary border-b border-subtle pb-2 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-brand-indigo" />
            التحويل البنكي
          </h3>

          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                إيصال التحويل
              </label>
              {receiptUrl ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate flex-1">تم رفع الإيصال</span>
                  <button
                    type="button"
                    onClick={() => setReceiptUrl("")}
                    className="text-red-500 hover:underline shrink-0"
                  >
                    إزالة
                  </button>
                </div>
              ) : (
                <UploadButton
                  endpoint="receiptUploader"
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={(res) => {
                    setIsUploading(false);
                    const url = res?.[0]?.ufsUrl || res?.[0]?.url;
                    if (url) {
                      setReceiptUrl(url);
                      toast.success("تم رفع الإيصال.");
                    }
                  }}
                  onUploadError={(error) => {
                    setIsUploading(false);
                    toast.error(error.message || "فشل رفع الملف.");
                  }}
                  content={{
                    button: isUploading ? "جاري الرفع..." : "رفع صورة أو PDF",
                    allowedContent: "PNG, JPG, PDF",
                  }}
                  appearance={{
                    button:
                      "ut-ready:bg-brand-indigo bg-brand-violet text-white text-xs font-semibold px-4 py-2.5 rounded-xl w-full",
                    allowedContent: "text-[10px] text-text-muted mt-1",
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || isUploading || !selectedCourseId || !receiptUrl}
              className="btn-primary w-full flex items-center justify-center gap-1.5 text-xs py-2.5 disabled:opacity-50"
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

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-base font-bold text-text-primary">سجل الاشتراكات</h3>
        <div className="card-brand bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
                  <th className="p-4">الدورة</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">الطريقة</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4">الإيصال</th>
                  <th className="p-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle text-sm">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-muted">
                      لا توجد عمليات مسجلة.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-semibold text-text-primary">
                        {h.course?.title || "—"}
                      </td>
                      <td className="p-4 font-almarai text-brand-indigo font-bold">
                        {h.amount} ر.س
                      </td>
                      <td className="p-4 text-xs text-text-secondary">
                        {getPaymentMethodLabel(h.method)}
                      </td>
                      <td className="p-4 text-xs text-text-secondary font-almarai">
                        {new Date(h.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="p-4">
                        {h.receiptUrl ? (
                          <a
                            href={h.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-brand-fuchsia hover:underline font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            عرض
                          </a>
                        ) : (
                          <span className="text-xs text-text-muted">—</span>
                        )}
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
                          {h.status === "APPROVED" && "مفعّل"}
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
