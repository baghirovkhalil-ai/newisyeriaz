"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { defaultLocale, localeMeta, localePath, locales, type Locale } from "@/lib/i18n";

/** Cari səhifədə qalıb yalnız dili dəyişir (filtrlər də saxlanır). */
export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || "/";
  const search = useSearchParams().toString();

  // /ru/vakansiyalar -> /vakansiyalar
  const seg = pathname.split("/");
  const rest = (locales as readonly string[]).includes(seg[1]) ? "/" + seg.slice(2).join("/") : pathname;
  const base = rest === "" ? "/" : rest;

  return (
    <div className="flex items-center gap-1 text-xs" role="group" aria-label={label}>
      {locales.map((l) => (
        <Link
          key={l}
          href={localePath(l, base) + (search ? `?${search}` : "")}
          hrefLang={l}
          lang={l}
          title={localeMeta[l].native}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-md px-2 py-1.5 ${l === locale ? "bg-brand-soft font-medium text-brand-dark" : "text-muted hover:text-brand-dark"}`}
        >
          {localeMeta[l].short}
        </Link>
      ))}
    </div>
  );
}
