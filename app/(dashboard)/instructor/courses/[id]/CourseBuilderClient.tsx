"use client";

import { useState, useTransition } from "react";
import {
  updateCourse,
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/actions/course.actions";
import { toast } from "sonner";
import {
  Edit,
  Trash,
  Plus,
  ArrowRight,
  Loader2,
  Clock,
  Save,
  Video
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number | null;
  order: number;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  status: "DRAFT" | "PENDING" | "PUBLISHED" | "HIDDEN";
  sections: Section[];
}

export default function CourseBuilderClient({ initialCourse }: { initialCourse: CourseData }) {
  const [course, setCourse] = useState(initialCourse);
  const [isPending, startTransition] = useTransition();

  // Course Details Editing States
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [price, setPrice] = useState(course.price);
  const [thumbnail, setThumbnail] = useState(course.thumbnail || "");
  const [status, setStatus] = useState(course.status);

  // Section / Lesson modals or inline editing states
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");

  const [activeLessonSectionId, setActiveLessonSectionId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState<number>(0);

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [editingLessonVideoUrl, setEditingLessonVideoUrl] = useState("");
  const [editingLessonDuration, setEditingLessonDuration] = useState<number>(0);

  // 1. Update Course details
  const handleUpdateCourseDetails = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateCourse(course.id, {
        title,
        description,
        price,
        thumbnail: thumbnail || "",
        status,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم تحديث تفاصيل الدورة بنجاح.");
      }
    });
  };

  // 2. Section Operations
  const handleCreateSection = () => {
    if (!newSectionTitle) return;
    const order = course.sections.length + 1;
    startTransition(async () => {
      const res = await createSection(course.id, newSectionTitle, order);
      if (res.error) {
        toast.error(res.error);
      } else if (res.section) {
        toast.success("تم إضافة القسم بنجاح.");
        setCourse((prev) => ({
          ...prev,
          sections: [
            ...prev.sections,
            {
              id: res.section!.id,
              title: res.section!.title,
              order: res.section!.order,
              lessons: [],
            },
          ],
        }));
        setNewSectionTitle("");
      }
    });
  };

  const handleUpdateSectionTitle = (sectionId: string) => {
    if (!editingSectionTitle) return;
    startTransition(async () => {
      const res = await updateSection(sectionId, editingSectionTitle, 1);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم تحديث عنوان القسم.");
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId ? { ...s, title: editingSectionTitle } : s
          ),
        }));
        setEditingSectionId(null);
      }
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm("هل أنت متأكد من حذف القسم وجميع دروسه نهائيًا؟")) return;
    startTransition(async () => {
      const res = await deleteSection(sectionId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم حذف القسم.");
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.filter((s) => s.id !== sectionId),
        }));
      }
    });
  };

  // 3. Lesson Operations
  const handleCreateLesson = (sectionId: string) => {
    if (!newLessonTitle) return;
    const section = course.sections.find((s) => s.id === sectionId);
    const order = (section?.lessons.length || 0) + 1;

    startTransition(async () => {
      const res = await createLesson({
        sectionId,
        title: newLessonTitle,
        videoUrl: newLessonVideoUrl || undefined,
        duration: newLessonDuration || undefined,
        order,
      });

      if (res.error) {
        toast.error(res.error);
      } else if (res.lesson) {
        toast.success("تم إضافة الدرس بنجاح.");
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  lessons: [
                    ...s.lessons,
                    {
                      id: res.lesson!.id,
                      title: res.lesson!.title,
                      videoUrl: res.lesson!.videoUrl,
                      duration: res.lesson!.duration,
                      order: res.lesson!.order,
                    },
                  ],
                }
              : s
          ),
        }));
        setNewLessonTitle("");
        setNewLessonVideoUrl("");
        setNewLessonDuration(0);
        setActiveLessonSectionId(null);
      }
    });
  };

  const handleUpdateLessonDetails = (lessonId: string, sectionId: string) => {
    if (!editingLessonTitle) return;
    startTransition(async () => {
      const res = await updateLesson(lessonId, {
        title: editingLessonTitle,
        videoUrl: editingLessonVideoUrl || "",
        duration: editingLessonDuration || 0,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم تحديث تفاصيل الدرس.");
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  lessons: s.lessons.map((l) =>
                    l.id === lessonId
                      ? {
                          ...l,
                          title: editingLessonTitle,
                          videoUrl: editingLessonVideoUrl || null,
                          duration: editingLessonDuration || null,
                        }
                      : l
                  ),
                }
              : s
          ),
        }));
        setEditingLessonId(null);
      }
    });
  };

  const handleDeleteLesson = (lessonId: string, sectionId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;
    startTransition(async () => {
      const res = await deleteLesson(lessonId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("تم حذف الدرس.");
        setCourse((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
              : s
          ),
        }));
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/instructor/courses"
          className="p-2 rounded-xl border border-subtle bg-card hover:bg-secondary transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-text-primary" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-text-primary mb-1">مُنشئ ومنسق الدورة</h2>
          <p className="text-sm text-text-secondary">قم بتعديل بيانات الدورة وبناء المنهج التعليمي (أقسام ودروس).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-brand bg-card p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary border-b border-subtle pb-2">تفاصيل الدورة</h3>
            
            <form onSubmit={handleUpdateCourseDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">عنوان الدورة</label>
                <input
                  type="text"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">وصف الدورة</label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-3.5 py-2 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    className="w-full px-3.5 py-2 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">حالة الدورة</label>
                  <select
                    className="w-full px-3.5 py-2 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CourseData["status"])}
                  >
                    <option value="DRAFT">مسودة</option>
                    <option value="PENDING">مراجعة من الإدارة</option>
                    <option value="PUBLISHED">منشورة للطلاب</option>
                    <option value="HIDDEN">مخفية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">رابط صورة الغلاف</label>
                <input
                  type="url"
                  className="w-full px-3.5 py-2 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet font-almarai"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full flex items-center justify-center gap-1.5 text-xs py-2.5 mt-6"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ تفاصيل الدورة
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sections & Lessons builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Section Form */}
          <div className="card-brand bg-card p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary">إضافة قسم جديد للمنهج</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="عنوان القسم الجديد (مثال: التعرف على الكاميرا)"
                className="flex-grow px-4 py-2.5 rounded-xl border border-subtle bg-secondary text-sm outline-none text-text-primary focus:border-brand-violet focus:ring-1 focus:ring-brand-violet"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
              <button
                onClick={handleCreateSection}
                disabled={isPending}
                className="btn-primary flex items-center gap-1.5 text-xs px-6 py-2.5 whitespace-nowrap"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    إضافة قسم
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Curriculum View */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary">أقسام ودروس الدورة</h3>
            
            {course.sections.length === 0 ? (
              <div className="card-brand p-8 text-center bg-card text-text-secondary text-sm">
                المنهج التعليمي فارغ حالياً. قم بإضافة الأقسام والدروس أعلاه.
              </div>
            ) : (
              course.sections.map((section) => (
                <div key={section.id} className="card-brand bg-card p-6 space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center justify-between border-b border-subtle/50 pb-3">
                    {editingSectionId === section.id ? (
                      <div className="flex items-center gap-2 flex-grow max-w-md">
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-subtle bg-secondary text-sm focus:ring-1 focus:ring-brand-violet outline-none"
                          value={editingSectionTitle}
                          onChange={(e) => setEditingSectionTitle(e.target.value)}
                        />
                        <button
                          onClick={() => handleUpdateSectionTitle(section.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setEditingSectionId(null)}
                          className="px-3 py-1.5 rounded-lg border border-subtle text-xs text-text-secondary"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <span className="font-almarai text-brand-fuchsia bg-brand-fuchsia/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          {section.order}
                        </span>
                        {section.title}
                      </h4>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSectionId(section.id);
                          setEditingSectionTitle(section.title);
                        }}
                        className="p-1 rounded text-text-secondary hover:bg-secondary"
                        title="تعديل اسم القسم"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="حذف القسم"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-2.5">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="p-3.5 rounded-xl border border-subtle bg-secondary/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-violet/20 transition-all">
                        {editingLessonId === lesson.id ? (
                          <div className="w-full space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                className="px-3 py-1.5 rounded-lg border border-subtle bg-card text-xs focus:ring-1 focus:ring-brand-violet outline-none"
                                value={editingLessonTitle}
                                onChange={(e) => setEditingLessonTitle(e.target.value)}
                                placeholder="عنوان الدرس"
                              />
                              <input
                                type="url"
                                className="px-3 py-1.5 rounded-lg border border-subtle bg-card text-xs focus:ring-1 focus:ring-brand-violet outline-none font-almarai"
                                value={editingLessonVideoUrl}
                                onChange={(e) => setEditingLessonVideoUrl(e.target.value)}
                                placeholder="رابط الفيديو (mp4)"
                              />
                              <input
                                type="number"
                                className="px-3 py-1.5 rounded-lg border border-subtle bg-card text-xs focus:ring-1 focus:ring-brand-violet outline-none font-almarai"
                                value={editingLessonDuration || ""}
                                onChange={(e) => setEditingLessonDuration(Number(e.target.value))}
                                placeholder="المدة بالدقائق"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateLessonDetails(lesson.id, section.id)}
                                className="px-3 py-1 bg-emerald-500 text-white rounded text-xs font-bold"
                              >
                                حفظ الدرس
                              </button>
                              <button
                                onClick={() => setEditingLessonId(null)}
                                className="px-3 py-1 border border-subtle text-text-secondary rounded text-xs"
                              >
                                إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <Video className="w-4 h-4 text-brand-indigo shrink-0" />
                              <div>
                                <h5 className="text-sm font-bold text-text-primary">
                                  {lesson.title}
                                </h5>
                                <div className="flex items-center gap-3 text-[10px] text-text-muted mt-1 font-almarai">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {lesson.duration || 0} دقائق
                                  </span>
                                  {lesson.videoUrl && (
                                    <span className="text-emerald-500">تم رفع الفيديو</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-auto">
                              <button
                                onClick={() => {
                                  setEditingLessonId(lesson.id);
                                  setEditingLessonTitle(lesson.title);
                                  setEditingLessonVideoUrl(lesson.videoUrl || "");
                                  setEditingLessonDuration(lesson.duration || 0);
                                }}
                                className="p-1 rounded text-text-secondary hover:bg-secondary text-xs"
                                title="تعديل الدرس"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id, section.id)}
                                className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs"
                                title="حذف الدرس"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Lesson inline form toggle */}
                    {activeLessonSectionId === section.id ? (
                      <div className="p-4 rounded-xl border border-dashed border-subtle bg-secondary/10 space-y-3 mt-4">
                        <h5 className="text-xs font-bold text-text-primary">إضافة درس جديد</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="عنوان الدرس"
                            className="px-3 py-1.5 rounded-lg border border-subtle bg-card text-xs focus:ring-1 focus:ring-brand-violet outline-none"
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                          />
                          <input
                            type="url"
                            placeholder="رابط الفيديو (mp4)"
                            className="px-3 py-1.5 rounded-lg border border-subtle bg-card text-xs focus:ring-1 focus:ring-brand-violet outline-none font-almarai"
                            value={newLessonVideoUrl}
                            onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="المدة بالدقائق"
                            className="px-3 py-1.5 rounded-lg border border-subtle bg-card text-xs focus:ring-1 focus:ring-brand-violet outline-none font-almarai"
                            value={newLessonDuration || ""}
                            onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => handleCreateLesson(section.id)}
                            disabled={isPending}
                            className="px-4 py-1.5 bg-brand-indigo text-white text-xs font-bold rounded-lg"
                          >
                            حفظ الدرس
                          </button>
                          <button
                            onClick={() => setActiveLessonSectionId(null)}
                            className="px-4 py-1.5 border border-subtle text-text-secondary text-xs rounded-lg"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveLessonSectionId(section.id)}
                        className="w-full py-2.5 rounded-xl border border-dashed border-subtle bg-secondary/10 flex items-center justify-center gap-1.5 text-xs text-brand-indigo hover:bg-secondary/30 transition-all font-semibold mt-4"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        إضافة درس جديد لهذا القسم
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
