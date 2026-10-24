export const locales = ["az", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";

export const localeMeta: Record<Locale, { short: string; native: string; og: string }> = {
  az: { short: "AZ", native: "Azərbaycanca", og: "az_AZ" },
  ru: { short: "RU", native: "Русский", og: "ru_RU" },
  en: { short: "EN", native: "English", og: "en_US" },
};

export function isLocale(x: string | undefined): x is Locale {
  return !!x && (locales as readonly string[]).includes(x);
}

/** Əsas dil prefikssiz qalır: /vakansiyalar. Digərləri: /ru/vakansiyalar */
export function localePath(locale: Locale, path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return p;
  return p === "/" ? `/${locale}` : `/${locale}${p}`;
}

/** canonical + hreflang (Google üçün) */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/** Axtarışda Bakı = baki, Şəki = seki, İT = it kimi eyni sayılsın */
export function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i");
}
