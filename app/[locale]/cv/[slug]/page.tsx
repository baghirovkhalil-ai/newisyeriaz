import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BoostOptions from "@/components/BoostOptions";
import CandidateCard from "@/components/CandidateCard";
import PhoneReveal from "@/components/PhoneReveal";
import TierBadge from "@/components/TierBadge";
import { getCandidateBySlug, getCandidates } from "@/lib/candidates";
import { getDict } from "@/lib/dictionaries";
import { getExtra } from "@/lib/dict-extra";
import { fmt, localePath, type Locale } from "@/lib/i18n";

type Props = { params: { locale: Locale; slug: string } };

// Şəxsi məlumat olduğu üçün CV səhifələri axtarış sistemlərində indekslənmir.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCandidateBySlug(params.locale, params.slug);
  if (!c) return {};
  return { title: `${c.role} — ${c.name}`, robots: { index: false, follow: true } };
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 border-b border-brand-line pb-1 text-sm font-semibold text-brand-dark">{children}</h2>;
}

export default async function CvPage({ params }: Props) {
  const { locale } = params;
  const t = getDict(locale);
  const x = getExtra(locale);
  const c = await getCandidateBySlug(locale, params.slug);
  if (!c) notFound();
  const similar = (await getCandidates(locale, { category: c.category.slug })).filter((s) => s.id !== c.id).slice(0, 2);

  return (
    <article className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href={localePath(locale, "/")} className="hover:underline">{x.cvdb.home}</Link> /{" "}
        <Link href={localePath(locale, "/cv-bazasi")} className="hover:underline">{x.cvdb.h1}</Link>
      </nav>

      <div className={`overflow-hidden rounded-2xl border bg-surface ${c.tier === "gold" ? "border-2 border-gold-line" : "border-brand-line"}`}>
        <header className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${c.tier === "gold" ? "bg-gold-soft" : "bg-brand-soft"}`}>
          <span aria-hidden="true" className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-semibold ${c.tier === "gold" ? "bg-gold text-surface" : "bg-brand text-on-brand"}`}>{c.initials}</span>
          <div className="min-w-0 flex-1">
            {c.tier && <TierBadge tier={c.tier} label={x.card[c.tier]} className="mb-1" />}
            <h1 className="text-2xl font-medium text-ink">{c.role}</h1>
            <p className="text-body">{c.name}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-body">
              <span>{c.city.name}</span>
              <span>{c.category.name}</span>
              <span>{c.years > 0 ? fmt(x.cvdb.years, { n: c.years }) : x.cvdb.noExp}</span>
              <span>{x.cvdb.expected}: <b className="font-medium text-brand-dark">{c.salary ? `${c.salary} AZN` : x.cvdb.negotiable}</b></span>
            </div>
          </div>
          <PhoneReveal phone={c.phone} showLabel={x.cvdb.showPhone} callLabel={x.cvdb.call} />
        </header>

        <div className="grid gap-6 p-5 md:grid-cols-[1fr_15rem]">
          <div className="space-y-5">
            <section><H>{x.cvdb.about}</H><p className="leading-relaxed text-body">{c.summary}</p></section>
            {c.experience.length > 0 && (
              <section>
                <H>{x.cvdb.experience}</H>
                <ul className="space-y-3">
                  {c.experience.map((e) => (
                    <li key={e.role + e.period}>
                      <p className="font-medium text-ink">{e.role}</p>
                      <p className="text-sm text-muted">{e.company} · {e.period}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {c.education && (
              <section>
                <H>{x.cvdb.education}</H>
                <p className="font-medium text-ink">{c.education.degree}</p>
                <p className="text-sm text-muted">{c.education.school} · {c.education.period}</p>
              </section>
            )}
          </div>
          <aside className="space-y-5">
            <section>
              <H>{x.cvdb.skills}</H>
              <ul className="flex flex-wrap gap-1.5">{c.skills.map((s) => <li key={s} className="rounded-md bg-brand/10 px-2 py-0.5 text-sm text-brand-dark">{s}</li>)}</ul>
            </section>
            <section>
              <H>{x.cvdb.languages}</H>
              <ul className="space-y-1 text-sm text-body">{c.languages.map((l) => <li key={l}>{l}</li>)}</ul>
            </section>
          </aside>
        </div>
      </div>

      {c.tier !== "gold" && (
        <section className="rounded-2xl border border-dashed border-gold-line p-4 sm:p-5">
          <p className="mb-3 text-sm font-medium text-body">{x.boost.ownerCv}</p>
          <BoostOptions target="cv" locale={locale} x={x} item={`${c.name}, ${c.role}`} compact />
        </section>
      )}

      {similar.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">{x.cvdb.similar}</h2>
          <div className="grid gap-3 sm:grid-cols-2">{similar.map((s) => <CandidateCard key={s.id} c={s} locale={locale} t={t} x={x} />)}</div>
        </section>
      )}
    </article>
  );
}
