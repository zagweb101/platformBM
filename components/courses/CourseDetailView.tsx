"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  Star,
  Users,
  BookOpen,
  Clock,
  Award,
  Infinity,
  Camera,
} from "lucide-react";
import type { CatalogCourse, CatalogCourseDetail } from "@/lib/courses-catalog";
import { getCourseRating, getPaymentsHref } from "@/lib/course-display";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CourseCard } from "@/components/ui/CourseCard";
import {
  CourseCurriculumAccordion,
  LearnPointsList,
} from "@/components/courses/CourseDetailParts";

function formatDuration(minutes: number) {
  if (minutes <= 0) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} دقيقة`;
  return `${hours} س ${mins > 0 ? `${mins} د` : ""}`.trim();
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

interface CourseDetailViewProps {
  course: CatalogCourseDetail;
  similarCourses: CatalogCourse[];
}

export default function CourseDetailView({
  course,
  similarCourses,
}: CourseDetailViewProps) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const enrollHref = getPaymentsHref(course.id, isLoggedIn);
  const rating = getCourseRating(course.studentCount);

  return (
    <>
      <div className="pb-[86px] lg:pb-0">
        <nav aria-label="مسار التنقل" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-body text-text-secondary">
            <li>
              <Link href="/" className="hover:text-brand-violet-600">
                الرئيسية
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </li>
            <li>
              <Link href="/courses" className="hover:text-brand-violet-600">
                الكورسات
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </li>
            <li className="font-semibold text-[#151525] line-clamp-1">{course.title}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-4 lg:gap-10">
          <div className="space-y-8 lg:col-span-3">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="brand" size="sm">
                  {course.category}
                </Badge>
                <Badge variant="info" size="sm">
                  {course.level}
                </Badge>
                <Badge variant="default" size="sm">
                  {course.delivery}
                </Badge>
              </div>
              <h1 className="text-section font-heading font-bold text-[#151525]">
                {course.title}
              </h1>
              <p className="mt-4 text-body text-text-secondary font-body">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted font-body">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {course.studentCount} طالب
                </span>
                <span>آخر تحديث: {formatDate(course.updatedAt)}</span>
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-section">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">
                  <Camera className="h-12 w-12" aria-hidden="true" />
                </div>
              )}
            </div>

            <section>
              <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">
                ما الذي ستتعلمه
              </h2>
              <LearnPointsList points={course.learnPoints} />
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">
                متطلبات الكورس
              </h2>
              <ul className="list-disc space-y-2 ps-5 text-sm text-text-secondary font-body">
                {course.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">
                محتوى الكورس
              </h2>
              {course.sections.length > 0 ? (
                <CourseCurriculumAccordion sections={course.sections} />
              ) : (
                <p className="text-sm text-text-muted font-body">سيُضاف المحتوى قريباً.</p>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">
                نبذة عن المدرب
              </h2>
              <Card variant="bordered" padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-surface-section">
                  {course.instructor.user.image ? (
                    <Image
                      src={course.instructor.user.image}
                      alt={course.instructor.user.name ?? "المدرب"}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#151525] font-heading">
                    {course.instructor.user.name}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary font-body line-clamp-3">
                    {course.instructorBio ?? "مدرب متخصص في التصوير وصناعة الأفلام."}
                  </p>
                </div>
                <Button href={`/#instructors`} variant="outline" size="sm" className="shrink-0">
                  عرض الملف
                </Button>
              </Card>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">آراء الطلاب</h2>
              <p className="rounded-lg border border-border-default bg-surface-section px-4 py-6 text-sm text-text-muted font-body">
                {/* TODO: ربط آراء الطلاب الحقيقية من قاعدة البيانات */}
                لا توجد آراء منشورة بعد — كن أول من يقيّم هذا الكورس.
              </p>
            </section>

            {similarCourses.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">
                  كورسات مشابهة
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {similarCourses.map((item) => (
                    <CourseCard key={item.id} course={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4 rounded-lg border border-border-default bg-white p-5 shadow-card">
              {course.thumbnail ? (
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <p className="text-3xl font-bold text-[#151525] font-heading">
                {course.price} <span className="text-base font-normal">ر.س</span>
              </p>
              <Button href={enrollHref} variant="primary" size="lg" className="w-full">
                سجّل الآن
              </Button>
              <ul className="space-y-3 border-t border-border-soft pt-4 text-sm font-body text-text-secondary">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-brand-violet-600" aria-hidden="true" />
                  مدة الكورس: {formatDuration(course.totalDurationMinutes)}
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 shrink-0 text-brand-violet-600" aria-hidden="true" />
                  {course.lessonCount} درس
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 shrink-0 text-brand-violet-600" aria-hidden="true" />
                  مستوى {course.level}
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 shrink-0 text-brand-violet-600" aria-hidden="true" />
                  شهادة إتمام
                </li>
                <li className="flex items-center gap-2">
                  <Infinity className="h-4 w-4 shrink-0 text-brand-violet-600" aria-hidden="true" />
                  وصول مدى الحياة
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-default bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-hover lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Button href={enrollHref} variant="primary" size="md" className="shrink-0">
            سجّل في الكورس
          </Button>
          <p className="text-xl font-bold text-[#151525] font-heading">
            {course.price} <span className="text-sm font-normal">ر.س</span>
          </p>
        </div>
      </div>
    </>
  );
}
