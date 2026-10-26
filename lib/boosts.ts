// Elan və CV-ni önə çıxarma xidmətləri (tap.az modelinə bənzər).
// Qiymətlər AZN-dir. Dəyişmək üçün yalnız bu faylı redaktə et — server (api/receipt) də buradan oxuyur.

export type Target = "vacancy" | "cv";
export type BoostId = "bump" | "premium" | "gold";
export type Tier = "premium" | "gold";

export interface Boost { price: number; days: number }

export const BOOSTS: Record<Target, Record<BoostId, Boost>> = {
  vacancy: { bump: { price: 1, days: 0 }, premium: { price: 3, days: 7 }, gold: { price: 6, days: 7 } },
  cv: { bump: { price: 0.5, days: 0 }, premium: { price: 2, days: 7 }, gold: { price: 4, days: 7 } },
};

export const BOOST_IDS: BoostId[] = ["bump", "premium", "gold"];
export const isTarget = (x: unknown): x is Target => x === "vacancy" || x === "cv";
export const isBoost = (x: unknown): x is BoostId => x === "bump" || x === "premium" || x === "gold";

/** Sıralama: Gold → Premium → adi. Eyni səviyyədə ən son irəli çəkilən/yerləşdirilən yuxarıda. */
export const tierRank = (t?: Tier) => (t === "gold" ? 2 : t === "premium" ? 1 : 0);
export function byTier<T extends { tier?: Tier; publishedAt: string; bumpedAt?: string }>(a: T, b: T) {
  return tierRank(b.tier) - tierRank(a.tier) || +new Date(b.bumpedAt ?? b.publishedAt) - +new Date(a.bumpedAt ?? a.publishedAt);
}

/** Ödəniş kartı (kartdan karta köçürmə). Vercel-də NEXT_PUBLIC_PAY_CARD ilə dəyişmək olar. */
export const PAY_CARD = process.env.NEXT_PUBLIC_PAY_CARD || "4169 7388 7498 7534";
export const PAY_CARD_LAST4 = PAY_CARD.replace(/\D/g, "").slice(-4);

export const fmtPrice = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ""));
