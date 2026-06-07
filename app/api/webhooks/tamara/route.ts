import { NextRequest, NextResponse } from "next/server";
import {
  handleTamaraWebhook,
  verifyTamaraRequest,
} from "@/lib/bnpl-handlers";

export async function POST(req: NextRequest) {
  const token =
    req.nextUrl.searchParams.get("tamaraToken") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    null;

  const isValid = await verifyTamaraRequest(token);
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await handleTamaraWebhook(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Tamara webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
