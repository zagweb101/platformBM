"use client";

import { useState, useTransition } from "react";
import { updateCourse, adminCreateCourse, deleteCourse } from "@/actions/course.actions";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Trash,
  Edit,
  Camera,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
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
  user: {
    name: string;
  };
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN";
  createdAt: Date;
  instructor: {
    id: string;
    user: {
      name: string;
    };
  };
  _count: {
    sections: number;
    enrollments: number;
  };
}

export default function CoursesClient({
  initialCourses,
  instructors,
}: {
  initialCourses: CourseItem[];
  instructors: InstructorItem[];
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create course form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  const handleStatusChange = (
    id: string,
    newStatus: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN"
  ) => {
    setProcessingId(id);
    startTransition(async () => {
      const res = await updateCourse(id, { status: newStatus });
      setProcessingId(null);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم تحديث حالة الدورة بنجاح.");
        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || price < 0) {
      toast.error("يرجى ملء كافة الحقول الأساسية بشكل صحيح.");
      return;
    }

    startTransition(async () => {
      const res = await adminCreateCourse({
        title,
        description,
        price,
        thumbnail: thumbnail || undefined,
        instructorId: selectedInstructorId || undefined,
      });

      if ("error" in res && res.error) {
        toast.error(res.error);
      } else if ("courseId" in res && res.courseId) {
        toast.success(res.success || "تم إنشاء الدورة بنجاح!");
        window.location.href = `/dashboard/admin/courses/${res.courseId}`;
      }
    });
  };

  const handleDelete = (courseId: string, courseTitle: string) => {
    if (
      !confirm(
        `هل أنت متأكد من حذف دورة "${courseTitle}" نهائيًا؟ سيتم حذف جميع الأقسام والدروس والتسجيلات المرتبطة.`
      )
    )
      return;

    setProcessingId(courseId);
    startTransition(async () => {
      const res = await deleteCourse(courseId);
      setProcessingId(null);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم حذف الدورة.");
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      }
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setThumbnail("");
    setSelectedInstructorId("");
  };

  const courseStatusBadge = (status: CourseItem["status"]) => (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
        status === "DRAFT"
          ? "badge-pending"
          : status === "PENDING"
            ? "bg-amber-500/10 text-amber-500"
            : status === "PUBLISHED"
              ? "badge-approved"
              : "badge-rejected"
      }`}
    >
      {status === "DRAFT" && "مسودة"}
      {status === "PENDING" && "بانتظار المراجعة"}
      {status === "PUBLISHED" && "منشورة"}
      {status === "HIDDEN" && "مخفية"}
    </span>
  );

  const getCourseActions = (course: CourseItem): AdminActionItem[] => {
    const loading = isPending && processingId === course.id;
    const actions: AdminActionItem[] = [
      {
        id: "edit",
        label: "تعديل",
        onClick: () => {
          window.location.href = `/dashboard/admin/courses/${course.id}`;
        },
      },
    ];

    if (course.status !== "PUBLISHED") {
      actions.push({
        id: "publish",
        label: "نشر",
        onClick: () => handleStatusChange(course.id, "PUBLISHED"),
        disabled: loading,
        loading,
      });
    }

    if (course.status === "PUBLISHED") {
      actions.push({
        id: "hide",
        label: "إخفاء",
        onClick: () => handleStatusChange(course.id, "HIDDEN"),
        disabled: loading,
        loading,
      });
    }

    actions.push({
      id: "delete",
      label: "حذف",
      onClick: () => handleDelete(course.id, course.title),
      disabled: loading,
      loading,
      variant: "danger",
    });

    return actions;
  };

  return (
    <div className="space-y-6 admin-form-shell">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-text-muted">
            إجمالي الدورات: <strong className="font-almarai">{courses.length}</strong>
          </span>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          إنشاء دورة جديدة
        </button>
      </div>

      {/* Create Course Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-brand bg-card max-w-lg w-full p-4 sm:p-6 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-indigo" />
              إضافة دورة تدريبية جديدة
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="admin-form-label text-text-secondary">
                  عنوان الدورة
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أساسيات التصوير الفوتوغرافي"
                  className="admin-form-input w-full px-4 py-3 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-form-label text-text-secondary">
                  وصف الدورة
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب نبذة شيقة وجذابة عن محتوى الدورة وأهدافها..."
                  className="admin-form-input w-full min-h-[120px] px-4 py-3 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label text-text-secondary">
                    سعر الدورة (ريال سعودي)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="299"
                    className="admin-form-input w-full px-4 py-3 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="admin-form-label text-text-secondary">
                    تعيين لمدرب (اختياري)
                  </label>
                  <select
                    className="admin-form-input w-full px-4 py-3 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                    value={selectedInstructorId}
                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                  >
                    <option value="">مدير المنصة (أنا)</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-form-label text-text-secondary">
                  رابط غلاف الدورة (رابط صورة)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="admin-form-input w-full px-4 py-3 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-subtle text-xs font-bold text-text-secondary hover:bg-secondary transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary flex items-center gap-1.5 text-xs px-6 py-2.5"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "إنشاء ونشر الدورة"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="card-brand bg-card overflow-hidden">
        <AdminDesktopTable>
          <AdminTableScroll>
            <table className="w-full min-w-[980px] text-right border-collapse">
            <thead>
              <tr className="border-b border-subtle bg-secondary/50 text-xs font-semibold text-text-secondary">
                <th className="p-4">اسم الدورة</th>
                <th className="p-4">المدرب</th>
                <th className="p-4">السعر</th>
                <th className="p-4">الأقسام</th>
                <th className="p-4">المشتركون</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle text-sm">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Camera className="w-12 h-12 text-text-muted" />
                      <p className="text-text-secondary font-semibold">
                        لا توجد دورات مسجلة بالمنصة حالياً.
                      </p>
                      <button
                        onClick={() => {
                          resetForm();
                          setIsCreateOpen(true);
                        }}
                        className="btn-primary text-xs mt-2"
                      >
                        ابدأ بإنشاء أول دورة
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="p-4 font-bold text-text-primary max-w-[200px]">
                      <div className="truncate" title={course.title}>
                        {course.title}
                      </div>
                      <div className="text-[10px] text-text-muted mt-1 line-clamp-1">
                        {course.description}
                      </div>
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
                    <td className="p-4">{courseStatusBadge(course.status)}</td>
                    <td className="p-4 text-center">
                      <AdminDesktopActions>
                        <Link
                          href={`/dashboard/admin/courses/${course.id}`}
                          className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-brand-indigo/10 px-2.5 text-brand-indigo hover:bg-brand-indigo hover:text-white transition-all text-xs font-bold"
                          title="تعديل المحتوى"
                        >
                          <Edit className="w-3 h-3" />
                          تعديل
                        </Link>

                        {course.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handleStatusChange(course.id, "PUBLISHED")}
                            disabled={isPending && processingId === course.id}
                            className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold"
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
                            className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 text-amber-500 hover:bg-amber-500 hover:text-white transition-all text-xs font-bold"
                          >
                            {isPending && processingId === course.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                            إخفاء
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          disabled={isPending && processingId === course.id}
                          className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-red-500/10 px-2.5 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                          title="حذف الدورة"
                        >
                          {isPending && processingId === course.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash className="w-3 h-3" />
                          )}
                          حذف
                        </button>
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
          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <Camera className="mx-auto w-12 h-12 text-text-muted" />
              <p className="mt-3 text-text-secondary font-semibold">
                لا توجد دورات مسجلة بالمنصة حالياً.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setIsCreateOpen(true);
                }}
                className="btn-primary text-xs mt-4 min-h-11"
              >
                ابدأ بإنشاء أول دورة
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <AdminMobileCard
                key={course.id}
                title={course.title}
                subtitle={course.instructor.user.name}
                badge={courseStatusBadge(course.status)}
                fields={[
                  { label: "السعر", value: `${course.price} ر.س` },
                  { label: "الأقسام", value: `${course._count.sections} أقسام` },
                  { label: "المشتركون", value: `${course._count.enrollments} مشترك` },
                ]}
                actions={<AdminMobileActions actions={getCourseActions(course)} />}
              />
            ))
          )}
        </AdminMobileList>
      </div>
    </div>
  );
}
