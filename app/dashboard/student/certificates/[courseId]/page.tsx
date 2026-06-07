import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PrintCertificateButton from "./PrintCertificateButton";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const certificate = await db.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
    include: {
      user: true,
      course: {
        include: {
          instructor: { include: { user: true } },
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 print:hidden">
        <Link
          href="/dashboard/student"
          className="p-2 rounded-xl border border-subtle bg-card hover:bg-secondary"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <PrintCertificateButton />
      </div>

      <div
        id="certificate"
        className="relative overflow-hidden rounded-3xl border-2 border-brand-indigo/30 bg-gradient-to-br from-[#0f0f1a] via-[#12121f] to-[#0a0a0f] p-10 sm:p-14 text-center shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#4F46E5,transparent_50%)]" />
        <div className="relative space-y-6">
          <p className="text-sm font-bold tracking-widest text-brand-fuchsia uppercase">
            بيت المصور — Bayt Al-Mosawer
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-cairo">
            شهادة إتمام
          </h1>
          <p className="text-text-secondary text-sm">يشهد بأن</p>
          <p className="text-2xl sm:text-3xl font-black text-brand-indigo font-cairo">
            {certificate.user.name}
          </p>
          <p className="text-text-secondary text-sm">قد أتم بنجاح دورة</p>
          <p className="text-xl sm:text-2xl font-bold text-white font-cairo max-w-xl mx-auto leading-relaxed">
            {certificate.course.title}
          </p>
          <p className="text-xs text-text-muted">
            بإشراف المدرب: {certificate.course.instructor.user.name}
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-6 text-xs text-text-secondary">
            <div>
              <p className="text-text-muted mb-1">تاريخ الإصدار</p>
              <p className="font-almarai font-bold text-text-primary">{issuedDate}</p>
            </div>
            <div>
              <p className="text-text-muted mb-1">رقم الشهادة</p>
              <p className="font-almarai font-bold text-brand-violet" dir="ltr">
                {certificate.certificateNumber}
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-subtle/40 mt-8">
            <p className="text-[10px] text-text-muted">
              هذه الشهادة صادرة إلكترونياً من منصة بيت المصور ويمكن التحقق منها برقم الشهادة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
