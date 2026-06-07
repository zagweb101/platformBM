"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { sendPasswordResetEmail } from "@/lib/email";

const RequestResetSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export async function requestPasswordReset(values: z.infer<typeof RequestResetSchema>) {
  const parsed = RequestResetSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "البريد الإلكتروني غير صالح." };
  }

  const { email } = parsed.data;

  try {
    const user = await db.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success:
          "إذا كان البريد مسجلاً لدينا، ستصلك رسالة لإعادة تعيين كلمة المرور.",
      };
    }

    await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    return {
      success:
        "إذا كان البريد مسجلاً لدينا، ستصلك رسالة لإعادة تعيين كلمة المرور.",
    };
  } catch (error) {
    console.error("Request password reset error:", error);
    return { error: "حدث خطأ أثناء معالجة الطلب." };
  }
}

export async function resetPassword(values: z.infer<typeof ResetPasswordSchema>) {
  const parsed = ResetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "البيانات المدخلة غير صالحة." };
  }

  const { token, password } = parsed.data;

  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return { error: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({ where: { id: resetToken.id } }),
    ]);

    return { success: "تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن." };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "حدث خطأ أثناء إعادة تعيين كلمة المرور." };
  }
}
