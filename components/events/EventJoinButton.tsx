"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { joinEvent } from "@/actions/event.actions";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { EventRegistrationStatus } from "@prisma/client";
import { getRegistrationStatusLabel, isEventFull, type EventDetail } from "@/lib/events";

interface EventJoinButtonProps {
  event: EventDetail;
  isLoggedIn: boolean;
  userRole?: string;
  registration?: { status: EventRegistrationStatus } | null;
}

export default function EventJoinButton({
  event,
  isLoggedIn,
  userRole,
  registration,
}: EventJoinButtonProps) {
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (event.status !== "PUBLISHED") {
    return (
      <p className="text-sm text-text-muted font-body">هذه الفعالية غير متاحة حالياً.</p>
    );
  }

  if (registration) {
    return (
      <div className="space-y-3">
        <p className="rounded-md border border-border-default bg-surface-section px-4 py-3 text-sm font-semibold text-[#151525] font-body">
          حالة طلبك: {getRegistrationStatusLabel(registration.status)}
        </p>
        {registration.status === "REJECTED" ? (
          <>
            {showNote ? (
              <div className="space-y-3">
                <Textarea
                  label="رسالة للمنظم (اختياري)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
                <Button
                  variant="primary"
                  size="md"
                  loading={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await joinEvent(event.id, note);
                      if (res.error) toast.error(res.error);
                      else {
                        toast.success(res.success);
                        router.refresh();
                      }
                    })
                  }
                >
                  إعادة التقديم
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="md" onClick={() => setShowNote(true)}>
                إعادة التقديم
              </Button>
            )}
          </>
        ) : null}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Button
        href={`/login?callbackUrl=${encodeURIComponent(`/events/${event.id}`)}`}
        variant="primary"
        size="lg"
      >
        سجّل الدخول للانضمام
      </Button>
    );
  }

  if (userRole !== "STUDENT") {
    return (
      <p className="text-sm text-text-secondary font-body">
        الانضمام للفعاليات متاح لحسابات الطلاب.
      </p>
    );
  }

  if (isEventFull(event)) {
    return (
      <Button variant="outline" size="lg" disabled>
        اكتمل عدد المقاعد
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <Textarea
        label="رسالة للمنظم (اختياري)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        hint="مثال: خبرتي السابقة أو سبب رغبتك بالحضور"
      />
      <Button
        variant="primary"
        size="lg"
        loading={isPending}
        className="w-full sm:w-auto"
        onClick={() =>
          startTransition(async () => {
            const res = await joinEvent(event.id, note);
            if (res.error) toast.error(res.error);
            else {
              toast.success(res.success);
              router.refresh();
            }
          })
        }
      >
        طلب الانضمام
      </Button>
    </div>
  );
}
