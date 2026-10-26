# Dəyişikliklər

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
