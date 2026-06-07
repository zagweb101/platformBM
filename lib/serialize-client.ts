import { toNumber, type MoneyValue } from "@/lib/money";

export function serializeCoursePrice<T extends { price: MoneyValue }>(course: T) {
  return {
    ...course,
    price: toNumber(course.price),
  };
}

export function serializePaymentAmount<T extends { amount: MoneyValue }>(payment: T) {
  return {
    ...payment,
    amount: toNumber(payment.amount),
  };
}

export function serializeInstructorMoney<
  T extends { revenueShare: MoneyValue; walletBalance: MoneyValue },
>(instructor: T) {
  return {
    ...instructor,
    revenueShare: toNumber(instructor.revenueShare),
    walletBalance: toNumber(instructor.walletBalance),
  };
}

export function serializeWalletTxAmount<T extends { amount: MoneyValue }>(tx: T) {
  return {
    ...tx,
    amount: toNumber(tx.amount),
  };
}
