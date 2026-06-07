import { auth } from "@/auth";
import { verifyTamaraReturnOrder } from "@/lib/bnpl-handlers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const status = req.nextUrl.searchParams.get("status");
  const orderId =
    req.nextUrl.searchParams.get("orderId") ||
    req.nextUrl.searchParams.get("order_id");

  if (status === "cancel") {
    redirect("/dashboard/student/payments?error=" + encodeURIComponent("تم إلغاء الدفع عبر تمارا."));
  }

  if (status === "failure") {
    redirect("/dashboard/student/payments?error=" + encodeURIComponent("فشلت عملية الدفع عبر تمارا."));
  }

  if (!orderId) {
    redirect("/dashboard/student/payments?success=tamara_pending");
  }

  const result = await verifyTamaraReturnOrder(orderId);

  if ("error" in result && result.error) {
    redirect(`/dashboard/student/payments?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/dashboard/student?success=payment_completed");
}
