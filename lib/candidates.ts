import type { Locale } from "./i18n";
import { normalize } from "./i18n";
import { cityNames, categoryNames } from "./content-i18n";
import { byTier, type Tier } from "./boosts";
import { slugify } from "./data";

// CV bazası üçün NÜMUNƏ namizədlər (uydurma şəxslər, saxta nömrələr). Baza qoşulanda Supabase ilə əvəz olunacaq.

type L = Record<Locale, string>;
const l = (az: string, ru: string, en: string): L => ({ az, ru, en });

interface Raw {
  name: string;
  role: L;
  summary: L;
  category: string; // categories slug
  city: string; // cities slug
  years: number;
  salary?: number;
  skills: string[];
  langs: [string, "native" | "good" | "mid" | "basic"][];
  exp: { role: L; company: string; period: string }[];
  edu?: { school: string; degree: L; period: string };
  tier?: Tier;
  age: number; // neçə gün əvvəl
  bumped?: number; // neçə saat əvvəl irəli çəkilib
}

const raw: Raw[] = [
  { name: "Aygün Məmmədova", role: l("Satış məsləhətçisi", "Консультант по продажам", "Sales consultant"), summary: l("Pərakəndə satışda 3 il təcrübə. Aylıq planı ardıcıl olaraq 110%-dən çox yerinə yetirirəm.", "3 года в рознице. Стабильно выполняю месячный план более чем на 110%.", "3 years in retail. I consistently hit over 110% of the monthly target."), category: "satis-marketinq", city: "baki", years: 3, salary: 900, skills: ["Aktiv satış", "1C kassa", "MS Excel"], langs: [["az", "native"], ["ru", "good"], ["en", "mid"]], exp: [{ role: l("Satış məsləhətçisi", "Консультант по продажам", "Sales consultant"), company: "Elektronika mağazası", period: "2023 – 2026" }, { role: l("Kassir", "Кассир", "Cashier"), company: "Supermarket şəbəkəsi", period: "2021 – 2023" }], edu: { school: "ADİU", degree: l("Bakalavr, marketinq", "Бакалавр, маркетинг", "BA, Marketing"), period: "2017 – 2021" }, tier: "gold", age: 2, bumped: 3 },
  { name: "Tural Həsənov", role: l("Frontend developer", "Frontend-разработчик", "Frontend developer"), summary: l("React və TypeScript ilə 4 il. 10+ layihədə interfeys hazırlamışam, uzaqdan işə açığam.", "4 года с React и TypeScript. Делал интерфейсы для 10+ проектов, открыт к удалёнке.", "4 years with React and TypeScript. Built interfaces for 10+ projects, open to remote."), category: "it-proqramlasdirma", city: "baki", years: 4, salary: 3000, skills: ["React", "TypeScript", "Next.js", "Git"], langs: [["az", "native"], ["en", "good"], ["ru", "mid"]], exp: [{ role: l("Frontend developer", "Frontend-разработчик", "Frontend developer"), company: "Orbit İT Solutions", period: "2022 – 2026" }], edu: { school: "ADA Universiteti", degree: l("Bakalavr, kompüter elmləri", "Бакалавр, компьютерные науки", "BSc, Computer Science"), period: "2016 – 2020" }, tier: "gold", age: 5, bumped: 20 },
  { name: "Rəşad Əliyev", role: l("Mühasib", "Бухгалтер", "Accountant"), summary: l("5 il mühasibat təcrübəsi: vergi bəyannamələri, əmək haqqı, 1C.", "5 лет в бухгалтерии: налоговые декларации, зарплата, 1C.", "5 years in accounting: tax returns, payroll, 1C."), category: "muhasibat-maliyye", city: "baki", years: 5, salary: 1500, skills: ["1C", "e-taxes", "Excel", "ƏDV"], langs: [["az", "native"], ["ru", "mid"]], exp: [{ role: l("Baş mühasib köməkçisi", "Помощник главбуха", "Assistant chief accountant"), company: "Zirvə Tikinti", period: "2022 – 2026" }, { role: l("Mühasib", "Бухгалтер", "Accountant"), company: "Ticarət MMC", period: "2019 – 2022" }], edu: { school: "Bakı Biznes Universiteti", degree: l("Bakalavr, mühasibat", "Бакалавр, бухучёт", "BA, Accounting"), period: "2015 – 2019" }, tier: "premium", age: 1 },
  { name: "Elvin Quliyev", role: l("Motokuryer", "Мотокурьер", "Motorbike courier"), summary: l("Öz motosikletim var, Bakını yaxşı tanıyıram. Gündə 25+ sifariş çatdırmışam.", "Есть свой мотоцикл, хорошо знаю Баку. Доставлял 25+ заказов в день.", "I have my own motorbike and know Baku well. Delivered 25+ orders a day."), category: "kuryer-catdirilma", city: "baki", years: 2, salary: 1100, skills: ["A kateqoriya", "Naviqasiya", "Nağd hesab"], langs: [["az", "native"], ["ru", "basic"]], exp: [{ role: l("Kuryer", "Курьер", "Courier"), company: "Sürətli Kuryer", period: "2024 – 2026" }], tier: "premium", age: 3 },
  { name: "Nərmin Hüseynova", role: l("SMM meneceri", "SMM-менеджер", "SMM manager"), summary: l("Meta Ads və kontent planı ilə 3 il. 6 brendin hesabını idarə etmişəm.", "3 года с Meta Ads и контент-планом. Вела аккаунты 6 брендов.", "3 years with Meta Ads and content planning. Managed accounts for 6 brands."), category: "satis-marketinq", city: "baki", years: 3, salary: 1400, skills: ["Meta Ads", "Canva", "Reels", "Hesabat"], langs: [["az", "native"], ["en", "good"], ["ru", "good"]], exp: [{ role: l("SMM meneceri", "SMM-менеджер", "SMM manager"), company: "Pixel Studio", period: "2023 – 2026" }], edu: { school: "BDU", degree: l("Bakalavr, jurnalistika", "Бакалавр, журналистика", "BA, Journalism"), period: "2018 – 2022" }, tier: "premium", age: 4, bumped: 6 },
  { name: "Kamran İsmayılov", role: l("Sürücü", "Водитель", "Driver"), summary: l("B və C kateqoriya, 8 il qəzasız sürücülük. Yük və sərnişin daşımışam.", "Категории B и C, 8 лет без аварий. Возил грузы и пассажиров.", "B and C licence, 8 years accident-free. Have driven cargo and passengers."), category: "neqliyyat-logistika", city: "sumqayit", years: 8, salary: 1200, skills: ["B, C kateqoriya", "Logistika"], langs: [["az", "native"], ["ru", "good"]], exp: [{ role: l("Sürücü", "Водитель", "Driver"), company: "Bakı Logistik MMC", period: "2018 – 2026" }], age: 6 },
  { name: "Leyla Abbasova", role: l("İngilis dili müəllimi", "Преподаватель английского", "English teacher"), summary: l("C1 səviyyə, IELTS hazırlığı üzrə 4 il. Uşaq və böyüklərlə işləyirəm.", "Уровень C1, 4 года подготовки к IELTS. Работаю с детьми и взрослыми.", "C1 level, 4 years of IELTS prep. I teach children and adults."), category: "tehsil-terbiye", city: "baki", years: 4, salary: 1000, skills: ["IELTS", "Speaking club", "Zoom"], langs: [["az", "native"], ["en", "good"], ["ru", "good"]], exp: [{ role: l("Müəllim", "Преподаватель", "Teacher"), company: "Dünya Təhsil Mərkəzi", period: "2022 – 2026" }], edu: { school: "ADU", degree: l("Bakalavr, ingilis filologiyası", "Бакалавр, английская филология", "BA, English Philology"), period: "2016 – 2020" }, age: 2 },
  { name: "Orxan Səfərov", role: l("Ofisiant", "Официант", "Waiter"), summary: l("Restoran və kafedə 2 il. Səliqəli, sürətli, rus dilində sərbəst danışıram.", "2 года в ресторане и кафе. Аккуратный, быстрый, свободно говорю по-русски.", "2 years in restaurants and cafés. Neat, quick, fluent in Russian."), category: "xidmet-iase", city: "baki", years: 2, salary: 750, skills: ["Müştəri xidməti", "Kassa"], langs: [["az", "native"], ["ru", "good"]], exp: [{ role: l("Ofisiant", "Официант", "Waiter"), company: "Qala Kafe", period: "2024 – 2026" }], age: 1 },
  { name: "Səbinə Rzayeva", role: l("Resepşn", "Ресепшионист", "Receptionist"), summary: l("Otel və ofis qəbulunda 2 il. Rus və ingilis dilini bilirəm.", "2 года на ресепшене в отеле и офисе. Знаю русский и английский.", "2 years at hotel and office reception. I speak Russian and English."), category: "ofis-inzibati", city: "baki", years: 2, salary: 850, skills: ["MS Office", "Opera PMS", "Telefon etiketi"], langs: [["az", "native"], ["ru", "good"], ["en", "mid"]], exp: [{ role: l("Resepşn", "Ресепшионист", "Receptionist"), company: "Ulduz Hotel", period: "2024 – 2026" }], age: 7 },
  { name: "Murad Kərimov", role: l("Təmir ustası", "Мастер по ремонту", "Repair technician"), summary: l("10 il mənzil təmiri: suvaq, boya, kafel. Öz alətlərim var.", "10 лет ремонта квартир: штукатурка, покраска, плитка. Свой инструмент.", "10 years of flat renovation: plastering, painting, tiling. I have my own tools."), category: "insaat-temir", city: "gence", years: 10, skills: ["Kafel", "Suvaq", "Boya"], langs: [["az", "native"]], exp: [{ role: l("Usta", "Мастер", "Technician"), company: "Fərdi", period: "2016 – 2026" }], age: 9 },
  { name: "Günay Əhmədova", role: l("Tibb bacısı", "Медсестра", "Nurse"), summary: l("Klinikada 3 il, iynə və damcı prosedurları, növbəli işə hazıram.", "3 года в клинике, уколы и капельницы, готова к сменному графику.", "3 years in a clinic, injections and IVs, ready for shift work."), category: "sehiyye", city: "baki", years: 3, salary: 900, skills: ["Prosedurlar", "Qeydiyyat"], langs: [["az", "native"], ["ru", "mid"]], exp: [{ role: l("Tibb bacısı", "Медсестра", "Nurse"), company: "Şəfa Klinika", period: "2023 – 2026" }], edu: { school: "Bakı Tibb Kolleci", degree: l("Orta tibb təhsili", "Среднее медицинское", "Nursing diploma"), period: "2019 – 2022" }, age: 4 },
  { name: "Fərid Nağıyev", role: l("Təcrübəçi marketoloq", "Стажёр-маркетолог", "Marketing intern"), summary: l("4-cü kurs tələbəsiyəm, Google Analytics sertifikatım var, öyrənməyə hazıram.", "Студент 4 курса, есть сертификат Google Analytics, готов учиться.", "Final-year student with a Google Analytics certificate, eager to learn."), category: "telebe-tecrube", city: "baki", years: 0, skills: ["Google Analytics", "Canva", "Excel"], langs: [["az", "native"], ["en", "good"]], exp: [], edu: { school: "UNEC", degree: l("Bakalavr, marketinq (davam edir)", "Бакалавр, маркетинг (учусь)", "BA, Marketing (ongoing)"), period: "2022 – 2026" }, age: 0 },
];

