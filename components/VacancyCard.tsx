import Link from "next/link";
import type { VacancyView } from "@/lib/data";
import type { Dict } from "@/lib/dictionaries";
import { getExtra } from "@/lib/dict-extra";
import { localePath, type Locale } from "@/lib/i18n";
import { formatDate, formatSalary } from "@/lib/seo";
import TierBadge, { tierFrame } from "./TierBadge";

export default function VacancyCard({ v, locale, t }: { v: VacancyView; locale: Locale; t: Dict }) {
  const x = getExtra(locale);
  return (
    <Link
      href={localePath(locale, `/vakansiya/${v.slug}`)}
      className={`group relative block h-full overflow-hidden rounded-xl border bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg hover:shadow-brand/15 active:translate-y-0 active:scale-[.99] ${tierFrame(v.tier)}`}
    >
      {v.tier === "gold" && <span aria-hidden="true" className="gold-shine pointer-events-none absolute inset-0" />}
      {v.tier === "premium" && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent" />}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-medium text-ink">{v.title}</h3>
          <p className="mt-0.5 text-sm text-muted">{v.company.name}</p>
        </div>
        {v.tier && <TierBadge tier={v.tier} label={x.card[v.tier]} />}
      </div>
      <div className="relative mt-3 flex items-center justify-between">
        <p className="text-sm font-medium text-brand-dark">{formatSalary(t.salary, v.salaryMin, v.salaryMax)}</p>
        <span aria-hidden="true" className="-translate-x-2 text-brand opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
      </div>
      <div className="relative mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
        <span>{v.district ? `${v.district}, ${v.city.name}` : v.city.name}</span>
        <span>{t.schedule[v.schedule]}</span>
        <span>{formatDate(t.date, v.bumpedAt ?? v.publishedAt)}</span>
      </div>
    </Link>
  );
}
