/**
 * Deep DB sanity check — events schema + queries
 * Run: npx tsx scripts/deep-test-db.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  getPublishedEvents,
  getAllPublishedEvents,
  getAdminEvents,
} from "../lib/events";

const db = new PrismaClient();

async function main() {
  console.log("=== Deep DB test — events & profile schema ===\n");

  const userColumns = await db.user.findFirst({
    select: { id: true, phone: true, bio: true, name: true, email: true },
  });
  if (!userColumns) throw new Error("No users in DB — run seed first");
  console.log("✓ User.phone / User.bio fields accessible");

  const eventCount = await db.event.count();
  console.log(`✓ Event table exists (${eventCount} rows)`);

  const regCount = await db.eventRegistration.count();
  console.log(`✓ EventRegistration table exists (${regCount} rows)`);

  const published = await getPublishedEvents(5);
  console.log(`✓ getPublishedEvents() → ${published.length} events`);

  const allPublished = await getAllPublishedEvents();
  console.log(`✓ getAllPublishedEvents() → ${allPublished.length} events`);

  const adminEvents = await getAdminEvents();
  console.log(`✓ getAdminEvents() → ${adminEvents.length} events`);

  for (const event of published) {
    if (typeof event.approvedCount !== "number") {
      throw new Error("approvedCount missing on serialized event");
    }
  }
  console.log("✓ Event serialization (approvedCount) OK");

  const admin = await db.user.findUnique({
    where: { email: "admin@baytalmosawer.com" },
  });
  const student = await db.user.findUnique({
    where: { email: "khaled@example.com" },
  });
  if (!admin || !student) {
    console.warn("⚠ Seed users missing — E2E login tests may fail");
  } else {
    console.log("✓ Seed users admin + student present");
  }

  console.log("\n=== All DB checks passed ===");
}

main()
  .catch((e) => {
    console.error("\n✗ DB test failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
