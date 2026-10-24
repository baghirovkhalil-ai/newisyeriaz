# İşYeri.az

Next.js 14 (App Router) + Tailwind. Data hələlik `lib/data.ts`-dəki mock datadır.

## İşə salmaq
```
npm install
cp .env.example .env.local
npm run dev
```
http://localhost:3000

## Strukturu
- `app/[locale]/` səhifələr: ana, /vakansiyalar, /vakansiya/[slug], /is-elanlari/[şəhər]/[kateqoriya], /elan-yerlesdir
- `app/sitemap.ts`, `app/robots.ts`, `app/api/` dil prefiksindən kənardadır
- `lib/data.ts` data qatı (sonra Supabase ilə əvəz olunacaq)
- `lib/seo.ts` JobPosting schema və formatlar
- `components/` Header, Footer, Logo, VacancyCard, SearchForm, Pagination, PostForm, LanguageSwitcher, ThemeSwitcher, ScrollFx, Reveal, CountUp, ShareButton, MobileNav, CategoryChips, PricingTable, SubscribeForm
- `middleware.ts` dil yönləndirməsi, `lib/i18n.ts` köməkçilər

## Demo rejimi
`NEXT_PUBLIC_DEMO_MODE` təyin olunmayıbsa sayt demo rejimində işləyir: bütün səhifələr `noindex`, robots.txt hamını bloklayır, üstdə "Test rejimi" xəbərdarlığı görünür.
Real elanlarla açılışdan əvvəl Vercel-də `NEXT_PUBLIC_DEMO_MODE=false` yaz.

## Elan yerləşdirmə
`/elan-yerlesdir` forması `POST /api/vacancies`-ə göndərir. Hazırda yalnız yoxlayır, bazaya yazmır (Supabase növbəti addımdır).

## Dillər (az / ru / en)
- Əsas dil Azərbaycan dilidir və prefikssiz işləyir: `/vakansiyalar`. Digərləri: `/ru/vakansiyalar`, `/en/vakansiyalar`. `/az/...` avtomatik prefikssizə yönlənir.
- Bütün interfeys mətnləri `lib/dictionaries.ts`-dədir (hər dil üçün eyni quruluş, TypeScript çatışmayan açarı göstərir).
- Şəhər, sahə, rayon adları və nümunə vakansiyaların tərcüməsi `lib/content-i18n.ts`-dədir.
- SEO: hər səhifədə `hreflang` + canonical, sitemap-də hər URL üçün 3 dil, `<html lang>` və OpenGraph locale dilə görə dəyişir.
- **Yeni dil əlavə etmək:** `lib/i18n.ts`-də `locales` və `localeMeta`-ya əlavə et, `lib/dictionaries.ts`-də yeni obyekt yaz, `lib/content-i18n.ts`-də şəhər/sahə/rayon/şablon tərcümələrini əlavə et.
- Baza (Supabase) qoşulanda vakansiya mətnləri üçün dilə görə sütunlar (`title_ru`, `title_en`...) və ya ayrıca tərcümə cədvəli lazım olacaq. İndi tərcümə yalnız nümunə datadadır.

## Görünüş rejimləri (tema)
- 4 seçim: **Avto** (cihazın rejimi), **Açıq**, **Qara**, **Göy**. Header-dəki palitra düyməsindədir, seçim `localStorage`-də saxlanır.
- Rənglər `app/globals.css`-də CSS dəyişənləridir (`:root`, `[data-theme="dark"]`, `[data-theme="blue"]`). Tailwind rəngləri `tailwind.config.ts`-də bu dəyişənlərə bağlıdır, ona görə komponentlərdə `bg-surface`, `text-ink`, `text-body`, `text-muted`, `text-on-brand` kimi adlardan istifadə et (`bg-white`, `text-slate-*` yox).
- Səhifə çəkilməmişdən əvvəl `lib/theme.ts`-dəki kiçik skript temanı qoyur, ona görə yanıb-sönmə olmur.
- Loqo (`components/Logo.tsx`) rəngləri temadan alır.
- **Yeni tema əlavə etmək:** `globals.css`-ə `[data-theme="ad"]` bloku yaz, `lib/theme.ts`-də `themeOptions`, `THEME_COLORS` və `ThemeSwitcher.tsx`-də `swatch`-a əlavə et, 3 dilin `theme` mətnlərinə də yaz.

## Animasiyalar
- Hamısı CSS və kiçik client komponentlərdir, əlavə paket yoxdur. Keyframe-lər `tailwind.config.ts`-dədir.
- `prefers-reduced-motion` açıq olanda animasiyalar söndürülür. JS işləməsə, kontent adi halda görünür.

## Paketlər (qiymətlər səhifəsi)
- Səhifə: `/qiymetler`. 3 paket: Başlanğıc (pulsuz), Biznes, Korporativ; aylıq/illik (−20%) keçid, tez-tez verilən suallar.
- Qiymətlər `lib/plans.ts`-dədir, paket mətnləri 3 dildə `lib/dictionaries.ts`-dədir (`pricing`).
- Paket seçəndə `/elan-yerlesdir?plan=pro` açılır və formada seçilmiş paket göstərilir.
- **Qiymətlər və paket imkanları NÜMUNƏDİR.** Ödəniş sistemi hələ qoşulmayıb; abunəlik yalnız səhifə səviyyəsindədir (faktiki məhdudiyyət tətbiq olunmur).

## E-poçt abunəliyi
- Footer-də `SubscribeForm` var (e-poçt + istəyə bağlı sahə). `POST /api/subscribe` e-poçtu yoxlayır, spam üçün gizli xana var.
- **İndi heç yerdə saxlanmır.** `app/api/subscribe/route.ts`-dəki TODO yerinə Supabase və ya email xidməti (Resend, Mailchimp) qoşulmalıdır.

## Mobil versiya
- Aşağıda sabit naviqasiya zolağı (Ana səhifə, Vakansiyalar, Elan, Qiymətlər); kompüterdə gizlənir.
- `/vakansiyalar` səhifəsində bütün sahələr çip kimi (telefonda 2 sıralı sürüşmə, kompüterdə hamısı görünür).
- Giriş xanalarının şrifti telefonda 16px (iPhone-da fokusda yaxınlaşma olmasın), toxunma sahələri böyüdülüb.
- iPhone-un alt zolağı üçün `safe-area` nəzərə alınıb.
