import { Resend } from "resend";
import { getAppUrl } from "@/lib/app-url";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.EMAIL_FROM || "بيت المصور <noreply@baytalmosawer.com>";

let resend: Resend | null = null;

function getResend() {
  if (!resendApiKey) return null;
  if (!resend) {
    resend = new Resend(resendApiKey);
  }
  return resend;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const client = getResend();

  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to:", to);
    if (process.env.NODE_ENV === "development") {
      console.log("[email:dev]", { to, subject });
    }
    return { success: true as const, skipped: true as const };
  }

  try {
    const { error } = await client.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: "فشل إرسال البريد الإلكتروني." };
    }

    return { success: true as const };
  } catch (error) {
    console.error("Email send error:", error);
    return { error: "فشل إرسال البريد الإلكتروني." };
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendEmail({
    to: email,
    subject: "إعادة تعيين كلمة المرور — بيت المصور",
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">بيت المصور</h2>
        <p>تلقّينا طلباً لإعادة تعيين كلمة المرور لحسابك.</p>
        <p>اضغط الزر أدناه لإنشاء كلمة مرور جديدة. الرابط صالح لمدة ساعة واحدة.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">
            إعادة تعيين كلمة المرور
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">إذا لم تطلب ذلك، تجاهل هذه الرسالة.</p>
      </div>
    `,
  });
}

export async function sendPaymentApprovedEmail(
  email: string,
  courseTitle: string
) {
  return sendEmail({
    to: email,
    subject: "تم تفعيل اشتراكك — بيت المصور",
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">تم تفعيل دورتك!</h2>
        <p>مرحباً،</p>
        <p>تمت الموافقة على دفعتك وتفعيل اشتراكك في دورة:</p>
        <p style="font-weight: bold; font-size: 18px;">${courseTitle}</p>
        <p>يمكنك البدء بالتعلم الآن من لوحة الطالب.</p>
        <p style="margin: 24px 0;">
          <a href="${getAppUrl()}/dashboard/student" style="background: #4F46E5; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">
            الذهاب لدوراتي
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendCertificateEmail(
  email: string,
  studentName: string,
  courseTitle: string,
  certificateNumber: string
) {
  const baseUrl = getAppUrl();

  return sendEmail({
    to: email,
    subject: "تهانينا! شهادتك جاهزة — بيت المصور",
    html: `
      <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">مبروك ${studentName}!</h2>
        <p>أكملت بنجاح دورة:</p>
        <p style="font-weight: bold; font-size: 18px;">${courseTitle}</p>
        <p>رقم الشهادة: <strong>${certificateNumber}</strong></p>
        <p style="margin: 24px 0;">
          <a href="${baseUrl}/dashboard/student" style="background: #4F46E5; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">
            عرض شهادتي
          </a>
        </p>
      </div>
    `,
  });
}
