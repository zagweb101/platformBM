import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Users,
  GraduationCap,
  DollarSign,
  Clock,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { toNumber } from "@/lib/money";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch count stats
  const totalStudents = await db.user.count({ where: { role: "STUDENT" } });
  const totalInstructors = await db.instructor.count({ where: { status: "APPROVED" } });
  const totalPendingInstructors = await db.instructor.count({ where: { status: "PENDING" } });
  
  const totalCourses = await db.course.count();
  const newContactMessages = await db.contactMessage.count({ where: { status: "NEW" } });
  
  const approvedPayments = await db.payment.findMany({
    where: { status: "APPROVED" }
  });
  const pendingPayments = await db.payment.findMany({
    where: { status: "PENDING" }
  });

  const totalRevenue = approvedPayments.reduce(
    (acc, curr) => acc + toNumber(curr.amount),
    0
  );
  const pendingRevenue = pendingPayments.reduce(
    (acc, curr) => acc + toNumber(curr.amount),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">لوحة تحكم المدير</h2>
        <p className="text-sm text-text-secondary">نظرة عامة على أداء الأكاديمية والمدخلات المالية والمعلمين.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total revenue */}
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">إجمالي الإيرادات المعتمدة</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="stat-number font-almarai">{totalRevenue.toLocaleString()} ر.س</div>
            <p className="text-xs text-text-muted mt-1">من مبيعات الدورات</p>
          </div>
        </div>

        {/* Pending payments */}
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">مدفوعات معلقة</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-4">
            <div className="stat-number text-amber-500 font-almarai">{pendingPayments.length} عمليات</div>
            <p className="text-xs text-text-muted mt-1">قيمة: {pendingRevenue.toLocaleString()} ر.س</p>
          </div>
        </div>

        {/* Instructors */}
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">المدربون المعتمدون</span>
            <Users className="w-5 h-5 text-brand-violet" />
          </div>
          <div className="mt-4">
            <div className="stat-number text-brand-violet font-almarai">{totalInstructors} مدربين</div>
            {totalPendingInstructors > 0 && (
              <p className="text-xs text-amber-500 font-bold mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {totalPendingInstructors} طلبات معلقة
              </p>
            )}
          </div>
        </div>

        {/* Total students */}
        <div className="stat-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">الطلاب المشتركون</span>
            <GraduationCap className="w-5 h-5 text-brand-indigo" />
          </div>
          <div className="mt-4">
            <div className="stat-number text-brand-indigo font-almarai">{totalStudents} طلاب</div>
            <p className="text-xs text-text-muted mt-1">إجمالي منشئي الحسابات</p>
          </div>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="card-brand p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary mb-2">مراجعة المدفوعات والاشتراكات</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              راجع إيصالات التحويل البنكي المرفوعة من الطلاب وقم بتفعيل اشتراكهم في الدورات على الفور بضغطة زر.
            </p>
          </div>
          <Link
            href="/dashboard/admin/payments"
            className="btn-primary text-xs py-2 text-center w-full block"
          >
            الانتقال لصفحة المدفوعات ({pendingPayments.length})
          </Link>
        </div>

        <div className="card-brand p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary mb-2">طلبات انضمام المدربين</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              تصفح السير الذاتية وطلبات التقديم للأعضاء الراغبين في تدريس التصوير بالأكاديمية وامنحهم صلاحيات الإدارة.
            </p>
          </div>
          <Link
            href="/dashboard/admin/instructors"
            className="btn-primary text-xs py-2 text-center w-full block"
          >
            طلبات المدربين ({totalPendingInstructors})
          </Link>
        </div>

        <div className="card-brand p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary mb-2">إدارة الدورات ومراجعتها</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              قم بتعديل حالة الدورات المنشورة من قبل المدربين أو مراجعتها قبل النشر النهائي للطلاب.
            </p>
          </div>
          <Link
            href="/dashboard/admin/courses"
            className="btn-primary text-xs py-2 text-center w-full block"
          >
            عرض جميع الدورات ({totalCourses})
          </Link>
        </div>

        <div className="card-brand p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary mb-2">رسائل التواصل</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              راجع رسائل الزوار من نموذج التواصل في الموقع وتابع حالة الرد.
            </p>
          </div>
          <Link
            href="/dashboard/admin/contacts"
            className="btn-primary text-xs py-2 text-center w-full block"
          >
            رسائل جديدة ({newContactMessages})
          </Link>
        </div>
      </div>
    </div>
  );
}
