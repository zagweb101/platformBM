import { db } from "@/lib/db";
import { serializeCoursePrice } from "@/lib/serialize-client";
import {
  getCategoryLabel,
  getDeliveryLabel,
  getLevelLabel,
} from "@/lib/course-display";

function mapCourse(
  course: Awaited<ReturnType<typeof fetchPublishedCoursesRaw>>[number]
) {
  const serialized = serializeCoursePrice(course);
  const lessonCount = serialized.sections.reduce(
    (total, section) => total + section.lessons.length,
    0
  );

  return {
    id: serialized.id,
    title: serialized.title,
    description: serialized.description,
    thumbnail: serialized.thumbnail,
    price: serialized.price,
    createdAt: serialized.createdAt.toISOString(),
    category: getCategoryLabel(serialized.title),
    level: getLevelLabel(serialized.title),
    delivery: getDeliveryLabel(),
    instructor: {
      id: serialized.instructor.id,
      user: {
        name: serialized.instructor.user.name,
        image: serialized.instructor.user.image,
      },
    },
    lessonCount,
    studentCount: serialized._count.enrollments,
  };
}

async function fetchPublishedCoursesRaw() {
  return db.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      instructor: { include: { user: true } },
      sections: { include: { lessons: { select: { id: true } } } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export type CatalogCourse = ReturnType<typeof mapCourse>;

export async function getCatalogCourses() {
  const courses = await fetchPublishedCoursesRaw();
  return courses.map(mapCourse);
}

export async function getCatalogCourseById(id: string) {
  const course = await db.course.findFirst({
    where: { id, status: "PUBLISHED" },
    include: {
      instructor: { include: { user: true } },
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              duration: true,
            },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) return null;

  const serialized = serializeCoursePrice(course);
  const totalDuration = serialized.sections.reduce(
    (total, section) =>
      total +
      section.lessons.reduce((sum, lesson) => sum + (lesson.duration ?? 0), 0),
    0
  );

  return {
    ...mapCourse(serialized),
    sections: serialized.sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: section.lessons,
    })),
    instructorBio: serialized.instructor.bio,
    updatedAt: serialized.createdAt.toISOString(),
    totalDurationMinutes: totalDuration,
    learnPoints: buildLearnPoints(serialized.description),
    requirements: [
      "جهاز كاميرا أو هاتف ذكي للتطبيق العملي",
      "رغبة في التعلم والممارسة المستمرة",
      "لا يلزم خبرة سابقة للكورسات المبتدئة",
    ],
  };
}

export type CatalogCourseDetail = NonNullable<
  Awaited<ReturnType<typeof getCatalogCourseById>>
>;

function buildLearnPoints(description: string) {
  const sentences = description
    .split(/[.،!؟\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);

  if (sentences.length >= 3) return sentences.slice(0, 6);
  return [
    "أساسيات التصوير والإضاءة",
    "تطبيق عملي على مشاريع حقيقية",
    "تقنيات احترافية من خبراء المجال",
    "متابعة مباشرة مع المدرب",
  ];
}

export async function getSimilarCourses(
  courseId: string,
  category: string,
  limit = 3
) {
  const courses = await getCatalogCourses();
  return courses
    .filter((c) => c.id !== courseId && c.category === category)
    .slice(0, limit);
}
