"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Check,
  X,
  Users,
} from "lucide-react";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  approveEventRegistration,
  rejectEventRegistration,
} from "@/actions/event.actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { formatEventDate, getRegistrationStatusLabel } from "@/lib/events";
import type { EventRegistrationStatus, EventStatus } from "@prisma/client";

type RegistrationRow = {
  id: string;
  status: EventRegistrationStatus;
  note: string | null;
  createdAt: Date;
  user: { id: string; name: string; email: string; phone: string | null };
};

type AdminEvent = {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  location: string | null;
  startsAt: Date;
  endsAt: Date | null;
  capacity: number | null;
  status: EventStatus;
  registrations: RegistrationRow[];
  _count: { registrations: number };
};

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const emptyForm = {
  title: "",
  description: "",
  location: "",
  coverImage: "",
  startsAt: "",
  endsAt: "",
  capacity: "",
  status: "DRAFT" as EventStatus,
};

function statusBadge(status: EventStatus) {
  switch (status) {
    case "PUBLISHED":
      return <Badge variant="success" size="sm">منشور</Badge>;
    case "CANCELLED":
      return <Badge variant="danger" size="sm">ملغى</Badge>;
    default:
      return <Badge variant="warning" size="sm">مسودة</Badge>;
  }
}

export default function AdminEventsClient({
  initialEvents,
}: {
  initialEvents: AdminEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [processingRegId, setProcessingRegId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (event: AdminEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location ?? "",
      coverImage: event.coverImage ?? "",
      startsAt: toLocalDatetimeValue(new Date(event.startsAt)),
      endsAt: event.endsAt ? toLocalDatetimeValue(new Date(event.endsAt)) : "",
      capacity: event.capacity ? String(event.capacity) : "",
      status: event.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const payload = {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      };
      const res = editingId
        ? await updateEvent(editingId, payload)
        : await createEvent(payload);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success(res.success);
      setModalOpen(false);
      window.location.reload();
    });
  };

  const handleDelete = (eventId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفعالية؟")) return;
    startTransition(async () => {
      const res = await deleteEvent(eventId);
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.success);
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      }
    });
  };

  const handleRegistration = (id: string, action: "approve" | "reject") => {
    setProcessingRegId(id);
    startTransition(async () => {
      const res =
        action === "approve"
          ? await approveEventRegistration(id)
          : await rejectEventRegistration(id);
      setProcessingRegId(null);
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.success);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6 admin-form-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-text-primary font-heading">إدارة الفعاليات</h2>
          <p className="text-sm text-text-secondary font-body">
            إنشاء وتعديل الفعاليات ومراجعة طلبات الانضمام.
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          فعالية جديدة
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="rounded-lg border border-subtle bg-card p-8 text-center text-text-muted font-body">
          لا توجد فعاليات. أنشئ أول فعالية.
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-lg border border-subtle bg-card"
            >
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-secondary sm:h-20 sm:w-32">
                  {event.coverImage ? (
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Calendar className="h-8 w-8 text-text-muted" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-text-primary font-heading">
                      {event.title}
                    </h3>
                    {statusBadge(event.status)}
                  </div>
                  <p className="text-sm text-text-secondary font-body line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-text-muted font-body">
                    {formatEventDate(event.startsAt, event.endsAt)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-text-muted font-body">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    {event._count.registrations} طلب انضمام
                    {event.capacity ? ` · السعة: ${event.capacity}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Pencil className="h-4 w-4" />}
                    onClick={() => openEdit(event)}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleDelete(event.id)}
                  >
                    حذف
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setExpandedId(expandedId === event.id ? null : event.id)
                    }
                  >
                    الطلبات ({event.registrations.length})
                  </Button>
                </div>
              </div>

              {expandedId === event.id ? (
                <div className="border-t border-subtle bg-secondary/30 p-4">
                  {event.registrations.length === 0 ? (
                    <p className="text-sm text-text-muted font-body">لا توجد طلبات بعد.</p>
                  ) : (
                    <ul className="space-y-3">
                      {event.registrations.map((reg) => (
                        <li
                          key={reg.id}
                          className="rounded-md border border-subtle bg-white p-4"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-semibold text-text-primary font-body">
                                {reg.user.name}
                              </p>
                              <p className="text-xs text-text-muted font-body">
                                {reg.user.email}
                                {reg.user.phone ? ` · ${reg.user.phone}` : ""}
                              </p>
                              {reg.note ? (
                                <p className="mt-2 text-sm text-text-secondary font-body">
                                  {reg.note}
                                </p>
                              ) : null}
                              <p className="mt-1 text-xs font-semibold text-brand-violet-600 font-body">
                                {getRegistrationStatusLabel(reg.status)}
                              </p>
                            </div>
                            {reg.status === "PENDING" ? (
                              <div className="flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  loading={processingRegId === reg.id}
                                  icon={<Check className="h-4 w-4" />}
                                  onClick={() => handleRegistration(reg.id, "approve")}
                                >
                                  قبول
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  icon={<X className="h-4 w-4" />}
                                  onClick={() => handleRegistration(reg.id, "reject")}
                                >
                                  رفض
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-hover">
            <h3 className="mb-4 text-lg font-bold text-[#151525] font-heading">
              {editingId ? "تعديل الفعالية" : "فعالية جديدة"}
            </h3>
            <div className="space-y-4">
              <Input
                label="العنوان"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                label="الوصف"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
              <Input
                label="المكان"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <Input
                label="رابط صورة الغلاف"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                hint="رابط URL لصورة Unsplash أو UploadThing"
              />
              <Input
                label="تاريخ البداية"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
              <Input
                label="تاريخ النهاية (اختياري)"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              />
              <Input
                label="السعة (اختياري)"
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              <Select
                label="الحالة"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as EventStatus })
                }
                options={[
                  { value: "DRAFT", label: "مسودة" },
                  { value: "PUBLISHED", label: "منشور" },
                  { value: "CANCELLED", label: "ملغى" },
                ]}
              />
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="primary" size="md" loading={isPending} onClick={handleSave}>
                حفظ
              </Button>
              <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
