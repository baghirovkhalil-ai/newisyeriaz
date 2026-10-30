import type { Locale } from "./i18n";
import { normalize } from "./i18n";
import { categoryNames, cityNames, districtNames, templateTr } from "./content-i18n";
import { byTier, type Tier } from "./boosts";
import { loadFeed, toExternalView } from "./external";

export type Schedule = "full_time" | "part_time" | "shift" | "remote" | "internship";

export interface City { id: number; name: string; slug: string; loc: string }
export interface Category { id: number; name: string; slug: string }
export interface Company { id: string; name: string; slug: string; description?: string }
export interface Vacancy {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements?: string;
  companyId: string;
  categoryId: number;
  cityId: number;
  district?: string;
  salaryMin?: number;
  salaryMax?: number;
  schedule: Schedule;
  experienceYears: number;
  contactPhone?: string;
  contactTelegram?: string;
  /** Ödənişli önə çıxarma: gold > premium > adi */
  tier?: Tier;
  /** Son «İrəli çək» vaxtı */
  bumpedAt?: string;
  publishedAt: string;
  expiresAt: string;
  tpl?: number;
  /** Başqa iş saytından gətirilən elan: kart orijinal elana aparır */
  external?: { url: string; source: string };
}
export interface VacancyView extends Vacancy { company: Company; category: Category; city: City }


const cities: City[] = [
  { id: 1, name: "Bakı", slug: "baki", loc: "" },
  { id: 2, name: "Sumqayıt", slug: "sumqayit", loc: "" },
  { id: 3, name: "Gəncə", slug: "gence", loc: "" },
  { id: 4, name: "Mingəçevir", slug: "mingecevir", loc: "" },
  { id: 5, name: "Lənkəran", slug: "lenkeran", loc: "" },
  { id: 6, name: "Şəki", slug: "seki", loc: "" },
  { id: 7, name: "Regionlar", slug: "regionlar", loc: "" },
];

const bakuDistricts = ["Nəsimi", "Yasamal", "Nərimanov", "Nizami", "Xətai", "Binəqədi", "Səbail", "Suraxanı", "Sabunçu", "Xəzər", "Qaradağ", "Pirallahı"];

const categories: Category[] = [
  { id: 1, name: "Satış və marketinq", slug: "satis-marketinq" },
  { id: 2, name: "Kuryer və çatdırılma", slug: "kuryer-catdirilma" },
  { id: 3, name: "Xidmət və ictimai iaşə", slug: "xidmet-iase" },
  { id: 4, name: "Ofis və inzibati", slug: "ofis-inzibati" },
  { id: 5, name: "Mühasibat və maliyyə", slug: "muhasibat-maliyye" },
  { id: 6, name: "İT və proqramlaşdırma", slug: "it-proqramlasdirma" },
  { id: 7, name: "Dizayn və kreativ", slug: "dizayn-kreativ" },
  { id: 8, name: "Təhsil və tərbiyə", slug: "tehsil-terbiye" },
  { id: 9, name: "Səhiyyə", slug: "sehiyye" },
  { id: 10, name: "İnşaat və təmir", slug: "insaat-temir" },
  { id: 11, name: "Nəqliyyat və logistika", slug: "neqliyyat-logistika" },
  { id: 12, name: "İstehsalat və sənaye", slug: "istehsalat-senaye" },
  { id: 13, name: "Mühafizə və təhlükəsizlik", slug: "muhafize-tehlukesizlik" },
  { id: 14, name: "Turizm və otel", slug: "turizm-otel" },
  { id: 15, name: "Hüquq", slug: "huquq" },
  { id: 16, name: "Müştəri xidmətləri", slug: "musteri-xidmetleri" },
  { id: 17, name: "Tələbə və təcrübə", slug: "telebe-tecrube" },
];

const companyNames = [
  "Nümunə Market MMC", "Sürətli Kuryer", "Pixel Studio", "Qala Kafe", "Aqro Plus ASC",
  "Zirvə Tikinti", "Mavi Dəniz Otel", "Bakı Logistik MMC", "Dünya Təhsil Mərkəzi", "Şəfa Klinika",
  "Yaşıl Bağ Restoran", "Texno Servis", "Alma Kosmetika", "Sahil Mühafizə", "Nur Hüquq Ofisi",
  "Kamran Auto Servis", "Günəş Pərakəndə", "Orbit İT Solutions", "Ulduz Hotel", "Bərəkət Tədarük",
];

