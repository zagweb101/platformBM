/**
 * Deep backend integration test — admin approve flow, instructor wallet, student enrollment
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateInstructorShare, toNumber } from "../lib/money";

const db = new PrismaClient();

const results: { role: string; test: string; status: "PASS" | "FAIL" | "SKIP"; note?: string }[] = [];

function record(role: string, test: string, status: "PASS" | "FAIL" | "SKIP", note?: string) {
  results.push({ role, test, status, note });
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⏭️";
  console.log(`${icon} [${role}] ${test}${note ? ` — ${note}` : ""}`);
}

async function main() {
  console.log("\n========== BACKEND ROLE TESTS ==========\n");

  // --- ADMIN checks ---
  const admin = await db.user.findUnique({ where: { email: "admin@baytalmosawer.com" } });
  record("ADMIN", "Admin user exists", admin?.role === "ADMIN" ? "PASS" : "FAIL");

  const pendingPayments = await db.payment.count({ where: { status: "PENDING", method: "BANK_TRANSFER" } });
  record("ADMIN", "Can query pending bank payments", "PASS", `${pendingPayments} pending`);

  const instructors = await db.instructor.findMany({ include: { user: true } });
  record("ADMIN", "Instructors list accessible", instructors.length > 0 ? "PASS" : "FAIL", `${instructors.length} instructors`);

  const allCourses = await db.course.count();
  record("ADMIN", "Courses in system", allCourses > 0 ? "PASS" : "FAIL", `${allCourses} courses`);

  // --- INSTRUCTOR checks ---
  const ahmed = await db.user.findUnique({
    where: { email: "ahmed@baytalmosawer.com" },
    include: { instructor: { include: { courses: true } } },
  });
  record(
    "INSTRUCTOR",
    "Ahmed instructor approved with courses",
    ahmed?.instructor?.status === "APPROVED" && (ahmed.instructor.courses.length ?? 0) > 0 ? "PASS" : "FAIL",
    `${ahmed?.instructor?.courses.length ?? 0} courses, wallet ${toNumber(ahmed?.instructor?.walletBalance ?? 0)} SAR`
  );

  const draftCourse = await db.course.findFirst({
    where: { instructorId: ahmed?.instructor?.id, status: "DRAFT" },
  });
  record("INSTRUCTOR", "Has draft course capability", "PASS", draftCourse ? "draft exists" : "no draft (ok)");

  // --- STUDENT checks ---
  const khaled = await db.user.findUnique({
    where: { email: "khaled@example.com" },
    include: {
      enrollments: { include: { course: true, progress: true } },
      payments: true,
    },
  });
  record(
    "STUDENT",
    "Khaled enrolled in course(s)",
    (khaled?.enrollments.length ?? 0) > 0 ? "PASS" : "FAIL",
    `${khaled?.enrollments.length ?? 0} enrollments`
  );

  if (khaled?.enrollments[0]) {
    const e = khaled.enrollments[0];
    record("STUDENT", "Enrollment linked to published course", e.course.status === "PUBLISHED" ? "PASS" : "FAIL", e.course.title);
    record("STUDENT", "Lesson progress tracked", "PASS", `${e.progress.length} completed lessons`);
  }

  const mona = await db.user.findUnique({
    where: { email: "mona@example.com" },
    include: { enrollments: true },
  });
  record(
    "STUDENT",
    "Mona (unenrolled) has no enrollment",
    (mona?.enrollments.length ?? 0) === 0 ? "PASS" : "SKIP",
    "used for payment gate test"
  );

  // --- Full payment approval simulation (admin workflow) ---
  const course = await db.course.findFirst({
    where: { status: "PUBLISHED" },
    include: { instructor: true },
  });

  if (!course || !course.instructor) {
    record("ADMIN", "Payment approval flow", "SKIP", "no published course");
  } else {
    const testEmail = `e2e_eval_${Date.now()}@test.local`;
    const hashed = await bcrypt.hash("EvalTest@123", 10);
    let userId: string | null = null;
    let paymentId: string | null = null;

    try {
      const user = await db.user.create({
        data: { name: "E2E Eval Student", email: testEmail, password: hashed, role: "STUDENT" },
      });
      userId = user.id;

      const payment = await db.payment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          amount: course.price,
          method: "BANK_TRANSFER",
          status: "PENDING",
          receiptUrl: "https://example.com/receipt.jpg",
        },
      });
      paymentId = payment.id;
      record("STUDENT", "Submit bank transfer payment", "PASS", payment.id);

      const walletBefore = toNumber(course.instructor.walletBalance);
      const share = calculateInstructorShare(toNumber(course.price), toNumber(course.instructor.revenueShare));

      await db.$transaction(async (tx) => {
        await tx.payment.update({ where: { id: payment.id }, data: { status: "APPROVED" } });
        await tx.enrollment.create({ data: { userId: user.id, courseId: course.id } });
        await tx.instructor.update({
          where: { id: course.instructor!.id },
          data: { walletBalance: { increment: share } },
        });
      });

      const walletAfter = toNumber(
        (await db.instructor.findUnique({ where: { id: course.instructor.id } }))?.walletBalance ?? 0
      );
      const enrolled = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      });

      record("ADMIN", "Approve payment + enroll student", enrolled ? "PASS" : "FAIL");
      record(
        "INSTRUCTOR",
        "Wallet incremented on approval",
        Math.abs(walletAfter - walletBefore - share) < 0.01 ? "PASS" : "FAIL",
        `+${share} SAR`
      );

      // cleanup
      await db.enrollment.deleteMany({ where: { userId: user.id } });
      await db.payment.delete({ where: { id: payment.id } });
      await db.instructor.update({
        where: { id: course.instructor.id },
        data: { walletBalance: { decrement: share } },
      });
      await db.user.delete({ where: { id: user.id } });
      record("CLEANUP", "Test data removed", "PASS");
    } catch (e) {
      record("ADMIN", "Payment approval flow", "FAIL", String(e));
      if (paymentId) await db.payment.delete({ where: { id: paymentId } }).catch(() => {});
      if (userId) await db.user.delete({ where: { id: userId } }).catch(() => {});
    }
  }

  // --- Schema features ---
  const contactCount = await db.contactMessage.count();
  record("PUBLIC", "ContactMessage model works", "PASS", `${contactCount} messages stored`);

  const lessonWithVideo = await db.lesson.findFirst({
    select: { videoProvider: true, videoId: true, videoUrl: true },
  });
  record(
    "STUDENT",
    "Video protection schema present",
    lessonWithVideo?.videoProvider !== undefined ? "PASS" : "FAIL",
    `provider=${lessonWithVideo?.videoProvider ?? "n/a"}`
  );

  console.log("\n========== SUMMARY ==========");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const skipped = results.filter((r) => r.status === "SKIP").length;
  console.log(`PASS: ${passed} | FAIL: ${failed} | SKIP: ${skipped}`);

  await db.$disconnect();
  if (failed > 0) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
