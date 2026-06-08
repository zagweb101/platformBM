"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star, Users, BookOpen, Camera } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CatalogCourse } from "@/lib/courses-catalog";

function getCategoryLabel(title: string) {
  if (title.includes("تحرير") || title.includes("Lightroom") || title.includes("مونتاج")) {
    return "تحرير رقمي";
  }
  if (title.includes("أفلام") || title.includes("سينمائية") || title.includes("فيديو")) {
    return "صناعة أفلام";
  }
  if (title.includes("إضاءة") || title.includes("بورتريه")) {
    return "إضاءة";
  }
  return "تصوير فوتوغرافي";
}

function getLevelLabel(title: string) {
  if (title.includes("أساس") || title.includes("مبتد")) return "مبتدئ";
  if (title.includes("متقدم") || title.includes("احتراف")) return "متقدم";
  return "متوسط";
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`التقييم ${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-border-default"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export interface CourseCardProps {
  course: CatalogCourse;
}

export function CourseCard({ course }: CourseCardProps) {
  const [favorite, setFavorite] = useState(false);
  const category = getCategoryLabel(course.title);
  const level = getLevelLabel(course.title);
  const rating = course.studentCount > 0 ? 4.8 : 4.5;
  const reviewCount = Math.max(course.studentCount, 12);

  return (
    <Card variant="default" padding="sm" className="group relative overflow-hidden p-0 hover:-translate-y-1 hover:shadow-hover">
      <button
        type="button"
        onClick={() => setFavorite((v) => !v)}
        className="absolute top-3 start-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/90 text-text-muted shadow-sm transition-colors hover:text-brand-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-600"
        aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        aria-pressed={favorite}
      >
        <Heart
          className={`h-5 w-5 ${favorite ? "fill-brand-magenta text-brand-magenta" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div className="relative aspect-video w-full overflow-hidden bg-surface-section">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <Camera className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-3 end-3 flex flex-wrap gap-2">
          <Badge variant="brand" size="sm">
            {category}
          </Badge>
          <Badge variant="info" size="sm">
            {level}
          </Badge>
          <Badge variant="default" size="sm">
            أونلاين
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-bold text-[#151525] font-heading">
          {course.title}
        </h3>

        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-surface-section">
            {course.instructor.user.image ? (
              <Image
                src={course.instructor.user.image}
                alt={course.instructor.user.name ?? "المدرب"}
                fill
                sizes="24px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-brand-violet-600">
                {course.instructor.user.name?.[0] ?? "م"}
              </span>
            )}
          </div>
          <span className="text-sm text-text-secondary font-body">
            {course.instructor.user.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted font-body">
          <div className="flex items-center gap-1.5">
            <Stars rating={rating} />
            <span>{rating.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" aria-hidden="true" />
            {course.studentCount} طالب
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {course.lessonCount} درس
          </span>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-border-soft pt-4">
          <div>
            <p className="text-2xl font-bold text-[#151525] font-heading">
              {course.price} <span className="text-sm font-normal">ر.س</span>
            </p>
          </div>
          <Button href={`/courses/${course.id}`} variant="outline" size="sm">
            تفاصيل الكورس
          </Button>
        </div>
      </div>
    </Card>
  );
}
