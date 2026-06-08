import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CoursesPageClient from "@/components/courses/CoursesPageClient";
import { getCatalogCourses, type CatalogCourse } from "@/lib/courses-catalog";

export const metadata = {
  title: "الكورسات | بيت المصور",
  description: "استكشف جميع كورسات التصوير وصناعة الأفلام في أكاديمية بيت المصور.",
};

export default async function CoursesPage() {
  let courses: CatalogCourse[] = [];
  let error = false;

  try {
    courses = await getCatalogCourses();
  } catch {
    courses = [];
    error = true;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CoursesPageClient courses={courses} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
