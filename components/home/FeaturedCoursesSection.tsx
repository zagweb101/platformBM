import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { CourseCard } from "@/components/ui/CourseCard";
import { getFeaturedCourses } from "@/lib/home-data";

function FeaturedCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} variant="card" className="h-[420px]" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-border-default bg-surface-section px-6 py-12 text-center">
      <p className="text-lg font-semibold text-[#151525] font-heading">
        لا توجد كورسات منشورة حالياً
      </p>
      <p className="mt-2 text-text-secondary font-body">
        سيتم إضافة كورسات جديدة قريباً — تابعنا للاطلاع على آخر التحديثات.
      </p>
      <Button href="/contact" variant="primary" size="md" className="mt-6">
        تواصل معنا
      </Button>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="text-lg font-semibold text-red-700 font-heading">
        تعذّر تحميل الكورسات
      </p>
      <p className="mt-2 text-red-600 font-body">
        حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.
      </p>
    </div>
  );
}

export default async function FeaturedCoursesSection() {
  let courses;

  try {
    courses = await getFeaturedCourses();
  } catch {
    return (
      <section id="courses" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="كورسات مميزة"
            title="ابدأ التعلم اليوم"
            description="اختر من بين كورساتنا العملية المصممة لكل مستوى."
            className="mb-10"
          />
          <ErrorState />
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="كورسات مميزة"
          title="ابدأ التعلم اليوم"
          description="اختر من بين كورساتنا العملية المصممة لكل مستوى."
          className="mb-10 sm:mb-12"
        />

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedCoursesLoading() {
  return (
    <section id="courses" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FeaturedCoursesSkeleton />
      </div>
    </section>
  );
}
