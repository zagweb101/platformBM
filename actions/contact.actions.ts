"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ContactStatus } from "@prisma/client";

const ContactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  subject: z.string().min(2, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة قصيرة جداً"),
});

export async function submitContactForm(values: z.infer<typeof ContactSchema>) {
  const parsed = ContactSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "بيانات غير صالحة." };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await db.contactMessage.create({
      data: { name, email, subject, message },
    });

    const adminEmail =
      process.env.CONTACT_ADMIN_EMAIL || process.env.EMAIL_FROM || "info@baytalmosawer.com";

    // Email is best-effort; message is always saved in admin inbox
    await sendEmail({
      to: adminEmail,
      subject: `[بيت المصور] ${subject}`,
      html: `
        <div dir="rtl" style="font-family:Tahoma,sans-serif">
          <h2>رسالة تواصل جديدة</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>البريد:</strong> ${email}</p>
          <p><strong>الموضوع:</strong> ${subject}</p>
          <p><strong>الرسالة:</strong></p>
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    }).catch(() => null);

    await sendEmail({
      to: email,
      subject: "تم استلام رسالتك — بيت المصور",
      html: `
        <div dir="rtl" style="font-family:Tahoma,sans-serif">
          <p>مرحباً ${name}،</p>
          <p>شكراً لتواصلك مع بيت المصور. استلمنا رسالتك بخصوص «${subject}» وسنرد عليك قريباً.</p>
        </div>
      `,
    }).catch(() => null);

    return { success: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "حدث خطأ أثناء إرسال الرسالة." };
  }
}

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "غير مصرح." as const };
  }
  return { session };
}

export async function getContactMessages() {
  const access = await assertAdmin();
  if ("error" in access) return access;

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { messages };
}

export async function updateContactMessageStatus(id: string, status: ContactStatus) {
  const access = await assertAdmin();
  if ("error" in access) return access;

  try {
    await db.contactMessage.update({ where: { id }, data: { status } });
    revalidatePath("/dashboard/admin/contacts");
    return { success: "تم تحديث حالة الرسالة." };
  } catch {
    return { error: "تعذّر تحديث الرسالة." };
  }
}
