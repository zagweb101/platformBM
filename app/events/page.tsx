import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import EventsPageClient from "@/components/events/EventsPageClient";
import { getAllPublishedEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الفعاليات | بيت المصور",
  description: "ورش عمل وفعاليات بيت المصور في التصوير وصناعة الأفلام.",
};

export default async function EventsPage() {
  const events = await getAllPublishedEvents();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EventsPageClient events={events} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
