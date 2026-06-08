import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CourseDetailView from "@/components/courses/CourseDetailView";
import {
  getCatalogCourseById,
  getSimilarCourses,
} from "@/lib/courses-catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCatalogCourseById(id);
  if (!course) return { title: "الكورس غير موجود | بيت المصور" };
  return {
    title: `${course.title} | بيت المصور`,
    description: course.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCatalogCourseById(id);

  if (!course) {
    notFound();
  }

  const similarCourses = await getSimilarCourses(course.id, course.category, 3);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CourseDetailView course={course} similarCourses={similarCourses} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
