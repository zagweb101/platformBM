import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateInstructorShare, toNumber } from "../lib/money";

const db = new PrismaClient();

async function runTests() {
  console.log("==================================================");
  console.log("       STARTING BAYT AL-MOSAWER CRM TESTS         ");
  console.log("==================================================");

  const TEST_EMAIL = `test_student_${Date.now()}@example.com`;
  const TEST_PASSWORD = "TestPassword123";
  const TEST_NAME = "طالب تجريبي للاختبار";
  const RECEIPT_URL = "https://utfs.io/f/test-receipt-url.jpg";

  let testUserId: string | null = null;
  let testPaymentId: string | null = null;
  let testEnrollmentId: string | null = null;
  let testWalletTxId: string | null = null;

  let originalWalletBalance = 0;
  let instructorId: string | null = null;
  let courseId: string | null = null;
  let lessonId: string | null = null;

  try {
    console.log("\n[Pre-Req] Fetching a published course and its instructor...");
    const course = await db.course.findFirst({
      where: { status: "PUBLISHED" },
      include: {
        instructor: true,
      },
    });

    if (!course || !course.instructor) {
      throw new Error("No published course or instructor found in the database. Please seed the DB first!");
    }

    courseId = course.id;
    instructorId = course.instructor.id;
    originalWalletBalance = toNumber(course.instructor.walletBalance);
    const coursePrice = toNumber(course.price);

    console.log(`- Found course: "${course.title}" (ID: ${courseId})`);
    console.log(
      `- Found instructor ID: ${instructorId} (Original Wallet: ${originalWalletBalance} SAR, Rev Share: ${toNumber(course.instructor.revenueShare)}%)`
    );

    const section = await db.section.findFirst({
      where: { courseId },
      include: { lessons: true },
    });

    if (section && section.lessons.length > 0) {
      lessonId = section.lessons[0].id;
      console.log(`- Found lesson ID for progress testing: ${lessonId}`);
    } else {
      console.log("- Warning: No lessons found in this course. Progress test will be skipped.");
    }

    console.log("\n[Test 1] Testing user registration...");
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
    const user = await db.user.create({
      data: {
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    testUserId = user.id;
    console.log(`✅ Success: User registered! ID: ${testUserId}`);

    console.log("\n[Test 2] Testing course payment receipt submission...");
    const payment = await db.payment.create({
      data: {
        userId: testUserId,
        courseId: courseId,
        amount: course.price,
        receiptUrl: RECEIPT_URL,
        status: "PENDING",
      },
    });

    testPaymentId = payment.id;
    console.log(`✅ Success: Payment uploaded! ID: ${testPaymentId}`);

    if (payment.status !== "PENDING" || toNumber(payment.amount) !== coursePrice) {
      throw new Error("Payment upload validation failed");
    }

    console.log("\n[Test 3] Testing payment approval transaction...");
    const instructorShare = calculateInstructorShare(
      course.price,
      course.instructor.revenueShare
    );

    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: testPaymentId! },
        data: { status: "APPROVED" },
      });

      const enrollment = await tx.enrollment.create({
        data: {
          userId: testUserId!,
          courseId: courseId!,
        },
      });
      testEnrollmentId = enrollment.id;

      await tx.instructor.update({
        where: { id: instructorId! },
        data: {
          walletBalance: {
            increment: instructorShare,
          },
        },
      });

      const walletTx = await tx.walletTransaction.create({
        data: {
          instructorId: instructorId!,
          amount: instructorShare,
          type: "CREDIT",
          description: `أرباح التسجيل في دورة "${course.title}" للمشترك ${TEST_NAME} (اختبار)`,
        },
      });
      testWalletTxId = walletTx.id;
    });

    console.log("✅ Success: Transaction block completed!");

    const updatedPayment = await db.payment.findUnique({ where: { id: testPaymentId } });
    if (updatedPayment?.status !== "APPROVED") {
      throw new Error("Payment status was not updated to APPROVED");
    }

    const enrollmentExists = await db.enrollment.findUnique({
      where: { id: testEnrollmentId! },
    });
    if (!enrollmentExists) {
      throw new Error("Enrollment record was not created");
    }

    const updatedInstructor = await db.instructor.findUnique({ where: { id: instructorId } });
    const expectedBalance = originalWalletBalance + instructorShare;
    if (Math.abs(toNumber(updatedInstructor?.walletBalance) - expectedBalance) > 0.01) {
      throw new Error(
        `Instructor wallet balance mismatch. Expected: ${expectedBalance}, Got: ${toNumber(updatedInstructor?.walletBalance)}`
      );
    }
    console.log(
      `- Verified: Instructor wallet incremented by rev share (+${instructorShare} SAR). New balance: ${toNumber(updatedInstructor?.walletBalance)} SAR`
    );

    const walletTxExists = await db.walletTransaction.findUnique({ where: { id: testWalletTxId! } });
    if (!walletTxExists || Math.abs(toNumber(walletTxExists.amount) - instructorShare) > 0.01) {
      throw new Error(
        `WalletTransaction amount mismatch or record missing. Expected: ${instructorShare}, Got: ${toNumber(walletTxExists?.amount)}`
      );
    }

    if (lessonId && testEnrollmentId) {
      console.log("\n[Test 4] Testing lesson progress tracking...");
      const progress = await db.lessonProgress.create({
        data: {
          enrollmentId: testEnrollmentId,
          lessonId: lessonId,
          completed: true,
        },
      });

      console.log(`✅ Success: Lesson progress marked as complete! ID: ${progress.id}`);
      await db.lessonProgress.delete({ where: { id: progress.id } });
    }
  } catch (error) {
    console.error("\n❌ TESTS FAILED:", error);
    process.exitCode = 1;
  } finally {
    console.log("\n[Cleanup] Reverting database changes...");

    if (testEnrollmentId) {
      await db.enrollment.delete({ where: { id: testEnrollmentId } }).catch(console.error);
    }
    if (testPaymentId) {
      await db.payment.delete({ where: { id: testPaymentId } }).catch(console.error);
    }
    if (testWalletTxId) {
      await db.walletTransaction.delete({ where: { id: testWalletTxId } }).catch(console.error);
    }
    if (testUserId) {
      await db.user.delete({ where: { id: testUserId } }).catch(console.error);
    }
    if (instructorId) {
      await db.instructor
        .update({
          where: { id: instructorId },
          data: { walletBalance: originalWalletBalance },
        })
        .catch(console.error);
    }

    console.log("\n==================================================");
    console.log(process.exitCode === 1 ? "       CRM TESTS FAILED" : "       ALL CRM WORKFLOW TESTS PASSED SUCCESSFULLY  ");
    console.log("==================================================");

    await db.$disconnect();
  }
}

runTests();
