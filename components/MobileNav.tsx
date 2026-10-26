"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dict } from "@/lib/dictionaries";
import { localePath, locales, type Locale } from "@/lib/i18n";

const ico = { fill: "none", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Yalnız telefonda görünən aşağı naviqasiya zolağı. */
export default function MobileNav({ locale, t }: { locale: Locale; t: Dict }) {
  const pathname = usePathname() || "/";
  const seg = pathname.split("/");
  const rest = (locales as readonly string[]).includes(seg[1]) ? "/" + seg.slice(2).join("/") : pathname;

  const items = [
    { href: "/", label: t.nav.home, active: rest === "/" || rest === "", icon: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
    { href: "/vakansiyalar", label: t.nav.vacancies, active: rest.startsWith("/vakansiya") || rest.startsWith("/is-elanlari"), icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></> },
    { href: "/elan-yerlesdir", label: t.nav.postShort, active: rest.startsWith("/elan-yerlesdir"), icon: <path d="M12 5v14M5 12h14" />, primary: true },
    { href: "/cv-yarat", label: t.nav.cv, active: rest.startsWith("/cv-yarat"), icon: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></> },
    { href: "/qiymetler", label: t.nav.pricing, active: rest.startsWith("/qiymetler"), icon: <><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1" /></> },
  ];

  return (
    <nav aria-label={t.site.mobileNavAria} className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={localePath(locale, it.href)} aria-current={it.active ? "page" : undefined} className="flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition active:scale-90">
              {it.primary ? (
                <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-brand text-on-brand shadow-lg shadow-brand/40 ring-4 ring-surface">
                  <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" {...ico} strokeWidth={2.4} aria-hidden="true">{it.icon}</svg>
                </span>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" {...ico} className={it.active ? "text-brand-dark" : "text-muted"} aria-hidden="true">{it.icon}</svg>
              )}
              <span className={it.primary ? "text-brand-dark" : it.active ? "text-brand-dark" : "text-muted"}>{it.label}</span>
              {!it.primary && <span aria-hidden="true" className={`absolute top-0 h-0.5 w-8 rounded-full bg-brand transition-opacity ${it.active ? "opacity-100" : "opacity-0"}`} />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
