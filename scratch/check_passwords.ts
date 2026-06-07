import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  for (const [email, pwd] of [
    ["admin@baytalmosawer.com", "Admin@123456"],
    ["ahmed@baytalmosawer.com", "Instructor@123"],
    ["khaled@example.com", "Student@123"],
  ] as const) {
    const u = await db.user.findUnique({ where: { email } });
    if (!u) {
      console.log(email, "NOT FOUND");
      continue;
    }
    const ok = await bcrypt.compare(pwd, u.password);
    console.log(email, u.role, ok ? "PASSWORD OK" : "PASSWORD FAIL");
  }
  await db.$disconnect();
}

main();
