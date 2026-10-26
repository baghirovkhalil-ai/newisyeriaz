# Dəyişikliklər

## 0.7.0 — Blog
- Yeni bölmə `/blog` (3 dildə): kateqoriyalar (İş axtaranlar / İşəgötürənlər), önə çıxan yazı, kartlar.
- 6 məqalə: CV necə yazılır, müsahibə sualları, maaş danışığı, uzaqdan iş, vakansiya elanı necə yazılır, tələbələr üçün iş.
- Məqalə səhifəsi: mündəricat, məsləhət blokları, CV yarat / Elan yerləşdir / Gold kimi çağırış blokları, paylaş düyməsi, oxşar yazılar.
- SEO: BlogPosting və BreadcrumbList schema, hreflang, OpenGraph article, sitemap-də bütün yazılar.
- Menyu, footer və ana səhifədə «Bloqdan» bölməsi.

## 0.6.0 — Gold / Premium / İrəli çək, CV bazası, kartla ödəniş
- Elan və CV üçün önə çıxarma (`lib/boosts.ts`): İrəli çək 1 ₼, Premium 3 ₼/7 gün, Gold 6 ₼/7 gün; CV üçün 0.5 / 2 / 4 ₼.
- Sıralama: Gold → Premium → adi; eyni səviyyədə son irəli çəkilən yuxarıda. Kartlarda Gold (qızılı çərçivə) və Premium nişanları.
- Ana səhifədə ayrıca «Gold vakansiyalar» bloku və Gold namizədlər.
- Yeni səhifələr: `/cv-bazasi` (axtarış, sahə, şəhər), `/cv/[slug]` (noindex, nömrə kliklə açılır), `/cv-yerlesdir`, `/one-cixar` (ödəniş).
- Ödəniş: kartdan karta köçürmə + çek şəkli. `/api/receipt` çeki Gemini ilə oxuyur (dəqiq tarix-saat, məbləğ, alıcı kartın son 4 rəqəmi, status, son 48 saat, təkrar çek) və Telegram-a göndərir.
- Qiymətlər səhifəsində «Elanı və CV-ni önə çıxar» bölməsi; elan və CV göndəriləndən sonra önə çıxarma təklifi.
- Menyuda «CV bazası». 3 dildə mətnlər `lib/dict-extra.ts`-dədir.

## 0.5.0 — CV yarat, yeni qiymətlər
- Yeni səhifə `/cv-yarat` (3 dildə): 4 nümunə CV (satış, mühasib, İT, kuryer), CV üçün 5 məsləhət.
- "CV yarat" düymələri KarYera AI-a (karyera-ai.vercel.app) aparır, UTM ilə (`utm_source=isyeri`). Linki `NEXT_PUBLIC_KARYERA_URL` ilə dəyişmək olar.
- Header, mobil menyu (5 element), footer və ana səhifəyə CV linkləri/banneri; sitemap-ə `/cv-yarat`.
- Qiymətlər: Biznes 29 → 20 AZN, Korporativ 79 → 39 AZN.

## 0.4.0 — Mobil, paketlər, abunə, yeni footer
- Mobil: aşağı naviqasiya zolağı, bütün sahələr çip kimi, kəsilməyən sahə adları, böyük toxunma sahələri, 16px giriş xanaları, safe-area dəstəyi.
- Qiymətlər səhifəsi `/qiymetler` (3 paket, aylıq/illik, FAQ) və `?plan=` ilə elan formasına keçid. Qiymətlər nümunədir.
- Footer-də e-poçt abunəsi (`/api/subscribe`, hələlik yadda saxlanmır).
- Footer yenidən hazırlandı: abunə bloku, loqo və təsvir, sahələr/şəhərlər/işəgötürənlər sütunları, alt zolaq.
- Header: telefonda yalnız loqo, dil və tema; kompüterdə "Qiymətlər" linki.
- Sitemap-ə `/qiymetler` əlavə olundu.

## 0.3.0 — Görünüş rejimləri və animasiyalar
- Tema sistemi: Avto / Açıq / Qara / Göy. Seçim yadda qalır, açılışda yanıb-sönmə yoxdur, brauzer panelinin rəngi də dəyişir.
- Loqo temaya uyğunlaşır; yüklənəndə "pin düşür", üstünə gələndə portfel tərpənir. Favicon əlavə olundu (`app/icon.svg`).
- Ana səhifə: hərəkətli gradient fon, nöqtəli şəbəkə, başlıq animasiyası, 0-dan sayan statistika (vakansiya / şəhər / sahə).
- Sahə kartlarına ikonlar, hover effektləri.
- Vakansiya kartları: hover-da qalxma, ox işarəsi, "önə çıxan" kartlara xüsusi vurğu.
- Scroll ilə yumşaq görünmə (`Reveal`), səhifələr arası keçid animasiyası, yükləmə skeleti (`loading.tsx`).
- Yuxarıda oxuma zolağı, header kölgəsi, "yuxarı qayıt" düyməsi.
- Vakansiya səhifəsində "Paylaş" düyməsi.
- Elan göndəriləndə animasiyalı təsdiq işarəsi, xəta mətnləri yumşaq görünür.
- Mobil: header-də "Elan yerləşdir" kiçik "+" düyməsinə çevrilir.
- Əlçatanlıq: focus halqası, `prefers-reduced-motion` dəstəyi, rəng kontrastı yoxlanıb.

## 0.2.0 — Dillər
- Azərbaycan (əsas, prefikssiz), rus (`/ru`), ingilis (`/en`) dilləri; dil düyməsi.
- Hər səhifədə `hreflang`, canonical, 3 dilli sitemap.
- Şəhər, sahə, rayon və nümunə vakansiyaların tərcüməsi.
- Axtarış diakritiksiz işləyir (baki = Bakı); başlıqlarda "Gəncədə", "Şəkidə" şəkilçi xətası düzəldildi.

## 0.1.0 — İlk versiya
- Next.js 14 + Tailwind, nümunə data, elan yerləşdirmə forması, SEO.
