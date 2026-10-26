import Link from "next/link";
import { BOOSTS, BOOST_IDS, fmtPrice, type Target } from "@/lib/boosts";
import type { Extra } from "@/lib/dict-extra";
import { fmt, localePath, type Locale } from "@/lib/i18n";

/** «İrəli çək / Premium / Gold» kartları. Server və client komponentlərində işləyir (hook yoxdur). */
export default function BoostOptions({ target, locale, x, item, compact = false }: { target: Target; locale: Locale; x: Extra; item?: string; compact?: boolean }) {
  const texts = target === "cv" ? x.boost.cvItems : x.boost.items;
  const href = (id: string) => `${localePath(locale, "/one-cixar")}?type=${target}&plan=${id}${item ? `&item=${encodeURIComponent(item)}` : ""}`;
  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3 md:items-stretch"}`}>
      {BOOST_IDS.map((id) => {
        const b = BOOSTS[target][id], info = texts[id], gold = id === "gold", prem = id === "premium";
        return (
          <div key={id} className={`relative flex flex-col rounded-2xl border bg-surface p-4 sm:p-5 ${gold ? "border-2 border-gold-line bg-gold-soft/50" : prem ? "border-brand shadow-lg shadow-brand/10" : "border-brand-line"}`}>
            {prem && !compact && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-xs font-medium text-on-brand">{x.boost.popular}</span>}
            <div className="flex items-center justify-between gap-2">
              <h3 className={`text-base font-semibold ${gold ? "text-gold" : prem ? "text-brand-dark" : "text-ink"}`}>{info.name}</h3>
              <p className="text-xs text-muted">{b.days ? fmt(x.boost.days, { n: b.days }) : x.boost.once}</p>
            </div>
            <p className="mt-2 flex items-baseline gap-1"><span className="text-3xl font-medium tabular-nums text-ink">{fmtPrice(b.price)}</span><span className="text-sm text-muted">₼</span></p>
            <p className="mt-1 text-sm text-body">{info.desc}</p>
            {!compact && (
              <ul className="mb-5 mt-3 flex-1 space-y-2 text-sm text-body">
                {info.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className={`mt-0.5 shrink-0 ${gold ? "stroke-gold" : "stroke-brand"}`} width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href={href(id)} className={`mt-auto block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition active:scale-95 ${compact ? "mt-3" : ""} ${gold ? "bg-gold text-surface hover:opacity-90" : prem ? "bg-brand text-on-brand hover:opacity-90" : "border border-brand text-brand-dark hover:bg-brand-soft"}`}>
              {x.boost.choose}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
