import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking users...");
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users:`);
  console.log(users.map(u => ({ id: u.id, name: u.name, role: u.role, email: u.email })));

  console.log("\nChecking instructors...");
  const instructors = await prisma.instructor.findMany({
    include: { user: true }
  });
  console.log(`Found ${instructors.length} instructors:`);
  console.log(instructors.map(i => ({ id: i.id, userId: i.userId, name: i.user?.name, status: i.status })));

  console.log("\nChecking courses...");
  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        include: {
          user: true
        }
      }
    }
  });
  console.log(`Found ${courses.length} courses:`);
  for (const c of courses) {
    console.log({
      id: c.id,
      title: c.title,
      status: c.status,
      instructorId: c.instructorId,
      instructorExists: !!c.instructor,
      userExists: !!c.instructor?.user,
      userName: c.instructor?.user?.name
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
