import type { Tier } from "@/lib/boosts";

/** Gold / Premium nişanı */
export default function TierBadge({ tier, label, className = "" }: { tier: Tier; label: string; className?: string }) {
  const gold = tier === "gold";
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${gold ? "bg-gold text-surface" : "bg-brand-soft text-brand-dark ring-1 ring-brand/40"} ${className}`}>
      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{gold ? <path d="M3 8l4.5 4L12 4l4.5 8L21 8l-2 11H5z" /> : <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" />}</svg>
      {label}
    </span>
  );
}

/** Kartın çərçivə sinifləri */
export const tierFrame = (tier?: Tier) =>
  tier === "gold" ? "border-2 border-gold-line bg-gold-soft/60" : tier === "premium" ? "border-brand/60 ring-1 ring-brand/25" : "border-brand-line";
