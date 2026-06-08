import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserRegistrations, getRegistrationStatusLabel, formatEventDate } from "@/lib/events";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "فعالياتي | بيت المصور",
};

function statusVariant(status: string) {
  if (status === "APPROVED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
}

export default async function StudentEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const registrations = await getUserRegistrations(session.user.id);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#151525] font-heading sm:text-3xl">
            فعالياتي
          </h1>
          <p className="mt-1 text-sm text-text-secondary font-body">
            طلبات الانضمام للورش والفعاليات.
          </p>
        </div>
        <Button href="/events" variant="outline" size="md">
          استكشف الفعاليات
        </Button>
      </header>

      {registrations.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <p className="font-semibold text-[#151525] font-heading">لم تنضم لأي فعالية بعد</p>
          <p className="mt-2 text-sm text-text-secondary font-body">
            تصفّح الفعاليات القادمة وقدّم طلب الانضمام.
          </p>
          <Button href="/events" variant="primary" size="md" className="mt-4">
            عرض الفعاليات
          </Button>
        </Card>
      ) : (
        <ul className="space-y-4">
          {registrations.map((reg) => (
            <li key={reg.id}>
              <Card variant="default" padding="md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/events/${reg.event.id}`}
                      className="text-lg font-bold text-[#151525] hover:text-brand-violet-600 font-heading"
                    >
                      {reg.event.title}
                    </Link>
                    <p className="mt-1 text-sm text-text-muted font-body">
                      {formatEventDate(reg.event.startsAt)}
                      {reg.event.location ? ` · ${reg.event.location}` : ""}
                    </p>
                  </div>
                  <Badge variant={statusVariant(reg.status)} size="md">
                    {getRegistrationStatusLabel(reg.status)}
                  </Badge>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
