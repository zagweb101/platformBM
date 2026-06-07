import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GraduationCap, PlayCircle, BookOpen, Camera, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getEnrollmentProgressMap } from "@/lib/course-progress";

export const revalidate = 0;

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: {
            include: {
              user: true,
            },
          },
          sections: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  const progressMap = await getEnrollmentProgressMap(session.user.id);

  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id },
    select: { courseId: true, certificateNumber: true },
  });
  const certByCourse = Object.fromEntries(
    certificates.map((c) => [c.courseId, c.certificateNumber])
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-text-primary mb-1">لوحة الطلاب</h2>
        <p className="text-sm text-text-secondary">مرحباً بك! تصفح دوراتك المشترك بها وتابع تقدمك التعليمي.</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card-brand p-8 text-center bg-card max-w-xl mx-auto space-y-4">
          <GraduationCap className="w-12 h-12 text-brand-indigo mx-auto" />
          <h3 className="text-lg font-bold text-text-primary">مرحباً بك في أكاديميتنا!</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            لم تشترك في أي دورات تدريبية بعد. اذهب لتصفح الدورات المتوفرة واختر دورتك المفضلة لبدء رحلة التعلم.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/" className="btn-primary text-xs">
              تصفح الدورات المتاحة
            </Link>
            <Link
              href="/dashboard/student/payments"
              className="px-4 py-2 rounded-xl border border-subtle bg-secondary hover:bg-gray-100 dark:hover:bg-dark-elevated text-xs font-semibold transition-colors"
            >
              طريقة تفعيل الاشتراك
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(({ id: enrollmentId, course }) => {
            const firstSection = course.sections[0];
            const firstLesson = firstSection?.lessons[0];
            const progress = progressMap[course.id];
            const certNumber = certByCourse[course.id];

            return (
              <div key={enrollmentId} className="card-brand bg-card overflow-hidden flex flex-col justify-between">
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
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-bold text-text-primary line-clamp-2 min-h-[48px]" title={course.title}>
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-subtle">
                        {course.instructor.user.image ? (
                          <Image
                            src={course.instructor.user.image}
                            alt={course.instructor.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-brand-violet/10 flex items-center justify-center text-brand-violet font-bold text-[10px]">
                            {course.instructor.user.name[0]}
                          </div>
                        )}
                      </div>
                      <p className="font-semibold">{course.instructor.user.name}</p>
                    </div>

                    {progress && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-text-muted font-semibold">
                          <span>التقدم</span>
                          <span className="font-almarai">{progress.percent}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-indigo to-brand-fuchsia transition-all"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-text-muted">
                          {progress.completedLessons} / {progress.totalLessons} دروس
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 mt-4 border-t border-subtle/40 pt-4 flex flex-wrap items-center justify-between gap-2">
                  {certNumber ? (
                    <Link
                      href={`/dashboard/student/certificates/${course.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:underline"
                    >
                      <Award className="w-4 h-4" />
                      الشهادة
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted font-semibold flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {progress?.isComplete ? "جاري إصدار الشهادة..." : "دورة مفعلة"}
                    </span>
                  )}

                  {firstLesson ? (
                    <Link
                      href={`/dashboard/student/learn/${course.id}/${firstLesson.id}`}
                      className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-sm"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {progress?.percent ? "متابعة التعلم" : "ابدأ التعلم"}
                    </Link>
                  ) : (
                    <span className="text-xs text-text-muted">لا توجد دروس بعد</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
