import type { Metadata } from "next";
import Link from "next/link";
import CvPreview from "@/components/CvPreview";
import Reveal from "@/components/Reveal";
import { getCvSamples, karyeraLink } from "@/lib/cv-samples";
import { getDict } from "@/lib/dictionaries";
import { alternates, localePath, type Locale } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = getDict(params.locale).cv;
  return { title: t.metaTitle, description: t.metaDesc, alternates: alternates(params.locale, "/cv-yarat") };
}

const arrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

export default function CvPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = getDict(locale).cv;
  const samples = getCvSamples(locale);
  const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition active:scale-95";

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-soft p-5 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="dot-grid absolute inset-0" />
          <div className="absolute -right-10 -top-16 h-56 w-56 animate-float rounded-full bg-brand/25 blur-3xl" />
        </div>
        <div className="relative max-w-2xl">
          <span className="inline-block animate-fade-up rounded-full border border-brand-line bg-surface/70 px-3 py-1 text-xs font-medium text-brand-dark">{t.badge}</span>
          <h1 className="mt-3 animate-fade-up text-3xl font-medium sm:text-4xl" style={{ animationDelay: "80ms" }}>{t.h1}</h1>
          <p className="mt-2 animate-fade-up text-body" style={{ animationDelay: "160ms" }}>{t.sub}</p>
          <ul className="mt-4 flex animate-fade-up flex-wrap gap-2 text-sm" style={{ animationDelay: "240ms" }}>
            {t.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 rounded-full border border-brand-line bg-surface/70 px-3 py-1.5">
                <svg className="stroke-brand" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex animate-fade-up flex-wrap items-center gap-2" style={{ animationDelay: "320ms" }}>
            <a href={karyeraLink("cv_hero")} target="_blank" rel="noopener" className={`${btn} bg-brand text-on-brand shadow-lg shadow-brand/25 hover:opacity-90`}>
              {t.cta} {arrow}
            </a>
            <a href="#numuneler" className={`${btn} border border-brand bg-surface/60 text-brand-dark hover:bg-surface`}>{t.seeSamples}</a>
          </div>
          <p className="mt-2 text-xs text-muted">{t.ctaNote}</p>
        </div>
      </section>

      {/* Nümunələr */}
      <section id="numuneler" className="scroll-mt-20">
        <Reveal>
          <h2 className="text-lg font-medium">{t.samplesTitle}</h2>
          <p className="mb-4 mt-1 text-sm text-body">{t.samplesSub}</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {samples.map((cv, i) => (
            <Reveal key={cv.id} delay={(i % 2) * 80} className="h-full">
              <div className="flex h-full min-w-0 flex-col gap-3">
                <span className="w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-dark">{cv.field}</span>
                <div className="flex-1 transition duration-300 hover:-translate-y-1 hover:drop-shadow-xl">
                  <CvPreview cv={cv} t={t} />
                </div>
                <a href={karyeraLink(`cv_sample_${cv.id}`)} target="_blank" rel="noopener" className={`${btn} border border-brand text-brand-dark hover:bg-brand-soft`}>
                  {t.useSample} {arrow}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted">{t.sampleNote}</p>
      </section>

      {/* Məsləhətlər */}
      <Reveal>
        <section className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-lg font-medium">{t.tipsTitle}</h2>
          <ol className="space-y-2">
            {t.tips.map((tip, i) => (
              <li key={tip} className="flex gap-3 rounded-xl border border-brand-line p-3 text-sm text-body">
                <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-on-brand">{i + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* Son çağırış */}
      <Reveal>
        <section className="relative overflow-hidden rounded-2xl border border-brand-line p-6 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-brand/15 blur-3xl" />
          <h2 className="relative text-lg font-medium">{t.bottomTitle}</h2>
          <p className="relative mb-3 mt-1 text-body">{t.bottomText}</p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <Link href={localePath(locale, "/vakansiyalar")} className={`${btn} bg-brand text-on-brand hover:opacity-90`}>{t.bottomBtn}</Link>
            <a href={karyeraLink("cv_bottom")} target="_blank" rel="noopener" className={`${btn} border border-brand text-brand-dark hover:bg-brand-soft`}>{t.cta} {arrow}</a>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
