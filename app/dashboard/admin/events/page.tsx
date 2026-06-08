import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAdminEvents } from "@/lib/events";
import AdminEventsClient from "./AdminEventsClient";

export const metadata = {
  title: "إدارة الفعاليات | بيت المصور",
};

export default async function AdminEventsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const events = await getAdminEvents();

  return <AdminEventsClient initialEvents={events} />;
}
