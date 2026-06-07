export type PaymentMethodType =
  | "BANK_TRANSFER"
  | "MOYASAR"
  | "TAMARA"
  | "TABBY";

export function getPaymentMethodLabel(method: PaymentMethodType): string {
  switch (method) {
    case "BANK_TRANSFER":
      return "تحويل بنكي";
    case "MOYASAR":
      return "بطاقة / Moyasar";
    case "TAMARA":
      return "تمارا — قسّط";
    case "TABBY":
      return "تابي — قسّط";
    default:
      return method;
  }
}

export function isManualReviewMethod(method: PaymentMethodType): boolean {
  return method === "BANK_TRANSFER";
}

export function isOnlineAutoMethod(method: PaymentMethodType): boolean {
  return method !== "BANK_TRANSFER";
}
