"use client";

import { useState, useTransition } from "react";
import { createCourse } from "@/actions/course.actions";
import { toast } from "sonner";
import { Plus, Camera, Loader2, Edit, Users, FolderKanban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN";
  _count: {
    sections: number;
    enrollments: number;
  };
}

export default function InstructorCoursesClient({ initialCourses }: { initialCourses: CourseItem[] }) {
  const courses = initialCourses;
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || price < 0) {
      toast.error("يرجى ملء كافة الحقول الأساسية بشكل صحيح.");
      return;
    }

    startTransition(async () => {
      const res = await createCourse({
        title,
        description,
        price,
        thumbnail: thumbnail || undefined,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success || "تم إنشاء مسودة الدورة بنجاح!");
        // Refresh local courses or redirect to course builder
        window.location.href = `/dashboard/instructor/courses/${res.courseId}`;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text-primary mb-1">إدارة الدورات التدريبية</h2>
          <p className="text-sm text-text-secondary">قم بإنشاء وتعديل وإضافة محتوى الدورات التابعة لك.</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          إنشاء دورة جديدة
        </button>
      </div>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-brand bg-card max-w-lg w-full p-6 space-y-4 relative">
            <h3 className="text-lg font-bold text-text-primary">إضافة دورة تدريبية جديدة</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">عنوان الدورة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أساسيات التصوير بالهاتف"
                  className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">وصف الدورة</label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب نبذة شيقة وجذابة عن محتوى الدورة وأهدافها..."
                  className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">سعر الدورة (ريال سعودي)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="299"
                    className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">رابط غلاف الدورة (رابط صورة)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                    "إنشاء مسودة والذهاب للمنشئ"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List Grid */}
      {courses.length === 0 ? (
        <div className="card-brand p-8 text-center bg-card">
          <Camera className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary font-semibold">لم تقم بإنشاء أي دورات تدريبية بعد.</p>
          <button
            onClick={() => setIsOpen(true)}
            className="btn-primary text-xs mt-4"
          >
            ابدأ بإنشاء أول دورة لك
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card-brand bg-card overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full bg-secondary">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                      <Camera className="w-10 h-10" />
                    </div>
                  )}
                  
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
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
                      {course.status === "PENDING" && "قيد المراجعة"}
                      {course.status === "PUBLISHED" && "منشورة"}
                      {course.status === "HIDDEN" && "مخفية"}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-base font-bold text-text-primary truncate" title={course.title}>
                    {course.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-subtle/40 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <strong className="font-almarai">{course._count.sections}</strong> أقسام
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <strong className="font-almarai">{course._count.enrollments}</strong> طلاب
                  </span>
                </div>

                <Link
                  href={`/dashboard/instructor/courses/${course.id}`}
                  className="flex items-center gap-1 text-xs text-brand-indigo hover:text-brand-fuchsia font-bold transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  مُنشئ الدورة
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
