import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, ChevronLeft } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import EventJoinButton from "@/components/events/EventJoinButton";
import { auth } from "@/auth";
import {
  formatEventDate,
  getEventById,
  getUserEventRegistration,
  type EventDetail,
} from "@/lib/events";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return { title: "فعالية غير موجودة | بيت المصور" };
  return { title: `${event.title} | بيت المصور`, description: event.description };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event || event.status === "DRAFT") {
    notFound();
  }

  const session = await auth();
  const registration =
    session?.user?.id
      ? await getUserEventRegistration(id, session.user.id)
      : null;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسار التنقل" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-body text-text-secondary">
              <li>
                <Link href="/" className="hover:text-brand-violet-600">
                  الرئيسية
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </li>
              <li>
                <Link href="/events" className="hover:text-brand-violet-600">
                  الفعاليات
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </li>
              <li className="line-clamp-1 font-semibold text-[#151525]">{event.title}</li>
            </ol>
          </nav>

          <article className="space-y-8">
            <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-surface-section">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">
                  <Calendar className="h-16 w-16" aria-hidden="true" />
                </div>
              )}
              {event.status === "CANCELLED" ? (
                <Badge variant="danger" size="md" className="absolute top-4 start-4">
                  ملغاة
                </Badge>
              ) : null}
            </div>

            <header className="space-y-4">
              <h1 className="text-section font-heading font-bold text-[#151525]">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary font-body">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {formatEventDate(event.startsAt, event.endsAt)}
                </span>
                {event.location ? (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {event.location}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {event.approvedCount}
                  {event.capacity ? ` / ${event.capacity}` : ""} مشارك
                </span>
              </div>
            </header>

            <div className="prose prose-neutral max-w-none">
              <p className="whitespace-pre-wrap text-body text-text-secondary font-body leading-relaxed">
                {event.description}
              </p>
            </div>

            <Card variant="bordered" padding="lg">
              <h2 className="mb-4 text-lg font-bold text-[#151525] font-heading">
                الانضمام للفعالية
              </h2>
              <EventJoinButton
                event={event as EventDetail}
                isLoggedIn={Boolean(session?.user)}
                userRole={session?.user?.role}
                registration={registration}
              />
            </Card>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
