"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Search } from "lucide-react";
import type { CatalogCourse } from "@/lib/courses-catalog";
import type { CourseSort } from "@/lib/course-display";
import { getCourseRating } from "@/lib/course-display";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { CourseCard } from "@/components/ui/CourseCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  CourseFiltersPanel,
  DEFAULT_FILTERS,
  hasActiveFilters,
  type CourseFiltersState,
} from "@/components/courses/CourseFiltersPanel";

interface CoursesPageClientProps {
  courses: CatalogCourse[];
  error?: boolean;
}

const SORT_OPTIONS: { value: CourseSort; label: string }[] = [
  { value: "newest", label: "الأحدث" },
  { value: "popular", label: "الأكثر طلباً" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price", label: "السعر" },
];

export default function CoursesPageClient({
  courses,
  error = false,
}: CoursesPageClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CourseSort>("newest");
  const [filters, setFilters] = useState<CourseFiltersState>(DEFAULT_FILTERS);
  const [mobileFilters, setMobileFilters] = useState<CourseFiltersState>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const maxPrice = useMemo(
    () => Math.max(500, ...courses.map((c) => c.price), 5000),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q) ||
          course.instructor.user.name?.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((c) => filters.categories.includes(c.category));
    }
    if (filters.levels.length > 0) {
      result = result.filter((c) => filters.levels.includes(c.level));
    }
    if (filters.delivery.length > 0) {
      result = result.filter((c) => filters.delivery.includes(c.delivery));
    }

    result = result.filter(
      (c) => c.price >= filters.priceMin && c.price <= filters.priceMax
    );

    switch (sort) {
      case "popular":
        result.sort((a, b) => b.studentCount - a.studentCount);
        break;
      case "rating":
        result.sort(
          (a, b) => getCourseRating(b.studentCount) - getCourseRating(a.studentCount)
        );
        break;
      case "price":
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [courses, search, filters, sort]);

  const clearFilters = () => {
    const reset = { ...DEFAULT_FILTERS, priceMax: maxPrice };
    setFilters(reset);
    setMobileFilters(reset);
    setSearch("");
  };

  const applyMobileFilters = () => {
    setFilters(mobileFilters);
    setSheetOpen(false);
  };

  const handleRetry = () => {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 600);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-red-700 font-heading">
          تعذّر تحميل الكورسات
        </p>
        <Button variant="primary" size="md" className="mt-4" onClick={handleRetry}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} variant="card" className="h-[420px]" />
        ))}
      </div>
    );
  }

  return (
    <>
      <SectionHeading
        title="جميع الكورسات"
        description="استكشف دورات التصوير وصناعة الأفلام واختر ما يناسب مستواك."
        className="mb-8"
      />

      <div className="mb-6">
        <Input
          label="بحث"
          type="search"
          placeholder="ابحث عن كورس أو مدرب..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          icon={<Search className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-full shrink-0 lg:block lg:w-64 xl:w-72">
          <div className="sticky top-24 rounded-lg border border-border-default bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-[#151525] font-heading">الفلاتر</h2>
            <CourseFiltersPanel
              filters={filters}
              onChange={setFilters}
              maxPrice={maxPrice}
            />
            {hasActiveFilters(filters) ? (
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full"
                onClick={clearFilters}
              >
                مسح الكل
              </Button>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-secondary font-body">
              يتم عرض {filteredCourses.length} كورس
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                icon={<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
                onClick={() => {
                  setMobileFilters(filters);
                  setSheetOpen(true);
                }}
              >
                فلترة
              </Button>
              <label className="flex items-center gap-2 text-sm font-body">
                <span className="text-text-secondary shrink-0">ترتيب:</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as CourseSort)}
                  className="min-h-11 rounded-md border border-border-default bg-white px-3 text-sm outline-none focus:border-brand-violet-600 focus:ring-2 focus:ring-brand-violet-600/15"
                  aria-label="ترتيب الكورسات"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-lg border border-border-default bg-surface-section px-6 py-12 text-center">
              <p className="text-lg font-semibold text-[#151525] font-heading">
                لا توجد نتائج مطابقة
              </p>
              <p className="mt-2 text-text-secondary font-body">
                جرّب تعديل الفلاتر أو البحث بكلمات مختلفة.
              </p>
              <Button variant="primary" size="md" className="mt-4" onClick={clearFilters}>
                مسح الفلاتر
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="فلترة الكورسات"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              onClick={() => {
                const reset = { ...DEFAULT_FILTERS, priceMax: maxPrice };
                setMobileFilters(reset);
              }}
            >
              مسح الكل
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={applyMobileFilters}
            >
              تطبيق الفلاتر
            </Button>
          </div>
        }
      >
        <CourseFiltersPanel
          filters={mobileFilters}
          onChange={setMobileFilters}
          maxPrice={maxPrice}
        />
      </BottomSheet>
    </>
  );
}
