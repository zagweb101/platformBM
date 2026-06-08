export const COURSE_CATEGORIES = [
  "تصوير فوتوغرافي",
  "إضاءة",
  "صناعة أفلام",
  "تحرير رقمي",
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];
export type CourseLevel = "مبتدئ" | "متوسط" | "متقدم";
export type CourseDelivery = "حضوري" | "أونلاين";
export type CourseSort = "newest" | "popular" | "rating" | "price";

export function getCategoryLabel(title: string): CourseCategory {
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

export function getLevelLabel(title: string): CourseLevel {
  if (title.includes("أساس") || title.includes("مبتد")) return "مبتدئ";
  if (title.includes("متقدم") || title.includes("احتراف")) return "متقدم";
  return "متوسط";
}

/** لا يوجد حقل في قاعدة البيانات — افتراضي أونلاين */
export function getDeliveryLabel(): CourseDelivery {
  return "أونلاين";
}

export function getCourseRating(studentCount: number) {
  return studentCount > 0 ? 4.8 : 4.5;
}

export function getEnrollHref(courseId: string, isLoggedIn: boolean) {
  const target = `/dashboard/student/payments/checkout/${courseId}`;
  if (isLoggedIn) return target;
  return `/login?callbackUrl=${encodeURIComponent(target)}`;
}

export function getPaymentsHref(courseId: string, isLoggedIn: boolean) {
  const target = `/dashboard/student/payments?course=${courseId}`;
  if (isLoggedIn) return target;
  return `/login?callbackUrl=${encodeURIComponent(target)}`;
}
