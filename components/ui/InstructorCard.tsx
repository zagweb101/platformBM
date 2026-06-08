"use client";

import Image from "next/image";
import { Star, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { HomeInstructor } from "@/lib/home-data";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`التقييم ${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
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

export interface InstructorCardProps {
  instructor: HomeInstructor;
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  const specialty =
    instructor.bio?.split(".")[0]?.slice(0, 60) ?? "تصوير فوتوغرافي وصناعة أفلام";
  const rating = instructor.studentCount > 0 ? 4.9 : 4.7;

  return (
    <Card variant="default" padding="sm" className="overflow-hidden p-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-section">
        <Image
          src={instructor.image ?? FALLBACK_IMAGE}
          alt={instructor.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold text-[#151525] font-heading">
          {instructor.name}
        </h3>
        <p className="text-sm text-text-secondary font-body line-clamp-2">{specialty}</p>

        <div className="flex flex-wrap gap-3 text-xs text-text-muted font-body">
          <span className="inline-flex items-center gap-1">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            خبرة متخصصة
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {instructor.studentCount}+ طالب
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {instructor.courseCount} كورس
          </span>
        </div>

        <Stars rating={rating} />

        <Button href={`/#instructors`} variant="outline" size="sm" className="w-full">
          عرض الملف
        </Button>
      </div>
    </Card>
  );
}
