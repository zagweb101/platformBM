import { toNumber, type MoneyValue } from "@/lib/money";
import { formatTamaraPhone, splitName } from "@/lib/tamara";

const DEFAULT_API_URL = "https://api.tabby.sa";

export interface TabbyCheckoutResponse {
  id: string;
  status: string;
  configuration: {
    available_products?: Record<string, unknown>;
    products?: {
      installments?: {
        web_url?: string;
        rejection_reason?: string;
      };
    };
  };
  payment?: {
    id: string;
    status: string;
  };
}

export interface TabbyPayment {
  id: string;
  status: string;
  amount: string;
  currency: string;
  order: {
    reference_id: string;
  };
}

export function isTabbyConfigured() {
  return Boolean(
    process.env.TABBY_SECRET_KEY && process.env.TABBY_MERCHANT_CODE
  );
}

function getTabbyApiUrl() {
  return process.env.TABBY_API_URL || DEFAULT_API_URL;
}

function getTabbyHeaders() {
  const secretKey = process.env.TABBY_SECRET_KEY;
  if (!secretKey) throw new Error("Tabby secret key not configured");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };

  if (process.env.TABBY_MERCHANT_CODE) {
    headers["X-Merchant-Code"] = process.env.TABBY_MERCHANT_CODE;
  }

  return headers;
}

export function formatTabbyAmount(amount: MoneyValue) {
  return toNumber(amount).toFixed(2);
}

export async function createTabbyCheckoutSession({
  paymentId,
  courseTitle,
  courseId,
  amount,
  user,
  phone,
  baseUrl,
}: {
  paymentId: string;
  courseTitle: string;
  courseId: string;
  amount: MoneyValue;
  user: { name: string; email: string };
  phone: string;
  baseUrl: string;
}) {
  const { firstName, lastName } = splitName(user.name);
  const formattedAmount = formatTabbyAmount(amount);

  const payload = {
    payment: {
      amount: formattedAmount,
      currency: "SAR",
      description: courseTitle,
      buyer: {
        email: user.email,
        phone: formatTamaraPhone(phone),
        name: `${firstName} ${lastName}`.trim(),
      },
      order: {
        reference_id: paymentId,
        items: [
          {
            title: courseTitle,
            description: courseTitle,
            quantity: 1,
            unit_price: formattedAmount,
            reference_id: courseId,
            category: "Education",
          },
        ],
      },
    },
    lang: "ar",
    merchant_code: process.env.TABBY_MERCHANT_CODE,
    merchant_urls: {
      success: `${baseUrl}/api/payments/tabby/return?status=success`,
      cancel: `${baseUrl}/api/payments/tabby/return?status=cancel`,
      failure: `${baseUrl}/api/payments/tabby/return?status=failure`,
    },
  };

  const response = await fetch(`${getTabbyApiUrl()}/api/v2/checkout`, {
    method: "POST",
    headers: getTabbyHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Tabby checkout error:", await response.text());
    return null;
  }

  return (await response.json()) as TabbyCheckoutResponse;
}

export function getTabbyCheckoutUrl(session: TabbyCheckoutResponse): string | null {
  return (
    session.configuration?.products?.installments?.web_url ||
    (session as { web_url?: string }).web_url ||
    null
  );
}

export async function fetchTabbyPayment(paymentId: string): Promise<TabbyPayment | null> {
  const response = await fetch(`${getTabbyApiUrl()}/api/v2/payments/${paymentId}`, {
    headers: getTabbyHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Tabby fetch payment error:", await response.text());
    return null;
  }

  return response.json();
}

export async function captureTabbyPayment(paymentId: string, amount: MoneyValue) {
  const response = await fetch(
    `${getTabbyApiUrl()}/api/v2/payments/${paymentId}/captures`,
    {
      method: "POST",
      headers: getTabbyHeaders(),
      body: JSON.stringify({
        amount: formatTabbyAmount(amount),
      }),
    }
  );

  if (!response.ok) {
    console.error("Tabby capture error:", await response.text());
    return false;
  }

  return true;
}

export function isTabbyPaymentAuthorized(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "authorized" || normalized === "closed";
}

export function verifyTabbyWebhookAuth(headerValue: string | null) {
  const expected = process.env.TABBY_WEBHOOK_AUTH_HEADER;
  if (!expected) return true;
  return headerValue === expected;
}
