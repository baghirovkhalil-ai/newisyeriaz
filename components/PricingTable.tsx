"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dict } from "@/lib/dictionaries";
import { fmt, localePath, type Locale } from "@/lib/i18n";
import { plans, yearlyMonthly, yearlyTotal } from "@/lib/plans";

export default function PricingTable({ t, locale }: { t: Dict["pricing"]; locale: Locale }) {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      {/* Aylıq / İllik keçid */}
      <div className="mb-8 flex justify-center">
        <div role="group" aria-label={`${t.monthly} / ${t.yearly}`} className="relative grid grid-cols-2 rounded-full border border-brand-line bg-brand-soft p-1 text-sm">
          <span aria-hidden="true" className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-brand shadow transition-transform duration-300 ${yearly ? "translate-x-full" : ""}`} />
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={`relative z-[1] rounded-full px-5 py-2 font-medium transition-colors ${!yearly ? "text-on-brand" : "text-body"}`}>{t.monthly}</button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={`relative z-[1] flex items-center justify-center gap-1.5 rounded-full px-5 py-2 font-medium transition-colors ${yearly ? "text-on-brand" : "text-body"}`}>
            {t.yearly}
            <span className={`rounded-full px-1.5 text-xs ${yearly ? "bg-on-brand/20" : "bg-brand/15 text-brand-dark"}`}>{t.save}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
        {plans.map((p) => {
          const info = t.plans[p.id];
          const price = yearly ? yearlyMonthly(p.monthly) : p.monthly;
          return (
            <div key={p.id} className={`relative flex flex-col rounded-2xl border bg-surface p-5 transition duration-300 hover:shadow-xl hover:shadow-brand/10 sm:p-6 ${p.popular ? "border-brand shadow-lg shadow-brand/15 md:-translate-y-2" : "border-brand-line"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-xs font-medium text-on-brand">✦ {t.popular}</span>
              )}
              <h3 className="text-lg font-medium text-ink">{info.name}</h3>
              <p className="mt-0.5 text-sm text-muted">{info.tagline}</p>

              <div className="mt-5 min-h-[4.5rem]">
                <div key={`${p.id}-${yearly}`} className="animate-fade-in">
                  {p.monthly === 0 ? (
                    <p className="text-4xl font-medium text-ink">{t.free}</p>
                  ) : (
                    <p className="flex items-baseline gap-1">
                      <span className="text-4xl font-medium tabular-nums text-ink">{price}</span>
                      <span className="text-sm text-muted">AZN {t.perMonth}</span>
                    </p>
                  )}
                  {p.monthly > 0 && yearly && <p className="mt-1 text-xs text-muted">{fmt(t.billedYearly, { n: yearlyTotal(p.monthly) })}</p>}
                </div>
              </div>

              <ul className="mb-6 mt-4 flex-1 space-y-2.5 text-sm text-body">
                {info.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 shrink-0 stroke-brand" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`${localePath(locale, "/elan-yerlesdir")}?plan=${p.id}`}
                className={`block rounded-lg px-4 py-3 text-center text-sm font-medium transition active:scale-95 ${p.popular ? "bg-brand text-on-brand hover:opacity-90" : "border border-brand text-brand-dark hover:bg-brand-soft"}`}
              >
                {p.monthly === 0 ? t.ctaFree : t.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
