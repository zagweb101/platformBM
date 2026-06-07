import { db } from "@/lib/db";
import { getCourseProgress } from "@/lib/course-progress";
import { sendCertificateEmail } from "@/lib/email";

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BM-${year}-${rand}`;
}

export async function issueCertificateIfEligible(userId: string, courseId: string) {
  const progress = await getCourseProgress(userId, courseId);
  if (!progress?.isComplete) {
    return { skipped: true as const };
  }

  const existing = await db.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      user: true,
      course: { include: { instructor: { include: { user: true } } } },
    },
  });

  if (existing) {
    return { certificate: existing, alreadyIssued: true as const };
  }

  const certificate = await db.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber: generateCertificateNumber(),
    },
    include: {
      user: true,
      course: { include: { instructor: { include: { user: true } } } },
    },
  });

  if (certificate.user.email) {
    await sendCertificateEmail(
      certificate.user.email,
      certificate.user.name,
      certificate.course.title,
      certificate.certificateNumber
    );
  }

  return { certificate, issued: true as const };
}
