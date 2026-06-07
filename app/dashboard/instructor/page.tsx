import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Wallet,
  BookOpen,
  Users,
  Clock,
  XCircle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { toNumber } from "@/lib/money";
import { serializeWalletTxAmount } from "@/lib/serialize-client";

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  // Find user's instructor profile
  const instructor = await db.instructor.findUnique({
    where: { userId: session.user.id },
    include: {
      walletTx: {
        orderBy: { createdAt: "desc" },
      },
      courses: {
        include: {
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      },
    },
  });

  // Handle various application statuses
  if (!instructor) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="card-brand p-8 text-center bg-card">
          <Wallet className="w-12 h-12 text-brand-indigo mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">انضم كمعلم وشريك نجاح</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            هل أنت مصور محترف أو صانع أفلام وتملك شغف التدريس؟ تقدم بطلب الانضمام كمدرب في &quot;بيت المصور&quot; وابدأ في نشر دوراتك وجني الأرباح بمعدل مشاركة مرتفع.
          </p>
          <Link
            href="/dashboard/instructor/onboarding"
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            تقديم طلب انضمام كمدرب
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (instructor.status === "PENDING") {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="card-brand p-8 text-center bg-card">
          <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-spin-slow" />
          <h2 className="text-xl font-bold text-text-primary mb-2">طلبك قيد المراجعة حاليًا</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            لقد تم استلام سيرتك الذاتية وطلبك للانضمام كمعلم. يقوم فريق المراجعة في بيت المصور حالياً بمراجعة طلبك وتفعيل حسابك قريباً.
          </p>
          <div className="inline-block px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold">
            حالة الطلب: قيد المراجعة والتدقيق
          </div>
        </div>
      </div>
    );
  }

  if (instructor.status === "REJECTED") {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="card-brand p-8 text-center bg-card">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">تم رفض طلبك</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            عذراً، لم يتطابق طلبك مع معايير التدريس الحالية للأكاديمية. يمكنك تحديث سيرتك الذاتية وتفاصيل خبراتك وتقديم طلب جديد.
          </p>
          <Link
            href="/dashboard/instructor/onboarding"
            className="btn-primary inline-flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600"
          >
            تعديل وتقديم طلب جديد
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // If APPROVED, render full dashboard
  const coursesCount = instructor.courses.length;
  const totalStudents = instructor.courses.reduce((acc, curr) => acc + curr._count.enrollments, 0);
  const walletBalance = toNumber(instructor.walletBalance);
  const revenueShare = toNumber(instructor.revenueShare);
  const walletTransactions = instructor.walletTx.map(serializeWalletTxAmount);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">لوحة المدرب</h2>
        <p className="text-sm text-text-secondary">تابع أرباحك، معاملاتك المالية، ودوراتك التدريبية.</p>
      </div>

      {/* Grid of Instructor stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <div className="stat-card flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-brand-fuchsia/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">رصيد محفظتك</span>
            <Wallet className="w-5 h-5 text-brand-indigo" />
          </div>
          <div className="mt-4">
            <div className="stat-number font-almarai">{walletBalance.toFixed(2)} ر.س</div>
            <p className="text-xs text-text-muted mt-1">
              نسبة أرباحك الحالية: <strong className="text-brand-fuchsia font-almarai">%{revenueShare}</strong>
            </p>
          </div>
        </div>

        {/* Total courses */}
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">دوراتي التعليمية</span>
            <BookOpen className="w-5 h-5 text-brand-violet" />
          </div>
          <div className="mt-4">
            <div className="stat-number text-brand-violet font-almarai">{coursesCount} دورات</div>
            <Link
              href="/dashboard/instructor/courses"
              className="text-xs text-brand-indigo hover:underline mt-1 block"
            >
              إدارة وبناء الدورات
            </Link>
          </div>
        </div>

        {/* Total students */}
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">الطلاب المسجلون بدوراتك</span>
            <Users className="w-5 h-5 text-brand-fuchsia" />
          </div>
          <div className="mt-4">
            <div className="stat-number text-brand-fuchsia font-almarai">{totalStudents} طلاب</div>
            <p className="text-xs text-text-muted mt-1">إجمالي الاشتراكات النشطة</p>
          </div>
        </div>
      </div>

      {/* Wallet Transactions Logs */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary">سجل المعاملات المالية والمبيعات</h3>
        <div className="card-brand bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
                  <th className="p-4">تفاصيل المعاملة</th>
                  <th className="p-4">النوع</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle text-sm">
                {walletTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-muted">
                      لا توجد أرباح أو معاملات مسجلة في محفظتك بعد.
                    </td>
                  </tr>
                ) : (
                  walletTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-semibold text-text-primary">
                        {tx.description || "معاملة مالية"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                            tx.type === "CREDIT"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {tx.type === "CREDIT" ? "شحن / إيداع" : "سحب / خصم"}
                        </span>
                      </td>
                      <td className={`p-4 font-almarai font-bold ${
                        tx.type === "CREDIT" ? "text-emerald-500" : "text-red-500"
                      }`}>
                        {tx.type === "CREDIT" ? "+" : "-"}{tx.amount} ر.س
                      </td>
                      <td className="p-4 text-xs text-text-secondary font-almarai">
                        {new Date(tx.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric"
                        })}
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
