import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollFx from "@/components/ScrollFx";
import MobileNav from "@/components/MobileNav";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";
import { getDict } from "@/lib/dictionaries";
import { isLocale, localeMeta, locales } from "@/lib/i18n";
import { IS_DEMO, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = getDict(params.locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.site.title, template: `%s | ${t.site.titleShort}` },
    description: t.site.description,
    openGraph: {
      siteName: t.site.titleShort,
      locale: localeMeta[params.locale].og,
      alternateLocale: locales.filter((l) => l !== params.locale).map((l) => localeMeta[l].og),
      type: "website",
    },
    robots: IS_DEMO ? { index: false, follow: false } : undefined,
  };
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale;
  const t = getDict(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ScrollFx label={t.site.backToTop} />
        {IS_DEMO && (
          <div className="bg-warn-bg px-4 py-1.5 text-center text-xs text-warn">{t.site.demoBanner}</div>
        )}
        <Header locale={locale} t={t} />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <Footer locale={locale} t={t} />
        <MobileNav locale={locale} t={t} />
      </body>
    </html>
  );
}
