import type { ComponentType } from "react";
import Image from "next/image";
import {
  BookOpen,
  Award,
  ListTodo,
  GraduationCap,
  Camera,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  formatArabicDate,
  formatRelativeTime,
  getMotivationalLine,
  type StudentDashboardData,
} from "@/lib/student-dashboard";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card variant="default" padding="md" className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-muted font-body">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[#151525] font-heading">{value}</p>
        </div>
        <div className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-brand-violet-600/10 text-brand-violet-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </Card>
  );
}

export function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton variant="heading" />
      <Skeleton variant="card" className="h-44" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} variant="card" className="h-28" />
        ))}
      </div>
    </div>
  );
}

export function StudentDashboardError() {
  return (
    <Card variant="bordered" padding="lg" className="text-center">
      <p className="text-lg font-semibold text-[#151525] font-heading">
        تعذّر تحميل لوحة الطالب
      </p>
      <p className="mt-2 text-sm text-text-secondary font-body">
        حدث خطأ أثناء جلب البيانات. يرجى تحديث الصفحة.
      </p>
      <Button href="/dashboard/student" variant="primary" size="md" className="mt-4">
        إعادة المحاولة
      </Button>
    </Card>
  );
}

export function StudentDashboardEmpty() {
  return (
    <Card variant="default" padding="lg" className="text-center">
      <GraduationCap className="mx-auto h-12 w-12 text-brand-violet-600" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-bold text-[#151525] font-heading">
        ابدأ رحلتك التعليمية
      </h2>
      <p className="mt-2 text-sm text-text-secondary font-body">
        لم تشترك في أي كورس بعد. استعرض الكورسات المتاحة واختر ما يناسبك.
      </p>
      <Button href="/courses" variant="primary" size="lg" className="mt-6">
        استعرض الكورسات
      </Button>
    </Card>
  );
}

interface StudentDashboardViewProps {
  data: StudentDashboardData;
}

export default function StudentDashboardView({ data }: StudentDashboardViewProps) {
  const firstName = data.user?.name?.split(" ")[0] ?? "طالب";

  if (!data.hasCourses) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
            مرحباً {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-text-muted font-body">{formatArabicDate()}</p>
          <p className="mt-2 text-sm text-text-secondary font-body">{getMotivationalLine()}</p>
        </header>
        <StudentDashboardEmpty />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
          مرحباً {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-text-muted font-body">{formatArabicDate()}</p>
        <p className="mt-2 text-sm text-text-secondary font-body">{getMotivationalLine()}</p>
      </header>

      {data.continueCourse ? (
        <Card variant="elevated" padding="md">
          <p className="text-sm font-semibold text-brand-violet-600 font-body">تابع تعلمك</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-surface-section sm:h-20 sm:w-32">
              {data.continueCourse.course.thumbnail ? (
                <Image
                  src={data.continueCourse.course.thumbnail}
                  alt={data.continueCourse.course.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">
                  <Camera className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <h2 className="text-lg font-bold text-[#151525] font-heading line-clamp-2">
                {data.continueCourse.course.title}
              </h2>
              <div>
                <div className="mb-1 flex justify-between text-xs font-body text-text-muted">
                  <span>نسبة التقدم</span>
                  <span>{data.continueCourse.progress.percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-section">
                  <div
                    className="h-full gradient-brand transition-all"
                    style={{ width: `${data.continueCourse.progress.percent}%` }}
                  />
                </div>
              </div>
              {data.continueCourse.nextLesson ? (
                <p className="text-sm text-text-secondary font-body">
                  الدرس التالي:{" "}
                  <span className="font-semibold text-[#151525]">
                    {data.continueCourse.nextLesson.title}
                  </span>
                </p>
              ) : null}
            </div>
            {data.continueCourse.nextLesson ? (
              <Button
                href={`/dashboard/student/learn/${data.continueCourse.course.id}/${data.continueCourse.nextLesson.id}`}
                variant="primary"
                size="md"
                className="w-full sm:w-auto shrink-0"
              >
                تابع التعلم
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="الكورسات المنتهية" value={data.stats.completed} icon={Award} />
        <StatCard label="الكورسات النشطة" value={data.stats.active} icon={BookOpen} />
        <StatCard label="المهام المنتظرة" value={data.stats.pendingTasks} icon={ListTodo} />
        <StatCard label="الشهادات المكتسبة" value={data.stats.certificates} icon={GraduationCap} />
      </div>

      <section id="courses">
        <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">كورساتي النشطة</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.activeCourses.slice(0, 3).map((item) => (
            <Card key={item.enrollmentId} variant="default" padding="sm" className="overflow-hidden p-0">
              <div className="relative aspect-[16/9] bg-surface-section">
                {item.course.thumbnail ? (
                  <Image
                    src={item.course.thumbnail}
                    alt={item.course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <h3 className="line-clamp-2 font-bold text-[#151525] font-heading">
                  {item.course.title}
                </h3>
                <div className="h-2 overflow-hidden rounded-full bg-surface-section">
                  <div
                    className="h-full gradient-brand"
                    style={{ width: `${item.progress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted font-body">{item.progress.percent}% مكتمل</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="notifications">
        <h2 className="mb-4 text-xl font-bold text-[#151525] font-heading">الإشعارات الأخيرة</h2>
        {data.notifications.length === 0 ? (
          <Card variant="ghost" padding="md">
            <p className="text-sm text-text-muted font-body">لا توجد إشعارات حديثة.</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {data.notifications.map((notification) => (
              <li key={notification.id}>
                <Card variant="bordered" padding="md" className="flex items-start gap-3">
                  <Bell className="mt-0.5 h-5 w-5 shrink-0 text-brand-violet-600" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#151525] font-body">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-text-muted font-body">
                      {formatRelativeTime(notification.time)}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="certificates" className="sr-only" aria-hidden="true" />
      <section id="tasks" className="sr-only" aria-hidden="true" />
    </div>
  );
}
