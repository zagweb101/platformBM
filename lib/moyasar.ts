import { toNumber, type MoneyValue } from "@/lib/money";

export interface MoyasarPayment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export function isMoyasarConfigured() {
  return Boolean(
    process.env.MOYASAR_SECRET_KEY && process.env.MOYASAR_PUBLISHABLE_KEY
  );
}

export function getMoyasarPublishableKey() {
  return process.env.MOYASAR_PUBLISHABLE_KEY || "";
}

export async function fetchMoyasarPayment(
  paymentId: string
): Promise<MoyasarPayment | null> {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) return null;

  const response = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Moyasar fetch failed:", await response.text());
    return null;
  }

  return response.json();
}

export function halalasFromAmount(amount: MoneyValue): number {
  return Math.round(toNumber(amount) * 100);
}

export function isMoyasarPaymentPaid(payment: MoyasarPayment) {
  return payment.status === "paid" || payment.status === "captured";
}
