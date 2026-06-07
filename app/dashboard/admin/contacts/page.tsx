import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ContactsClient from "./ContactsClient";

export const revalidate = 0;

export default async function AdminContactsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ContactsClient initialMessages={messages} />;
}
