import { auth } from "@/auth";
import { completeMoyasarPayment } from "@/lib/complete-moyasar-payment";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const id = req.nextUrl.searchParams.get("id");
  const courseId = req.nextUrl.searchParams.get("courseId");

  if (!session?.user?.id || !id || !courseId) {
    redirect("/dashboard/student/payments?error=invalid_callback");
  }

  const result = await completeMoyasarPayment({
    moyasarPaymentId: id,
    courseId,
    userId: session.user.id,
  });

  if ("error" in result && result.error) {
    redirect(
      `/dashboard/student/payments?error=${encodeURIComponent(result.error)}`
    );
  }

  redirect("/dashboard/student?success=payment_completed");
}
