import { db } from "@/lib/db";
import type { EventRegistrationStatus, EventStatus } from "@prisma/client";

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
  capacity: number | null;
  status: EventStatus;
  _count: { registrations: number };
  approvedCount: number;
};

export type EventDetail = PublicEvent & {
  createdBy: { name: string };
};

export type EventRegistrationItem = {
  id: string;
  status: EventRegistrationStatus;
  note: string | null;
  createdAt: Date;
  event: {
    id: string;
    title: string;
    startsAt: Date;
    location: string | null;
    coverImage: string | null;
  };
};

function serializeEvent(
  event: {
    id: string;
    title: string;
    description: string;
    coverImage: string | null;
    location: string | null;
    startsAt: Date;
    endsAt: Date | null;
    capacity: number | null;
    status: EventStatus;
    _count: { registrations: number };
    registrations?: { status: EventRegistrationStatus }[];
  },
  createdBy?: { name: string }
): PublicEvent | EventDetail {
  const approvedCount =
    event.registrations?.filter((r) => r.status === "APPROVED").length ?? 0;

  const base = {
    id: event.id,
    title: event.title,
    description: event.description,
    coverImage: event.coverImage,
    location: event.location,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    capacity: event.capacity,
    status: event.status,
    _count: event._count,
    approvedCount,
  };

  if (createdBy) {
    return { ...base, createdBy };
  }

  return base;
}

export async function getPublishedEvents(limit?: number) {
  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      startsAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { startsAt: "asc" },
    take: limit,
    include: {
      _count: { select: { registrations: true } },
      registrations: { select: { status: true } },
    },
  });

  return events.map((e) => serializeEvent(e) as PublicEvent);
}

export async function getAllPublishedEvents() {
  const events = await db.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startsAt: "asc" },
    include: {
      _count: { select: { registrations: true } },
      registrations: { select: { status: true } },
    },
  });

  return events.map((e) => serializeEvent(e) as PublicEvent);
}

export async function getEventById(id: string) {
  const event = await db.event.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { registrations: true } },
      registrations: { select: { status: true } },
    },
  });

  if (!event) return null;
  return serializeEvent(event, event.createdBy) as EventDetail;
}

export async function getUserEventRegistration(eventId: string, userId: string) {
  return db.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });
}

export async function getUserRegistrations(userId: string) {
  const rows = await db.eventRegistration.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          location: true,
          coverImage: true,
        },
      },
    },
  });

  return rows as EventRegistrationItem[];
}

export async function getAdminEvents() {
  return db.event.findMany({
    orderBy: { startsAt: "desc" },
    include: {
      createdBy: { select: { name: true } },
      _count: { select: { registrations: true } },
      registrations: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export function formatEventDate(startsAt: Date, endsAt?: Date | null) {
  const start = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(startsAt);

  if (!endsAt) return start;

  const endTime = new Intl.DateTimeFormat("ar-SA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(endsAt);

  return `${start} — ${endTime}`;
}

export function getRegistrationStatusLabel(status: EventRegistrationStatus) {
  switch (status) {
    case "PENDING":
      return "قيد المراجعة";
    case "APPROVED":
      return "مقبول";
    case "REJECTED":
      return "مرفوض";
  }
}

export function isEventFull(event: PublicEvent) {
  if (!event.capacity) return false;
  return event.approvedCount >= event.capacity;
}
