import type { Metadata } from "next";
import PricingTable from "@/components/PricingTable";
import Reveal from "@/components/Reveal";
import { getDict } from "@/lib/dictionaries";
import { alternates, type Locale } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = getDict(params.locale).pricing;
  return { title: t.metaTitle, description: t.metaDesc, alternates: alternates(params.locale, "/qiymetler") };
}

export default function PricingPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = getDict(locale).pricing;

  return (
    <div className="space-y-12">
      <header className="mx-auto max-w-2xl animate-fade-up text-center">
        <h1 className="text-3xl font-medium sm:text-4xl">{t.h1}</h1>
        <p className="mt-2 text-body">{t.sub}</p>
      </header>

      <PricingTable t={t} locale={locale} />
      <p className="-mt-6 text-center text-xs text-muted">{t.demoNote}</p>

      <Reveal>
        <section className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-lg font-medium">{t.faqTitle}</h2>
          <div className="divide-y divide-brand-line rounded-xl border border-brand-line">
            {t.faq.map((f) => (
              <details key={f.q} className="group px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg className="shrink-0 stroke-muted transition-transform duration-300 group-open:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </summary>
                <p className="mt-2 text-sm text-body">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