const LANG_NAMES: Record<Locale, Record<string, string>> = {
  az: { az: "Azərbaycan", ru: "Rus", en: "İngilis" },
  ru: { az: "Азербайджанский", ru: "Русский", en: "Английский" },
  en: { az: "Azerbaijani", ru: "Russian", en: "English" },
};
const LEVELS: Record<Locale, Record<string, string>> = {
  az: { native: "ana dili", good: "yaxşı", mid: "orta", basic: "başlanğıc" },
  ru: { native: "родной", good: "хорошо", mid: "средне", basic: "базовый" },
  en: { native: "native", good: "fluent", mid: "intermediate", basic: "basic" },
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export interface CandidateView {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role: string;
  summary: string;
  category: { slug: string; name: string };
  city: { slug: string; name: string };
  years: number;
  salary?: number;
  skills: string[];
  languages: string[];
  experience: { role: string; company: string; period: string }[];
  education?: { school: string; degree: string; period: string };
  phone: string;
  tier?: Tier;
  publishedAt: string;
  bumpedAt?: string;
}

const all = raw.map((r, i) => ({ ...r, id: `cv${i + 1}`, slug: `${slugify(r.name)}-${slugify(r.role.az)}-${i + 1}`, phone: `+994 50 000 01 ${String(i + 10).padStart(2, "0")}` }));

function view(r: (typeof all)[number], locale: Locale): CandidateView {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    initials: r.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join(""),
    role: r.role[locale],
    summary: r.summary[locale],
    category: { slug: r.category, name: categoryNames[r.category]?.[locale] ?? r.category },
    city: { slug: r.city, name: cityNames[r.city]?.[locale]?.[0] ?? r.city },
    years: r.years,
    salary: r.salary,
    skills: r.skills,
    languages: r.langs.map(([c, lv]) => `${LANG_NAMES[locale][c]} — ${LEVELS[locale][lv]}`),
    experience: r.exp.map((e) => ({ role: e.role[locale], company: e.company, period: e.period })),
    education: r.edu ? { school: r.edu.school, degree: r.edu.degree[locale], period: r.edu.period } : undefined,
    phone: r.phone,
    tier: r.tier,
    publishedAt: hoursAgo(r.age * 24 + 2),
    bumpedAt: r.bumped !== undefined ? hoursAgo(r.bumped) : undefined,
  };
}

export interface CvFilters { q?: string; category?: string; city?: string }

export async function getCandidates(locale: Locale, f: CvFilters = {}): Promise<CandidateView[]> {
  const q = f.q?.trim() ? normalize(f.q.trim()) : "";
  return all
    .map((r) => view(r, locale))
    .filter((c) => {
      if (f.category && c.category.slug !== f.category) return false;
      if (f.city && c.city.slug !== f.city) return false;
      if (q && !normalize(`${c.name} ${c.role} ${c.summary} ${c.skills.join(" ")} ${c.city.name}`).includes(q)) return false;
      return true;
    })
    .sort(byTier);
}

export async function getCandidateBySlug(locale: Locale, slug: string) {
  const r = all.find((x) => x.slug === slug);
  return r ? view(r, locale) : null;
}