export function slugify(s: string) {
  const map: Record<string, string> = { ə: "e", Ə: "e", ı: "i", İ: "i", ö: "o", Ö: "o", ü: "u", Ü: "u", ş: "s", Ş: "s", ç: "c", Ç: "c", ğ: "g", Ğ: "g" };
  return s
    .replace(/[əƏıİöÖüÜşŞçÇğĞ]/g, (c) => map[c])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const companies: Company[] = companyNames.map((name, i) => ({ id: `c${i + 1}`, name, slug: slugify(name) }));

type T = [string, string, number, number, Schedule, number, string, string];
const templates: T[] = [
  ["Satış məsləhətçisi", "satis-marketinq", 700, 1000, "shift", 0, "Mağaza daxilində müştərilərə xidmət, malların düzülüşü və kassa ilə işləmək.", "Ünsiyyət bacarığı|Təcrübə tələb olunmur|Növbə qrafikinə uyğunluq"],
  ["Satış meneceri", "satis-marketinq", 1200, 2200, "full_time", 1, "Yeni müştərilərin cəlb edilməsi, danışıqlar və satış planının icrası.", "Satış təcrübəsi|Danışıq bacarığı|Sürücülük vəsiqəsi üstünlükdür"],
  ["SMM meneceri", "satis-marketinq", 1200, 2000, "remote", 1, "Müştəri hesablarında məzmun planı, reklam kampaniyaları və hesabatlar.", "Meta Ads təcrübəsi|Məzmun planlaşdırma|Hesabat hazırlamaq"],
  ["Motokuryer", "kuryer-catdirilma", 900, 1500, "full_time", 0, "Şəhər daxilində sifarişlərin çatdırılması. Gündəlik ödəniş mümkündür.", "Şəxsi motosiklet|Şəhəri yaxşı bilmək"],
  ["Avtomobil kuryeri", "kuryer-catdirilma", 1000, 1600, "full_time", 1, "Ofis sənədləri və bağlamaların avtomobillə çatdırılması.", "B kateqoriyalı vəsiqə|Şəxsi və ya şirkət avtomobili"],
  ["Ofisiant", "xidmet-iase", 600, 900, "shift", 0, "Restoran və kafedə müştəri xidməti. Çay pulu ayrıca.", "Səliqəli görünüş|Azərbaycan və rus dili"],
  ["Aşpaz köməkçisi", "xidmet-iase", 700, 1000, "shift", 0, "Mətbəxdə hazırlıq işləri və aşpaza köməklik.", "Təmizliyə riayət|Komandada işləmək"],
  ["Barista", "xidmet-iase", 700, 1000, "shift", 0, "Qəhvə hazırlanması və müştəri xidməti.", "Təcrübə üstünlükdür|Mehriban davranış"],
  ["Ofis meneceri", "ofis-inzibati", 1000, 1500, "full_time", 1, "Ofisin gündəlik işinin təşkili, sənəd dövriyyəsi və təchizat.", "MS Office|Təşkilatçılıq bacarığı"],
  ["Resepşn", "ofis-inzibati", 700, 1000, "shift", 0, "Qonaqların qarşılanması, zənglərin cavablandırılması.", "Səliqəli görünüş|Rus və ingilis dili"],
  ["Mühasib", "muhasibat-maliyye", 1300, 2000, "full_time", 2, "Tam mühasibat uçotu, vergi hesabatları və kadr sənədləri.", "Ali təhsil|1C və ASAN imza|2 il təcrübə"],
  ["Kassir", "muhasibat-maliyye", 700, 950, "shift", 0, "Kassa əməliyyatları və gündəlik hesabat.", "Diqqətlilik|Kassa aparatı ilə iş"],
  ["Frontend developer", "it-proqramlasdirma", 2500, 4500, "remote", 2, "React ilə veb tətbiqlərin hazırlanması.", "React, TypeScript|Git|2 il təcrübə"],
  ["Python developer", "it-proqramlasdirma", 2500, 4500, "remote", 2, "Backend servislərin və API-lərin hazırlanması.", "Python, FastAPI və ya Django|SQL|2 il təcrübə"],
  ["IT dəstək mütəxəssisi", "it-proqramlasdirma", 900, 1400, "full_time", 1, "İstifadəçi dəstəyi, şəbəkə və kompüter qurulumu.", "Windows və şəbəkə bilikləri|Müştəri yönümlülük"],
  ["Qrafik dizayner", "dizayn-kreativ", 1000, 1600, "part_time", 1, "Sosial şəbəkə postları, bannerlər və brend materialları.", "Portfolio|Figma, Photoshop"],
  ["Video montajçı", "dizayn-kreativ", 900, 1500, "part_time", 0, "Reels və qısa videoların montajı.", "Premiere və ya CapCut|Yaradıcılıq"],
  ["İngilis dili müəllimi", "tehsil-terbiye", 800, 1400, "part_time", 1, "Tədris mərkəzində qrup və fərdi dərslər.", "B2+ səviyyə|Tədris təcrübəsi üstünlükdür"],
  ["Dayə", "tehsil-terbiye", 600, 900, "full_time", 0, "Uşaq baxımı və gündəlik qayğı.", "Məsuliyyətlilik|Tövsiyə məktubu üstünlükdür"],
  ["Tibb bacısı", "sehiyye", 800, 1200, "shift", 1, "Klinikada həkimə köməklik və müalicə prosedurları.", "Orta tibb təhsili|Növbəli iş"],
  ["Təmir ustası", "insaat-temir", 1000, 1800, "full_time", 1, "Mənzil və ofis təmiri, boyaq və suvaq işləri.", "Təmir təcrübəsi|Öz alətləri"],
  ["Tikinti fəhləsi", "insaat-temir", 700, 1100, "full_time", 0, "Tikinti obyektində köməkçi işlər.", "Fiziki dözümlülük|Təcrübə tələb olunmur"],
  ["Sürücü", "neqliyyat-logistika", 900, 1400, "full_time", 1, "Şirkət avtomobili ilə daşımalar.", "B və ya C kateqoriya|Təmiz sürücülük tarixçəsi"],
  ["Anbardar", "neqliyyat-logistika", 800, 1200, "shift", 1, "Malların qəbulu, sayılması və anbarda düzülüşü.", "Diqqətlilik|Anbar proqramı bilgisi"],
  ["İstehsalat operatoru", "istehsalat-senaye", 750, 1100, "shift", 0, "İstehsal xəttində avadanlığa nəzarət.", "Növbə qrafiki|Təlim şirkət tərəfindən"],
  ["Mühafizəçi", "muhafize-tehlukesizlik", 600, 850, "shift", 0, "Obyektin qorunması və giriş-çıxış nəzarəti.", "Sağlam olmaq|Məsuliyyətlilik"],
  ["Otel administratoru", "turizm-otel", 800, 1200, "shift", 1, "Qonaqların qeydiyyatı və otaq fondunun idarəsi.", "Rus və ingilis dili|Müştəri xidməti"],
  ["Vəkil köməkçisi", "huquq", 900, 1400, "full_time", 1, "Sənədlərin hazırlanması və məhkəmə prosesində dəstək.", "Hüquq təhsili|Diqqətlilik"],
  ["Çağrı mərkəzi operatoru", "musteri-xidmetleri", 700, 1000, "shift", 0, "Daxil olan zənglərin cavablandırılması və müştəri sorğuları.", "Aydın danışıq|Kompüter bilgisi"],
  ["Tələbə köməkçi (part-time)", "telebe-tecrube", 400, 600, "part_time", 0, "Dərsdən sonra çevik qrafiklə köməkçi iş.", "Tələbə olmaq|Çevik qrafik"],
  ["Təcrübəçi marketoloq", "telebe-tecrube", 300, 500, "internship", 0, "Marketinq komandasında təcrübə proqramı.", "Marketinqə maraq|Sosial şəbəkə bilgisi"],
];

const pad2 = (n: number) => String(n % 100).padStart(2, "0");
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

const vacancies: Vacancy[] = Array.from({ length: templates.length * 3 }, (_, i) => {
  const [title, catSlug, min, max, schedule, exp, description, req] = templates[i % templates.length];
  const company = companies[(i * 7 + Math.floor(i / templates.length)) % companies.length];
  const r = i % 10;
  const city = schedule === "remote" || r < 7 ? cities[0] : r === 7 ? cities[1] : r === 8 ? cities[2] : cities[3 + (i % 3)];
  const district = city.slug === "baki" && schedule !== "remote" ? bakuDistricts[(i * 5) % bakuDistricts.length] : undefined;
  const age = (i * 3) % 20;
  const shift = (i % 4) * 50;
  return {
    id: `v${i + 1}`,
    tpl: i % templates.length,
    slug: `${slugify(title)}-${city.slug}-${slugify(company.name)}-${i + 1}`,
    title,
    description,
    requirements: req.split("|").join("\n"),
    companyId: company.id,
    categoryId: categories.find((c) => c.slug === catSlug)!.id,
    cityId: city.id,
    district,
    salaryMin: min + shift,
    salaryMax: max + shift,
    schedule,
    experienceYears: exp,
    contactPhone: i % 3 === 2 ? undefined : `+9945000000${pad2(i)}`,
    contactTelegram: i % 3 === 0 ? "demo_hr" : undefined,
    tier: i % 16 === 0 ? "gold" : i % 11 === 3 ? "premium" : undefined,
    bumpedAt: i % 11 === 5 ? new Date(Date.now() - ((i * 37) % 20) * 3600000).toISOString() : undefined,
    publishedAt: daysAgo(age),
    expiresAt: inDays(30 - age),
  };
});

const localeCity = (c: City, l: Locale): City => ({ ...c, name: cityNames[c.slug][l][0], loc: cityNames[c.slug][l][1] });
const localeCat = (c: Category, l: Locale): Category => ({ ...c, name: categoryNames[c.slug][l] });
const districtLabel = (d: string, l: Locale) => (l === "az" ? d : districtNames[d]?.[l] ?? d);

function toView(v: Vacancy, l: Locale): VacancyView {
  const tr = l !== "az" && v.tpl !== undefined ? templateTr[l][v.tpl] : undefined;
  return {
    ...v,
    title: tr ? tr[0] : v.title,
    description: tr ? tr[1] : v.description,
    requirements: tr ? tr[2].split("|").join("\n") : v.requirements,
    district: v.district ? districtLabel(v.district, l) : undefined,
    company: companies.find((c) => c.id === v.companyId)!,
    category: localeCat(categories.find((c) => c.id === v.categoryId)!, l),
    city: localeCity(cities.find((c) => c.id === v.cityId)!, l),
  };
}

export interface Filters {
  q?: string;
  category?: string;
  city?: string;
  schedule?: string;
  minSalary?: number;
}

/** opts.external: digər saytlardan gətirilən elanları da qoş (yalnız Vakansiyalar siyahısı və sahə səhifələri) */
export async function getVacancies(locale: Locale, f: Filters = {}, opts: { external?: boolean } = {}): Promise<VacancyView[]> {
  const q = f.q?.trim() ? normalize(f.q.trim()) : "";
  const own = vacancies
    .filter((raw) => {
      const v = toView(raw, locale);
      if (q && !normalize(`${v.title} ${raw.title} ${v.company.name} ${v.description} ${v.city.name} ${cityNames[v.city.slug].az[0]}`).includes(q)) return false;
      if (f.category && v.category.slug !== f.category) return false;
      if (f.city && v.city.slug !== f.city) return false;
      if (f.schedule && v.schedule !== f.schedule) return false;
      if (f.minSalary && (v.salaryMax ?? v.salaryMin ?? 0) < f.minSalary) return false;
      return true;
    })
    .map((raw) => toView(raw, locale));
  if (!opts.external || f.schedule || f.minSalary) return own.sort(byTier); // qrafik/maaş məlum deyil: bu süzgəclərdə göstərilmir
  const cats = categories.map((c) => localeCat(c, locale)), cts = cities.map((c) => localeCity(c, locale));
  const ext = (await loadFeed())
    .map((j) => toExternalView(j, cats, cts))
    .filter((v): v is VacancyView => !!v)
    .filter((v) => {
      if (q && !normalize(`${v.title} ${v.company.name} ${v.city.name}`).includes(q)) return false;
      if (f.category && v.category.slug !== f.category) return false;
      if (f.city && v.city.slug !== f.city) return false;
      return true;
    });
  return [...own, ...ext].sort(byTier);
}

export async function getVacancyBySlug(locale: Locale, slug: string) {
  const v = vacancies.find((x) => x.slug === slug);
  return v ? toView(v, locale) : null;
}

export async function getCategoryCounts() {
  const counts: Record<string, number> = {};
  for (const v of vacancies) {
    const slug = categories.find((c) => c.id === v.categoryId)!.slug;
    counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

export async function getNonEmptyCombos() {
  const set = new Set<string>();
  for (const v of vacancies) {
    const c = cities.find((x) => x.id === v.cityId)!.slug;
    const k = categories.find((x) => x.id === v.categoryId)!.slug;
    set.add(`${c}/${k}`);
  }
  return Array.from(set).map((s) => { const [city, category] = s.split("/"); return { city, category }; });
}

export async function getVacancySlugs() { return vacancies.map((v) => ({ slug: v.slug, publishedAt: v.publishedAt })); }
export async function getCategories(locale: Locale) { return categories.map((c) => localeCat(c, locale)); }
export async function getCities(locale: Locale) { return cities.map((c) => localeCity(c, locale)); }
/** value həmişə Azərbaycan dilindəki ad (bazada belə saxlanacaq), label seçilmiş dildə */
export async function getBakuDistricts(locale: Locale) { return bakuDistricts.map((d) => ({ value: d, label: districtLabel(d, locale) })); }
export async function getCityBySlug(locale: Locale, slug: string) { const c = cities.find((x) => x.slug === slug); return c ? localeCity(c, locale) : null; }
export async function getCategoryBySlug(locale: Locale, slug: string) { const c = categories.find((x) => x.slug === slug); return c ? localeCat(c, locale) : null; }
