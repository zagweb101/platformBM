import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatEventDate,
  isEventFull,
  type PublicEvent,
} from "@/lib/events";

interface EventsPageClientProps {
  events: PublicEvent[];
}

export default function EventsPageClient({ events }: EventsPageClientProps) {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="فعاليات وورش"
        title="جميع الفعاليات القادمة"
        description="ورش عملية، لقاءات، وجلسات ميدانية مع مدربي بيت المصور."
        align="right"
      />

      {events.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <p className="text-lg font-semibold text-[#151525] font-heading">
            لا توجد فعاليات منشورة حالياً
          </p>
          <p className="mt-2 text-sm text-text-secondary font-body">
            تابعنا لمعرفة الورش والفعاليات القادمة.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-brand-violet-600 hover:underline font-body"
          >
            العودة للرئيسية
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
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
                    <Badge variant="danger" size="sm" className="absolute top-3 start-3">
                      مكتمل
                    </Badge>
                  ) : null}
                </div>
                <div className="space-y-3 p-4">
                  <h2 className="line-clamp-2 text-lg font-bold text-[#151525] font-heading">
                    {event.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-text-secondary font-body">
                    {event.description}
                  </p>
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
      )}
    </div>
  );
}
