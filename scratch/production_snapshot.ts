import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("\n=== PRODUCTION DATA SNAPSHOT ===\n");

  const users = await db.user.groupBy({ by: ["role"], _count: true });
  console.log("Users:", users);

  const courses = await db.course.groupBy({ by: ["status"], _count: true });
  console.log("Courses:", courses);

  const payments = await db.payment.groupBy({ by: ["status", "method"], _count: true });
  console.log("Payments:", payments);

  const enrollments = await db.enrollment.count();
  console.log("Total enrollments:", enrollments);

  const lessons = await db.lesson.count();
  const withVideo = await db.lesson.count({ where: { videoUrl: { not: null } } });
  const cfStream = await db.lesson.count({ where: { videoProvider: "CLOUDFLARE_STREAM" } });
  console.log(`Lessons: ${lessons}, with videoUrl: ${withVideo}, Cloudflare: ${cfStream}`);

  const pendingInstructors = await db.instructor.count({ where: { status: "PENDING" } });
  console.log("Pending instructor applications:", pendingInstructors);

  const progress = await db.lessonProgress.count({ where: { completed: true } });
  console.log("Completed lesson records:", progress);

  await db.$disconnect();
}

main();
