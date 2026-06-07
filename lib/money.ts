import { Decimal } from "@prisma/client/runtime/library";

export type MoneyValue = Decimal | number | string | null | undefined;

export function toNumber(value: MoneyValue): number {
  if (value == null) return 0;
  if (value instanceof Decimal) return value.toNumber();
  if (typeof value === "number") return value;
  return Number(value);
}

export function calculateInstructorShare(
  amount: MoneyValue,
  revenueSharePercent: MoneyValue
): number {
  const amountNum = toNumber(amount);
  const shareNum = toNumber(revenueSharePercent);
  return Math.round(amountNum * (shareNum / 100) * 100) / 100;
}

export function formatMoney(value: MoneyValue): string {
  return toNumber(value).toLocaleString("ar-SA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
