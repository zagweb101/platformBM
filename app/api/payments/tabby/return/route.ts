import { auth } from "@/auth";
import { verifyTabbyReturnPayment } from "@/lib/bnpl-handlers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const status = req.nextUrl.searchParams.get("status");
  const paymentId = req.nextUrl.searchParams.get("payment_id");

  if (status === "cancel") {
    redirect("/dashboard/student/payments?error=" + encodeURIComponent("تم إلغاء الدفع عبر تابي."));
  }

  if (status === "failure") {
    redirect("/dashboard/student/payments?error=" + encodeURIComponent("فشلت عملية الدفع عبر تابي."));
  }

  if (!paymentId) {
    redirect("/dashboard/student/payments?success=tabby_pending");
  }

  const result = await verifyTabbyReturnPayment(paymentId);

  if ("error" in result && result.error) {
    redirect(`/dashboard/student/payments?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/dashboard/student?success=payment_completed");
}
