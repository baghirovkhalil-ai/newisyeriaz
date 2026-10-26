import Link from "next/link";
import type { CandidateView } from "@/lib/candidates";
import type { Dict } from "@/lib/dictionaries";
import type { Extra } from "@/lib/dict-extra";
import { fmt, localePath, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/seo";
import TierBadge, { tierFrame } from "./TierBadge";

export default function CandidateCard({ c, locale, t, x }: { c: CandidateView; locale: Locale; t: Dict; x: Extra }) {
  return (
    <Link
      href={localePath(locale, `/cv/${c.slug}`)}
      className={`group relative flex h-full gap-3 overflow-hidden rounded-xl border bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg hover:shadow-brand/15 ${tierFrame(c.tier)}`}
    >
      {c.tier === "gold" && <span aria-hidden="true" className="gold-shine pointer-events-none absolute inset-0" />}
      <span aria-hidden="true" className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold ${c.tier === "gold" ? "bg-gold text-surface" : "bg-brand text-on-brand"}`}>{c.initials}</span>
      <div className="relative min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-medium text-ink">{c.role}</h3>
            <p className="truncate text-sm text-muted">{c.name}</p>
          </div>
          {c.tier && <TierBadge tier={c.tier} label={x.card[c.tier]} />}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-body">{c.summary}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          <span>{c.city.name}</span>
          <span>{c.years > 0 ? fmt(x.cvdb.years, { n: c.years }) : x.cvdb.noExp}</span>
          {c.salary && <span className="font-medium text-brand-dark">{c.salary} AZN</span>}
          <span>{formatDate(t.date, c.bumpedAt ?? c.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
