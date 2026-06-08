"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(3, "العنوان قصير جداً"),
  description: z.string().min(20, "الوصف يجب أن يكون 20 حرفاً على الأقل"),
  location: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  startsAt: z.string().min(1, "تاريخ البداية مطلوب"),
  endsAt: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional().or(z.literal(0)),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),
});

function parseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("تاريخ غير صالح");
  }
  return date;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "غير مصرح. هذا الإجراء للمدير فقط." as const, session: null };
  }
  return { error: null, session };
}

async function requireStudent() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "يرجى تسجيل الدخول أولاً." as const, session: null };
  }
  if (session.user.role !== "STUDENT") {
    return { error: "الانضمام للفعاليات متاح للطلاب فقط." as const, session: null };
  }
  return { error: null, session };
}

export async function createEvent(values: z.infer<typeof EventSchema>) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };

  const parsed = EventSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { title, description, location, coverImage, startsAt, endsAt, capacity, status } =
    parsed.data;

  try {
    const event = await db.event.create({
      data: {
        title,
        description,
        location: location || null,
        coverImage: coverImage || null,
        startsAt: parseDate(startsAt),
        endsAt: endsAt ? parseDate(endsAt) : null,
        capacity: capacity && capacity > 0 ? capacity : null,
        status: status ?? "DRAFT",
        createdById: admin.session!.user.id,
      },
    });

    revalidatePath("/dashboard/admin/events");
    revalidatePath("/events");
    revalidatePath("/");
    return { success: "تم إنشاء الفعالية", eventId: event.id };
  } catch {
    return { error: "تعذّر إنشاء الفعالية." };
  }
}

export async function updateEvent(eventId: string, values: z.infer<typeof EventSchema>) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };

  const parsed = EventSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { title, description, location, coverImage, startsAt, endsAt, capacity, status } =
    parsed.data;

  try {
    await db.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        location: location || null,
        coverImage: coverImage || null,
        startsAt: parseDate(startsAt),
        endsAt: endsAt ? parseDate(endsAt) : null,
        capacity: capacity && capacity > 0 ? capacity : null,
        ...(status ? { status } : {}),
      },
    });

    revalidatePath("/dashboard/admin/events");
    revalidatePath(`/events/${eventId}`);
    revalidatePath("/events");
    revalidatePath("/");
    return { success: "تم تحديث الفعالية" };
  } catch {
    return { error: "تعذّر تحديث الفعالية." };
  }
}

export async function deleteEvent(eventId: string) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };

  try {
    await db.event.delete({ where: { id: eventId } });
    revalidatePath("/dashboard/admin/events");
    revalidatePath("/events");
    revalidatePath("/");
    return { success: "تم حذف الفعالية" };
  } catch {
    return { error: "تعذّر حذف الفعالية." };
  }
}

export async function joinEvent(eventId: string, note?: string) {
  const student = await requireStudent();
  if (student.error) return { error: student.error };

  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: { where: { status: "APPROVED" } },
      },
    });

    if (!event || event.status !== "PUBLISHED") {
      return { error: "الفعالية غير متاحة للانضمام." };
    }

    if (event.capacity && event.registrations.length >= event.capacity) {
      return { error: "اكتمل عدد المقاعد في هذه الفعالية." };
    }

    const existing = await db.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId, userId: student.session!.user.id },
      },
    });

    if (existing) {
      if (existing.status === "REJECTED") {
        await db.eventRegistration.update({
          where: { id: existing.id },
          data: { status: "PENDING", note: note || null },
        });
        revalidatePath(`/events/${eventId}`);
        revalidatePath("/dashboard/student/events");
        return { success: "تم إعادة إرسال طلب الانضمام." };
      }
      return { error: "لديك طلب انضمام مسجّل مسبقاً." };
    }

    await db.eventRegistration.create({
      data: {
        eventId,
        userId: student.session!.user.id,
        note: note || null,
        status: "PENDING",
      },
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath("/dashboard/student/events");
    revalidatePath("/dashboard/admin/events");
    return { success: "تم إرسال طلب الانضمام. سيتم إشعارك عند المراجعة." };
  } catch {
    return { error: "تعذّر إرسال طلب الانضمام." };
  }
}

export async function approveEventRegistration(registrationId: string) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };

  try {
    const registration = await db.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          include: { registrations: { where: { status: "APPROVED" } } },
        },
      },
    });

    if (!registration) return { error: "الطلب غير موجود." };

    if (
      registration.event.capacity &&
      registration.event.registrations.length >= registration.event.capacity
    ) {
      return { error: "اكتمل عدد المقاعد." };
    }

    await db.eventRegistration.update({
      where: { id: registrationId },
      data: { status: "APPROVED" },
    });

    revalidatePath("/dashboard/admin/events");
    revalidatePath(`/events/${registration.eventId}`);
    revalidatePath("/dashboard/student/events");
    return { success: "تم قبول الطلب" };
  } catch {
    return { error: "تعذّر قبول الطلب." };
  }
}

export async function rejectEventRegistration(registrationId: string) {
  const admin = await requireAdmin();
  if (admin.error) return { error: admin.error };

  try {
    const registration = await db.eventRegistration.update({
      where: { id: registrationId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/dashboard/admin/events");
    revalidatePath(`/events/${registration.eventId}`);
    revalidatePath("/dashboard/student/events");
    return { success: "تم رفض الطلب" };
  } catch {
    return { error: "تعذّر رفض الطلب." };
  }
}
