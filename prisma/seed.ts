import { PrismaClient, Role, InstructorStatus, CourseStatus, PaymentStatus, TxType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Clean the database
  await prisma.eventRegistration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.lessonProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.walletTransaction.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.instructor.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const instructorPassword = await bcrypt.hash("Instructor@123", 10);
  const studentPassword = await bcrypt.hash("Student@123", 10);

  // 1. Admin User
  const admin = await prisma.user.create({
    data: {
      name: "مدير المنصة",
      email: "admin@baytalmosawer.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // 2. Instructors (User + Instructor)
  const instructorUser1 = await prisma.user.create({
    data: {
      name: "أحمد المصور",
      email: "ahmed@baytalmosawer.com",
      password: instructorPassword,
      role: Role.INSTRUCTOR,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
  });

  const instructor1 = await prisma.instructor.create({
    data: {
      userId: instructorUser1.id,
      bio: "مصور محترف خبرة 10 سنوات في تصوير البورتريه والمناظر الطبيعية ومحاضر معتمد.",
      status: InstructorStatus.APPROVED,
      revenueShare: 70,
      walletBalance: 1200,
    },
  });

  const instructorUser2 = await prisma.user.create({
    data: {
      name: "سارة علي",
      email: "sara@baytalmosawer.com",
      password: instructorPassword,
      role: Role.INSTRUCTOR,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
  });

  const instructor2 = await prisma.instructor.create({
    data: {
      userId: instructorUser2.id,
      bio: "مصورة سينمائية ومخرجة مستقلة متخصصة في تعديل الألوان وتوزيع الإضاءة السينمائية.",
      status: InstructorStatus.APPROVED,
      revenueShare: 65,
      walletBalance: 0,
    },
  });
  console.log("Created 2 instructors");

  // 3. Courses, Sections, Lessons
  // Course 1 (Ahmed)
  const course1 = await prisma.course.create({
    data: {
      title: "أساسيات التصوير الفوتوغرافي الرقمي",
      description: "تعلم أساسيات الكاميرا والتحكم في فتحة العدسة وسرعة الغالق والـ ISO لتلتقط صوراً احترافية في مختلف ظروف الإضاءة.",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      price: 299,
      status: CourseStatus.PUBLISHED,
      instructorId: instructor1.id,
      sections: {
        create: [
          {
            title: "مقدمة عن الكاميرات والمعدات",
            order: 1,
            lessons: {
              create: [
                {
                  title: "كيف تعمل الكاميرا الرقمية؟ DS/DSLR",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 12,
                  order: 1,
                },
                {
                  title: "التعرف على أزرار الكاميرا والعدسات الأساسية",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 18,
                  order: 2,
                },
              ],
            },
          },
          {
            title: "مثلث التعريض (Exposure Triangle)",
            order: 2,
            lessons: {
              create: [
                {
                  title: "شرح فتحة العدسة (Aperture) وعمق الميدان",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 22,
                  order: 1,
                },
                {
                  title: "شرح سرعة الغالق (Shutter Speed) وتجميد الحركة",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 15,
                  order: 2,
                },
                {
                  title: "شرح حساسية الضوء (ISO) ونويز الصورة",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 14,
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 2 (Ahmed)
  const course2 = await prisma.course.create({
    data: {
      title: "تصوير البورتريه وتوزيع الإضاءة الاحترافي",
      description: "دورة متكاملة لتعلم كيفية توزيع الإضاءة الطبيعية والصناعية لإنتاج صور بورتريه مذهلة تحاكي استوديوهات التصوير العالمية.",
      thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
      price: 450,
      status: CourseStatus.PUBLISHED,
      instructorId: instructor1.id,
      sections: {
        create: [
          {
            title: "معدات إضاءة البورتريه الأساسية",
            order: 1,
            lessons: {
              create: [
                {
                  title: "أنواع العواكس والمشتتات (Diffusers)",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 25,
                  order: 1,
                },
              ],
            },
          },
          {
            title: "وضعيات الإضاءة الكلاسيكية",
            order: 2,
            lessons: {
              create: [
                {
                  title: "إضاءة ريمبراندت وتطبيقاتها الفنية",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 30,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Course 3 (Sara)
  const course3 = await prisma.course.create({
    data: {
      title: "صناعة الأفلام وتعديل الفيديو الاحترافي",
      description: "ابدأ رحلتك في صناعة الأفلام القصيرة وتعلم المونتاج وتعديل الألوان السينمائية باستخدام البرمجيات الحديثة من الصفر للاحتراف.",
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      price: 599,
      status: CourseStatus.PUBLISHED,
      instructorId: instructor2.id,
      sections: {
        create: [
          {
            title: "قواعد التكوين البصري وحركة الكاميرا",
            order: 1,
            lessons: {
              create: [
                {
                  title: "قاعدة الأثلاث والتأطير في تصوير الفيديو",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 15,
                  order: 1,
                },
                {
                  title: "حركات الكاميرا الأساسية والمتقدمة للرواية البصرية",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  duration: 22,
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log("Created 3 published courses with sections and lessons");

  // 4. Students
  const studentUser1 = await prisma.user.create({
    data: {
      name: "خالد محمد",
      email: "khaled@example.com",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      name: "منى يوسف",
      email: "mona@example.com",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  const studentUser3 = await prisma.user.create({
    data: {
      name: "عمر فاروق",
      email: "omar@example.com",
      password: studentPassword,
      role: Role.STUDENT,
    },
  });
  console.log("Created 3 students");

  // 5. Enrollments and Payments
  // Student 1 -> Enrolled in Course 1
  await prisma.enrollment.create({
    data: {
      userId: studentUser1.id,
      courseId: course1.id,
    },
  });

  await prisma.payment.create({
    data: {
      userId: studentUser1.id,
      courseId: course1.id,
      amount: 299,
      receiptUrl: "https://uploadthing-mock-receipt.pdf",
      status: PaymentStatus.APPROVED,
    },
  });

  // Student 2 -> Enrolled in Course 1 and Course 2
  await prisma.enrollment.create({
    data: {
      userId: studentUser2.id,
      courseId: course1.id,
    },
  });

  await prisma.payment.create({
    data: {
      userId: studentUser2.id,
      courseId: course1.id,
      amount: 299,
      receiptUrl: "https://uploadthing-mock-receipt.pdf",
      status: PaymentStatus.APPROVED,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: studentUser2.id,
      courseId: course2.id,
    },
  });

  await prisma.payment.create({
    data: {
      userId: studentUser2.id,
      courseId: course2.id,
      amount: 450,
      receiptUrl: "https://uploadthing-mock-receipt.pdf",
      status: PaymentStatus.APPROVED,
    },
  });

  // Student 3 -> Enrolled in Course 3
  await prisma.enrollment.create({
    data: {
      userId: studentUser3.id,
      courseId: course3.id,
    },
  });

  await prisma.payment.create({
    data: {
      userId: studentUser3.id,
      courseId: course3.id,
      amount: 599,
      receiptUrl: "https://uploadthing-mock-receipt.pdf",
      status: PaymentStatus.APPROVED,
    },
  });

  // Add instructor transactions for the approved payments
  // Course 1 (Ahmed) - Student 1: 299 * 0.70 = 209.30
  // Course 1 (Ahmed) - Student 2: 299 * 0.70 = 209.30
  // Course 2 (Ahmed) - Student 2: 450 * 0.70 = 315.00
  // Total Ahmed Wallet Balance = 209.30 + 209.30 + 315.00 = 733.60 (+ initial 1200) = 1933.60
  // Course 3 (Sara) - Student 3: 599 * 0.65 = 389.35
  // Total Sara Wallet Balance = 389.35
  
  await prisma.walletTransaction.createMany({
    data: [
      {
        instructorId: instructor1.id,
        amount: 209.30,
        type: TxType.CREDIT,
        description: `أرباح التسجيل في دورة أساسيات التصوير - الطالب خالد محمد`,
      },
      {
        instructorId: instructor1.id,
        amount: 209.30,
        type: TxType.CREDIT,
        description: `أرباح التسجيل في دورة أساسيات التصوير - الطالبة منى يوسف`,
      },
      {
        instructorId: instructor1.id,
        amount: 315.00,
        type: TxType.CREDIT,
        description: `أرباح التسجيل في دورة تصوير البورتريه - الطالبة منى يوسف`,
      },
      {
        instructorId: instructor2.id,
        amount: 389.35,
        type: TxType.CREDIT,
        description: `أرباح التسجيل في دورة صناعة الأفلام - الطالب عمر فاروق`,
      },
    ],
  });

  // Update instructor wallet balances
  await prisma.instructor.update({
    where: { id: instructor1.id },
    data: { walletBalance: 1200 + 209.30 + 209.30 + 315.00 },
  });

  await prisma.instructor.update({
    where: { id: instructor2.id },
    data: { walletBalance: 389.35 },
  });

  // 8. Sample events
  const workshop1 = await prisma.event.create({
    data: {
      title: "ورشة الإضاءة الاستوديوية العملية",
      description:
        "ورشة حضورية مكثفة لتعلّم إعداد الإضاءة الثلاثية، استخدام Softbox وReflector، وتصوير بورتريه احترافي. مناسبة للمبتدئين ومن لديهم أساسيات.",
      location: "جدة — استوديو بيت المصور",
      coverImage:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
      startsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      capacity: 20,
      status: "PUBLISHED",
      createdById: admin.id,
    },
  });

  const workshop2 = await prisma.event.create({
    data: {
      title: "لقاء المصورين — التصوير الشارعي",
      description:
        "جولة ميدانية في أحياء جدة التاريخية مع مراجعة فورية للصور وتغذية راجعة من المدرب. احضر كamerتك واستعد للتطبيق.",
      location: "جدة — البلد",
      coverImage:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop",
      startsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      capacity: 15,
      status: "PUBLISHED",
      createdById: admin.id,
    },
  });

  console.log(`Created events: ${workshop1.title}, ${workshop2.title}`);

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
