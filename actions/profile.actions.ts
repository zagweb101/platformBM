"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().optional(),
  bio: z.string().max(500, "النبذة طويلة جداً").optional(),
  image: z.string().url().optional().or(z.literal("")),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(6, "كلمة المرور الجديدة 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export async function updateProfile(values: z.infer<typeof ProfileSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "يرجى تسجيل الدخول." };
  }

  const parsed = ProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { name, phone, bio, image } = parsed.data;

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone: phone?.trim() || null,
        bio: bio?.trim() || null,
        image: image || null,
      },
    });

    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/student/settings");
    revalidatePath("/dashboard/instructor/settings");
    revalidatePath("/dashboard/instructor");
    return { success: "تم حفظ الملف الشخصي." };
  } catch {
    return { error: "تعذّر حفظ البيانات." };
  }
}

export async function changePassword(values: z.infer<typeof PasswordSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "يرجى تسجيل الدخول." };
  }

  const parsed = PasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "المستخدم غير موجود." };

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return { error: "كلمة المرور الحالية غير صحيحة." };

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { success: "تم تغيير كلمة المرور بنجاح." };
  } catch {
    return { error: "تعذّر تغيير كلمة المرور." };
  }
}

export async function getProfileData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      image: true,
      role: true,
    },
  });
}
