// Paketlərin qiymətləri (AZN/ay). Mətnlər lib/dictionaries.ts-dədir. Qiymətlər NÜMUNƏDİR, ödəniş qoşulanda dəqiqləşdirilməlidir.
export const plans = [
  { id: "free", monthly: 0, popular: false },
  { id: "pro", monthly: 20, popular: true },
  { id: "business", monthly: 39, popular: false },
] as const;

export type PlanId = (typeof plans)[number]["id"];
export const YEARLY_DISCOUNT = 0.2;

export const isPlan = (x: string | undefined): x is PlanId => !!x && plans.some((p) => p.id === x);
export const yearlyMonthly = (monthly: number) => Math.round(monthly * (1 - YEARLY_DISCOUNT));
export const yearlyTotal = (monthly: number) => yearlyMonthly(monthly) * 12;
