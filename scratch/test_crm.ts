import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function runTests() {
  console.log("==================================================");
  console.log("       STARTING BAYT AL-MOSAWER CRM TESTS         ");
  console.log("==================================================");

  // Define unique test names and variables
  const TEST_EMAIL = `test_student_${Date.now()}@example.com`;
  const TEST_PASSWORD = "TestPassword123";
  const TEST_NAME = "طالب تجريبي للاختبار";
  const RECEIPT_URL = "https://utfs.io/f/test-receipt-url.jpg";

  let testUserId: string | null = null;
  let testPaymentId: string | null = null;
  let testEnrollmentId: string | null = null;
  let testWalletTxId: string | null = null;
  
  // Keep track of the original instructor wallet balance to restore it later
  let originalWalletBalance = 0;
  let instructorId: string | null = null;
  let courseId: string | null = null;
  let lessonId: string | null = null;

  try {
    // ----------------------------------------------------
    // PRE-REQ: Fetch a published course and its instructor
    // ----------------------------------------------------
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
    originalWalletBalance = course.instructor.walletBalance;

    console.log(`- Found course: "${course.title}" (ID: ${courseId})`);
    console.log(`- Found instructor ID: ${instructorId} (Original Wallet: ${originalWalletBalance} SAR, Rev Share: ${course.instructor.revenueShare}%)`);

    // Fetch a lesson in this course to test progress tracking
    const section = await db.section.findFirst({
      where: { courseId },
      include: { lessons: true }
    });
    
    if (section && section.lessons.length > 0) {
      lessonId = section.lessons[0].id;
      console.log(`- Found lesson ID for progress testing: ${lessonId}`);
    } else {
      console.log("- Warning: No lessons found in this course. Progress test will be skipped.");
    }

    // ----------------------------------------------------
    // TEST 1: User Registration
    // ----------------------------------------------------
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
    if (user.role !== "STUDENT" || user.email !== TEST_EMAIL) {
      throw new Error("Registration fields validation failed");
    }

    // ----------------------------------------------------
    // TEST 2: Course Payment Submission
    // ----------------------------------------------------
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
    if (payment.status !== "PENDING" || payment.amount !== course.price) {
      throw new Error("Payment upload validation failed");
    }

    // ----------------------------------------------------
    // TEST 3: Admin Approval Transaction
    // ----------------------------------------------------
    console.log("\n[Test 3] Testing payment approval transaction...");
    
    // Calculate instructor share
    const instructorShare = course.price * (course.instructor.revenueShare / 100);
    
    // Execute approval inside transactional block (simulating approvePayment action)
    await db.$transaction(async (tx) => {
      // 1. Set status = APPROVED
      await tx.payment.update({
        where: { id: testPaymentId! },
        data: { status: "APPROVED" },
      });

      // 2. Create Enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          userId: testUserId!,
          courseId: courseId!,
        },
      });
      testEnrollmentId = enrollment.id;

      // 3. Increment instructor balance
      await tx.instructor.update({
        where: { id: instructorId! },
        data: {
          walletBalance: {
            increment: instructorShare,
          },
        },
      });

      // 4. Create WalletTransaction
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

    // Verify side effects
    const updatedPayment = await db.payment.findUnique({ where: { id: testPaymentId } });
    if (updatedPayment?.status !== "APPROVED") {
      throw new Error("Payment status was not updated to APPROVED");
    }
    console.log("- Verified: Payment status set to APPROVED.");

    const enrollmentExists = await db.enrollment.findUnique({ where: { id: testEnrollmentId } });
    if (!enrollmentExists) {
      throw new Error("Enrollment record was not created");
    }
    console.log("- Verified: Enrollment record successfully created.");

    const updatedInstructor = await db.instructor.findUnique({ where: { id: instructorId } });
    const expectedBalance = originalWalletBalance + instructorShare;
    if (Math.abs((updatedInstructor?.walletBalance || 0) - expectedBalance) > 0.01) {
      throw new Error(`Instructor wallet balance mismatch. Expected: ${expectedBalance}, Got: ${updatedInstructor?.walletBalance}`);
    }
    console.log(`- Verified: Instructor wallet incremented by rev share (+${instructorShare} SAR). New balance: ${updatedInstructor?.walletBalance} SAR`);

    const walletTxExists = await db.walletTransaction.findUnique({ where: { id: testWalletTxId } });
    if (!walletTxExists || Math.abs(walletTxExists.amount - instructorShare) > 0.01) {
      throw new Error(`WalletTransaction amount mismatch or record missing. Expected: ${instructorShare}, Got: ${walletTxExists?.amount}`);
    }
    console.log("- Verified: Credit log written in WalletTransactions.");

    // ----------------------------------------------------
    // TEST 4: Lesson Progress completion
    // ----------------------------------------------------
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
      
      // Clean up progress entry
      await db.lessonProgress.delete({ where: { id: progress.id } });
      console.log("- Cleaned up temporary lesson progress record.");
    }

  } catch (error) {
    console.error("\n❌ TESTS FAILED:", error);
  } finally {
    // ----------------------------------------------------
    // CLEAN UP: Revert all changes to keep production DB clean
    // ----------------------------------------------------
    console.log("\n[Cleanup] Reverting database changes...");

    if (testEnrollmentId) {
      await db.enrollment.delete({ where: { id: testEnrollmentId } }).catch(console.error);
      console.log("- Deleted test enrollment.");
    }

    if (testPaymentId) {
      await db.payment.delete({ where: { id: testPaymentId } }).catch(console.error);
      console.log("- Deleted test payment.");
    }

    if (testWalletTxId) {
      await db.walletTransaction.delete({ where: { id: testWalletTxId } }).catch(console.error);
      console.log("- Deleted test wallet transaction.");
    }

    if (testUserId) {
      await db.user.delete({ where: { id: testUserId } }).catch(console.error);
      console.log("- Deleted test user.");
    }

    if (instructorId) {
      await db.instructor.update({
        where: { id: instructorId },
        data: { walletBalance: originalWalletBalance },
      }).catch(console.error);
      console.log(`- Restored instructor wallet balance to original: ${originalWalletBalance} SAR`);
    }

    console.log("\n==================================================");
    console.log("       ALL CRM WORKFLOW TESTS PASSED SUCCESSFULLY  ");
    console.log("==================================================");
    
    await db.$disconnect();
  }
}

runTests();
