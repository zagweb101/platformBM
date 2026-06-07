import { toNumber, type MoneyValue } from "@/lib/money";

const DEFAULT_API_URL = "https://api-sandbox.tamara.co";

export interface TamaraCheckoutResponse {
  order_id: string;
  checkout_id: string;
  checkout_url: string;
  status: string;
}

export interface TamaraOrder {
  order_id: string;
  order_reference_id: string;
  status: string;
  total_amount: { amount: number; currency: string };
}

export function isTamaraConfigured() {
  return Boolean(process.env.TAMARA_API_TOKEN);
}

function getTamaraApiUrl() {
  return process.env.TAMARA_API_URL || DEFAULT_API_URL;
}

function getTamaraHeaders() {
  const token = process.env.TAMARA_API_TOKEN;
  if (!token) throw new Error("Tamara API token not configured");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function formatTamaraPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("0")) return `+966${digits.slice(1)}`;
  if (digits.length === 9) return `+966${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export function tamaraAmount(amount: MoneyValue) {
  return {
    amount: toNumber(amount),
    currency: "SAR" as const,
  };
}

export async function createTamaraCheckoutSession({
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
  const itemAmount = tamaraAmount(amount);

  const payload = {
    order_reference_id: paymentId,
    order_number: paymentId,
    total_amount: itemAmount,
    shipping_amount: { amount: 0, currency: "SAR" },
    tax_amount: { amount: 0, currency: "SAR" },
    description: courseTitle,
    country_code: "SA",
    payment_type: "PAY_BY_INSTALMENTS",
    instalments: 3,
    locale: "ar_SA",
    items: [
      {
        name: courseTitle,
        type: "Digital",
        sku: courseId,
        quantity: 1,
        total_amount: itemAmount,
        reference_id: courseId,
      },
    ],
    consumer: {
      first_name: firstName,
      last_name: lastName,
      phone_number: formatTamaraPhone(phone),
      email: user.email,
    },
    merchant_url: {
      success: `${baseUrl}/api/payments/tamara/return?status=success`,
      failure: `${baseUrl}/api/payments/tamara/return?status=failure`,
      cancel: `${baseUrl}/api/payments/tamara/return?status=cancel`,
      notification: `${baseUrl}/api/webhooks/tamara`,
    },
  };

  const response = await fetch(`${getTamaraApiUrl()}/checkout`, {
    method: "POST",
    headers: getTamaraHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("Tamara checkout error:", await response.text());
    return null;
  }

  return (await response.json()) as TamaraCheckoutResponse;
}

export async function fetchTamaraOrder(orderId: string): Promise<TamaraOrder | null> {
  const response = await fetch(`${getTamaraApiUrl()}/orders/${orderId}`, {
    headers: getTamaraHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Tamara fetch order error:", await response.text());
    return null;
  }

  return response.json();
}

export async function authoriseTamaraOrder(orderId: string) {
  const response = await fetch(`${getTamaraApiUrl()}/orders/${orderId}/authorise`, {
    method: "POST",
    headers: getTamaraHeaders(),
  });

  if (!response.ok) {
    console.error("Tamara authorise error:", await response.text());
    return false;
  }

  return true;
}

export function isTamaraOrderApproved(status: string) {
  return ["approved", "authorised", "fully_captured", "partially_captured"].includes(
    status.toLowerCase()
  );
}

export async function verifyTamaraWebhookToken(token: string): Promise<boolean> {
  const secret = process.env.TAMARA_NOTIFICATION_TOKEN;
  if (!secret) return process.env.NODE_ENV === "development";

  try {
    const { jwtVerify } = await import("jose");
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}
