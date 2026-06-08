import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  formatEventDate,
  isEventFull,
  type PublicEvent,
} from "@/lib/events";

interface UpcomingEventsSectionProps {
  events: PublicEvent[];
}

export default function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section id="events" className="section-soft py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="فعاليات وورش"
            title="ورش عمل وفعاليات قادمة"
            description="انضم لجلسات عملية ميدانية ولقاءات مع مدربين المنصة."
            align="right"
            className="mb-0"
          />
          <Button href="/events" variant="outline" size="md" className="shrink-0">
            كل الفعاليات
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <Card
              key={event.id}
              variant="default"
              padding="sm"
              className="overflow-hidden p-0 transition-shadow hover:shadow-hover"
            >
              <Link href={`/events/${event.id}`} className="block">
                <div className="relative aspect-[16/10] bg-surface-section">
                  {event.coverImage ? (
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-muted">
                      <Calendar className="h-10 w-10" aria-hidden="true" />
                    </div>
                  )}
                  {isEventFull(event) ? (
                    <Badge
                      variant="danger"
                      size="sm"
                      className="absolute top-3 start-3"
                    >
                      مكتمل
                    </Badge>
                  ) : null}
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="line-clamp-2 font-bold text-[#151525] font-heading">
                    {event.title}
                  </h3>
                  <p className="flex items-start gap-2 text-xs text-text-muted font-body">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {formatEventDate(event.startsAt, event.endsAt)}
                  </p>
                  {event.location ? (
                    <p className="flex items-start gap-2 text-xs text-text-muted font-body">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {event.location}
                    </p>
                  ) : null}
                  <p className="flex items-center gap-2 text-xs text-text-secondary font-body">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {event.approvedCount}
                    {event.capacity ? ` / ${event.capacity}` : ""} مشارك
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
