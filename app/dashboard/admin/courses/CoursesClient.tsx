"use client";

import { useState, useTransition } from "react";
import { updateCourse } from "@/actions/course.actions";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface CourseItem {
  id: string;
  title: string;
  price: number;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN";
  createdAt: Date;
  instructor: {
    user: {
      name: string;
    };
  };
  _count: {
    sections: number;
    enrollments: number;
  };
}

export default function CoursesClient({ initialCourses }: { initialCourses: CourseItem[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN") => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await updateCourse(id, { status: newStatus });
      setProcessingId(null);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم تحديث حالة الدورة بنجاح.");
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
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
              <th className="p-4">اسم الدورة</th>
              <th className="p-4">المدرب</th>
              <th className="p-4">السعر</th>
              <th className="p-4">الأقسام</th>
              <th className="p-4">المشتركون</th>
              <th className="p-4">الحالة</th>
              <th className="p-4 text-center">تعديل الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle text-sm">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-muted">
                  لا توجد دورات مسجلة بالمنصة حالياً.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-bold text-text-primary">
                    {course.title}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {course.instructor.user.name}
                  </td>
                  <td className="p-4 font-almarai text-brand-indigo font-bold">
                    {course.price} ر.س
                  </td>
                  <td className="p-4 font-almarai text-text-secondary">
                    {course._count.sections} أقسام
                  </td>
                  <td className="p-4 font-almarai text-brand-fuchsia font-bold">
                    {course._count.enrollments} مشتركين
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        course.status === "DRAFT"
                          ? "badge-pending"
                          : course.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-500"
                          : course.status === "PUBLISHED"
                          ? "badge-approved"
                          : "badge-rejected"
                      }`}
                    >
                      {course.status === "DRAFT" && "مسودة"}
                      {course.status === "PENDING" && "بانتظار المراجعة"}
                      {course.status === "PUBLISHED" && "منشورة"}
                      {course.status === "HIDDEN" && "مخفية"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {course.status !== "PUBLISHED" && (
                        <button
                          onClick={() => handleStatusChange(course.id, "PUBLISHED")}
                          disabled={isPending && processingId === course.id}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold"
                        >
                          {isPending && processingId === course.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                          نشر
                        </button>
                      )}
                      
                      {course.status === "PUBLISHED" && (
                        <button
                          onClick={() => handleStatusChange(course.id, "HIDDEN")}
                          disabled={isPending && processingId === course.id}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                        >
                          {isPending && processingId === course.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          إخفاء
                        </button>
                      )}
                    </div>
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
