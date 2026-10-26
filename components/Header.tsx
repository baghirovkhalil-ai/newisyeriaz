import { Suspense } from "react";
import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import { getExtra } from "@/lib/dict-extra";

export default function Header({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <header className="site-header sticky top-0 z-10 border-b border-brand-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link href={localePath(locale, "/")} aria-label={t.site.homeAria}><Logo /></Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          <Link href={localePath(locale, "/vakansiyalar")} className="hidden text-body transition hover:text-brand-dark md:block">{t.nav.vacancies}</Link>
          <Link href={localePath(locale, "/vakansiyalar") + "?schedule=remote"} className="hidden text-body transition hover:text-brand-dark md:block">{t.nav.remote}</Link>
          <Link href={localePath(locale, "/cv-bazasi")} className="hidden text-body transition hover:text-brand-dark md:block">{getExtra(locale).nav.cvdb}</Link>
          <Link href={localePath(locale, "/cv-yarat")} className="hidden text-body transition hover:text-brand-dark lg:block">{t.nav.cv}</Link>
          <Link href={localePath(locale, "/qiymetler")} className="hidden text-body transition hover:text-brand-dark md:block">{t.nav.pricing}</Link>
          <Suspense fallback={null}><LanguageSwitcher locale={locale} label={t.site.langLabel} /></Suspense>
          <ThemeSwitcher t={t.theme} />
          <Link href={localePath(locale, "/elan-yerlesdir")} aria-label={t.nav.post} className="hidden rounded-lg bg-brand px-3 py-1.5 font-medium text-on-brand transition hover:opacity-90 active:scale-95 md:block">
            {t.nav.post}
          </Link>
        </nav>
      </div>
    </header>
  );
}
