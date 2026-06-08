/**
 * Deep integration — events lifecycle via Prisma (mirrors server actions)
 * Run: npx tsx scripts/deep-test-events-flow.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("=== Deep integration — events lifecycle ===\n");

  const admin = await db.user.findUnique({
    where: { email: "admin@baytalmosawer.com" },
  });
  const student = await db.user.findUnique({
    where: { email: "khaled@example.com" },
  });
  if (!admin || !student) throw new Error("Seed users missing");

  const title = `Deep Test Event ${Date.now()}`;

  const event = await db.event.create({
    data: {
      title,
      description: "فعالية اختبار عميق للتحقق من دورة حياة الانضمام والقبول.",
      location: "جدة",
      startsAt: new Date(Date.now() + 14 * 86400000),
      capacity: 5,
      status: "PUBLISHED",
      createdById: admin.id,
    },
  });
  console.log("✓ Created event:", event.id);

  const registration = await db.eventRegistration.create({
    data: {
      eventId: event.id,
      userId: student.id,
      status: "PENDING",
      note: "اختبار عميق",
    },
  });
  console.log("✓ Student registration PENDING");

  await db.eventRegistration.update({
    where: { id: registration.id },
    data: { status: "APPROVED" },
  });
  const approved = await db.eventRegistration.findUnique({
    where: { id: registration.id },
  });
  if (approved?.status !== "APPROVED") throw new Error("Approve failed");
  console.log("✓ Registration APPROVED");

  await db.eventRegistration.update({
    where: { id: registration.id },
    data: { status: "REJECTED" },
  });
  console.log("✓ Registration REJECTED (rollback test)");

  await db.eventRegistration.delete({ where: { id: registration.id } });
  await db.event.delete({ where: { id: event.id } });
  console.log("✓ Cleanup complete");

  console.log("\n=== Events lifecycle integration passed ===");
}

main()
  .catch((e) => {
    console.error("\n✗ Integration failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
