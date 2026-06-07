"use client";

import { useState, useTransition } from "react";
import { markLessonComplete } from "@/actions/progress.actions";
import { toast } from "sonner";
import {
  Play,
  CheckCircle,
  Circle,
  Video,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2
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

interface CoursePlayerProps {
  courseId: string;
  courseTitle: string;
  sections: Section[];
  activeLesson: Lesson;
  enrollmentId: string;
  completedLessonIds: string[];
}

export default function CoursePlayerClient({
  courseId,
  courseTitle,
  sections,
  activeLesson,
  enrollmentId,
  completedLessonIds: initialCompletedIds,
}: CoursePlayerProps) {
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds);
  const [isPending, startTransition] = useTransition();

  const isCompleted = completedIds.includes(activeLesson.id);

  const handleToggleComplete = () => {
    const targetStatus = !isCompleted;
    startTransition(async () => {
      const res = await markLessonComplete(enrollmentId, activeLesson.id, targetStatus);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(targetStatus ? "تهانينا! تم إكمال الدرس بنجاح." : "تم إلغاء تحديد إكمال الدرس.");
        if (targetStatus) {
          setCompletedIds((prev) => [...prev, activeLesson.id]);
        } else {
          setCompletedIds((prev) => prev.filter((id) => id !== activeLesson.id));
        }
      }
    });
  };

  // Find next/prev lessons for navigation
  const flatLessons = sections.flatMap((s) => s.lessons);
  const activeIdx = flatLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = activeIdx > 0 ? flatLessons[activeIdx - 1] : null;
  const nextLesson = activeIdx < flatLessons.length - 1 ? flatLessons[activeIdx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/student"
          className="p-2 rounded-xl border border-subtle bg-card hover:bg-secondary transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-text-primary" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-text-primary mb-1">{courseTitle}</h2>
          <p className="text-xs text-text-secondary">أنت الآن في وضع الدراسة والمشاهدة العملية.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Center/Left: Video Player & Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-brand bg-black aspect-video relative overflow-hidden rounded-2xl shadow-xl flex items-center justify-center">
            {activeLesson.videoUrl ? (
              <video
                src={activeLesson.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
              />
            ) : (
              <div className="text-center text-text-muted space-y-2 p-8">
                <Video className="w-12 h-12 mx-auto text-gray-600" />
                <p className="text-sm font-semibold">لا يوجد فيديو متوفر لهذا الدرس بعد.</p>
              </div>
            )}
          </div>

          {/* Lesson Details & Actions */}
          <div className="card-brand bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-text-primary">{activeLesson.title}</h3>
              <p className="text-xs text-text-secondary font-almarai flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                مدة الدرس: {activeLesson.duration || 0} دقائق
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Mark Complete Checkbox */}
              <button
                onClick={handleToggleComplete}
                disabled={isPending}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20 hover:bg-brand-indigo hover:text-white"
                }`}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                {isCompleted ? "مكتمل ✓" : "تحديد كمكتمل"}
              </button>

              {/* Prev/Next buttons */}
              {prevLesson && (
                <Link
                  href={`/dashboard/student/learn/${courseId}/${prevLesson.id}`}
                  className="p-2.5 rounded-xl border border-subtle bg-secondary hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors text-text-primary"
                  title="الدرس السابق"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/dashboard/student/learn/${courseId}/${nextLesson.id}`}
                  className="p-2.5 rounded-xl border border-subtle bg-secondary hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors text-text-primary"
                  title="الدرس التالي"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Playlist/Sections List */}
        <div className="lg:col-span-1">
          <div className="card-brand bg-card p-6 space-y-4">
            <h3 className="text-base font-bold text-text-primary border-b border-subtle pb-2 flex items-center gap-2">
              <Play className="w-5 h-5 text-brand-indigo" />
              منهج الدورة الدراسي
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[500px]">
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-text-secondary bg-secondary px-3 py-1.5 rounded-lg border border-subtle">
                    {section.title}
                  </h4>

                  <div className="space-y-1 pr-2">
                    {section.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLesson.id;
                      const isLessonCompleted = completedIds.includes(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/student/learn/${courseId}/${lesson.id}`}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all border ${
                            isActive
                              ? "bg-brand-indigo/10 border-brand-indigo text-brand-indigo font-bold"
                              : "border-transparent text-text-secondary hover:bg-secondary/40 hover:text-text-primary"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isLessonCompleted ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="font-almarai text-[10px] text-text-muted">
                            {lesson.duration || 0} د
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
