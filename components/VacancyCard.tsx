import Link from "next/link";
import type { VacancyView } from "@/lib/data";
import type { Dict } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";
import { formatDate, formatSalary } from "@/lib/seo";

export default function VacancyCard({ v, locale, t }: { v: VacancyView; locale: Locale; t: Dict }) {
  return (
    <Link
      href={localePath(locale, `/vakansiya/${v.slug}`)}
      className={`group relative block h-full overflow-hidden rounded-xl border bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-lg hover:shadow-brand/15 active:translate-y-0 active:scale-[.99] ${v.isFeatured ? "border-brand/50" : "border-brand-line"}`}
    >
      {v.isFeatured && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent" />}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-ink">{v.title}</h3>
          <p className="mt-0.5 text-sm text-muted">{v.company.name}</p>
        </div>
        {v.isFeatured && (
          <span className="shrink-0 rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-dark">
            <span aria-hidden="true">✦ </span>{t.card.featured}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-medium text-brand-dark">{formatSalary(t.salary, v.salaryMin, v.salaryMax)}</p>
        <span aria-hidden="true" className="-translate-x-2 text-brand opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
        <span>{v.district ? `${v.district}, ${v.city.name}` : v.city.name}</span>
        <span>{t.schedule[v.schedule]}</span>
        <span>{formatDate(t.date, v.publishedAt)}</span>
      </div>
    </Link>
  );
}
