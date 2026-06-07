import { NextRequest, NextResponse } from "next/server";
import {
  handleTabbyWebhook,
  verifyTabbyRequest,
} from "@/lib/bnpl-handlers";

export async function POST(req: NextRequest) {
  const authHeader =
    req.headers.get("x-tabby-signature") ||
    req.headers.get("authorization") ||
    req.headers.get("x-webhook-auth") ||
    null;

  if (!verifyTabbyRequest(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await handleTabbyWebhook(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Tabby webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
