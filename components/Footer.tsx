import Link from "next/link";
import Logo from "./Logo";
import Reveal from "./Reveal";
import SubscribeForm from "./SubscribeForm";
import { getCategories, getCities } from "@/lib/data";
import type { Dict } from "@/lib/dictionaries";
import { getExtra } from "@/lib/dict-extra";
import { categoryIcons } from "@/lib/icons";
import { localePath, type Locale } from "@/lib/i18n";

export default async function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const [categories, cities] = await Promise.all([getCategories(locale), getCities(locale)]);
  const p = (path: string) => localePath(locale, path);
  const list = p("/vakansiyalar");
  const link = "inline-block py-1 text-body transition duration-200 hover:translate-x-0.5 hover:text-brand-dark";
  const head = "mb-2 text-xs font-medium uppercase tracking-wider text-faint";

  return (
    <footer className="mt-20 pb-[calc(4rem_+_env(safe-area-inset-bottom))] md:pb-0">
      {/* Abunə bloku */}
      <div className="mx-auto max-w-5xl px-4">
        <Reveal>
          <section className="relative overflow-hidden rounded-2xl bg-brand-dark p-6 text-on-brand sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="dot-grid absolute inset-0 opacity-30" />
              <div className="absolute -right-12 -top-16 h-56 w-56 animate-float rounded-full bg-on-brand/15 blur-3xl" />
              <div className="absolute -bottom-20 left-10 h-48 w-48 animate-float-slow rounded-full bg-on-brand/10 blur-3xl" />
            </div>
            <div className="relative grid gap-5 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-8">
              <div>
                <h2 className="text-xl font-medium sm:text-2xl">{t.subscribe.title}</h2>
                <p className="mt-1 text-sm text-on-brand/80">{t.subscribe.text}</p>
              </div>
              <SubscribeForm t={t.subscribe} locale={locale} categories={categories.map((c) => ({ value: c.slug, label: c.name }))} />
            </div>
          </section>
        </Reveal>
      </div>

      {/* Əsas footer */}
      <div className="mt-10 border-t border-brand-line bg-brand-soft">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 text-sm lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href={p("/")} aria-label={t.site.homeAria}><Logo /></Link>
            <p className="mt-3 max-w-xs text-body">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.colFields}>
            <h3 className={head}>{t.footer.colFields}</h3>
            <ul>
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`${list}?category=${c.slug}`} className={link}><span aria-hidden="true" className="mr-1.5">{categoryIcons[c.slug]}</span>{c.name}</Link>
                </li>
              ))}
              <li><Link href={p("/cv-yarat")} className={link}><span aria-hidden="true" className="mr-1.5">📄</span>{t.footer.cv}</Link></li>
              <li><Link href={list} className={`${link} font-medium text-brand-dark`}>{t.footer.allJobs} →</Link></li>
            </ul>
          </nav>

          <nav aria-label={t.footer.colCities}>
            <h3 className={head}>{t.footer.colCities}</h3>
            <ul>
              {cities.map((c) => (
                <li key={c.id}><Link href={`${list}?city=${c.slug}`} className={link}>{c.name}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.colEmployers} className="col-span-2 lg:col-span-1">
            <h3 className={head}>{t.footer.colEmployers}</h3>
            <ul>
              <li><Link href={p("/elan-yerlesdir")} className={link}>{t.nav.post}</Link></li>
              <li><Link href={p("/qiymetler")} className={link}>{t.nav.pricing}</Link></li>
              <li><Link href={p("/cv-bazasi")} className={link}>{getExtra(locale).nav.cvdb}</Link></li>
              <li><Link href={p("/blog")} className={link}>{getExtra(locale).blog.nav}</Link></li>
              <li><Link href={`${p("/qiymetler")}#one-cixar`} className={link}>{getExtra(locale).boost.ctaVacancy}</Link></li>
              <li><Link href={`${list}?schedule=remote`} className={link}>{t.footer.remote}</Link></li>
              <li><Link href={`${list}?schedule=part_time`} className={link}>{t.footer.partTime}</Link></li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-brand-line">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 px-4 py-4 text-xs text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} İşYeri.az. {t.footer.rights}</p>
            <p>{t.footer.made}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
