import type { Locale } from "./i18n";

// Nümunə CV-lər (uydurma şəxslər). Əlaqə məlumatları qəsdən saxtadır.
export type CvSample = {
  id: string;
  field: string;
  name: string;
  role: string;
  city: string;
  phone: string;
  email: string;
  summary: string;
  experience: { role: string; company: string; period: string; points: string[] }[];
  education: { degree: string; school: string; period: string }[];
  skills: string[];
  languages: string[];
};

const contact = (i: number) => ({ phone: `+994 50 000 00 0${i}`, email: `numune${i}@example.com` });

const az: CvSample[] = [
  {
    id: "satis",
    field: "Satış",
    name: "Aygün Məmmədova",
    role: "Satış məsləhətçisi",
    city: "Bakı",
    ...contact(1),
    summary: "Pərakəndə satışda 3 il təcrübəli, müştəri ilə ünsiyyəti güclü məsləhətçi. Aylıq satış planını ardıcıl olaraq 110%-dən çox yerinə yetirmişəm.",
    experience: [
      { role: "Satış məsləhətçisi", company: "Elektronika mağazası, 28 Mall", period: "2023 – indi", points: ["Aylıq planın orta hesabla 115%-i", "Kassa və anbar qalığına nəzarət", "2 yeni işçinin öyrədilməsi"] },
      { role: "Kassir", company: "Supermarket şəbəkəsi", period: "2021 – 2023", points: ["Gündə 200+ müştəriyə xidmət", "Kassa uyğunsuzluğu sıfır"] },
    ],
    education: [{ degree: "Bakalavr, Marketinq", school: "Azərbaycan Dövlət İqtisad Universiteti", period: "2017 – 2021" }],
    skills: ["Aktiv satış", "Müştəri xidməti", "1C kassa", "Etirazlarla iş", "MS Excel"],
    languages: ["Azərbaycan — ana dili", "Rus — yaxşı", "İngilis — orta"],
  },
  {
    id: "muhasib",
    field: "Maliyyə",
    name: "Rəşad Əliyev",
    role: "Mühasib",
    city: "Bakı",
    ...contact(2),
    summary: "Kiçik və orta şirkətlərdə 5 il mühasibat təcrübəsi. Vergi bəyannamələri, əmək haqqı hesablanması və 1C proqramında sərbəst işləyirəm.",
    experience: [
      { role: "Baş mühasib köməkçisi", company: "Tikinti şirkəti", period: "2022 – indi", points: ["Aylıq və rüblük vergi bəyannamələri", "60 nəfərlik əmək haqqı cədvəli", "Bank çıxarışlarının uzlaşdırılması"] },
      { role: "Mühasib", company: "Ticarət MMC", period: "2019 – 2022", points: ["İlkin sənədlərin uçotu", "Kontragentlərlə tutuşdurma aktları"] },
    ],
    education: [{ degree: "Bakalavr, Mühasibat uçotu və audit", school: "Bakı Biznes Universiteti", period: "2015 – 2019" }],
    skills: ["1C: Mühasibat", "e-taxes.gov.az", "Əmək haqqı", "MS Excel (VLOOKUP, pivot)", "ƏDV uçotu"],
    languages: ["Azərbaycan — ana dili", "Rus — orta", "İngilis — başlanğıc"],
  },
  {
    id: "it",
    field: "İT",
    name: "Tural Həsənov",
    role: "Frontend developer",
    city: "Bakı (uzaqdan da olar)",
    ...contact(3),
    summary: "React və Next.js ilə 2 il kommersiya təcrübəsi. Sürətli, mobil uyğun və SEO-dostu interfeyslər qururam.",
    experience: [
      { role: "Frontend developer", company: "Rəqəmsal agentlik", period: "2024 – indi", points: ["8 müştəri saytının Next.js ilə hazırlanması", "Səhifə yüklənmə sürətinin 40% artırılması", "Dizaynerlərlə Figma üzərində iş"] },
      { role: "Təcrübəçi developer", company: "Startap", period: "2023 – 2024", points: ["Admin panel komponentləri", "REST API inteqrasiyası"] },
    ],
    education: [{ degree: "Bakalavr, Kompüter elmləri", school: "ADA Universiteti", period: "2019 – 2023" }],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git", "REST API"],
    languages: ["Azərbaycan — ana dili", "İngilis — yaxşı", "Türk — yaxşı"],
  },
  {
    id: "kuryer",
    field: "Logistika",
    name: "Elvin Quliyev",
    role: "Kuryer / sürücü",
    city: "Bakı",
    ...contact(4),
    summary: "Bakı küçələrini yaxşı tanıyan, məsuliyyətli kuryer. B kateqoriyalı sürücülük vəsiqəm və şəxsi avtomobilim var.",
    experience: [
      { role: "Kuryer", company: "Yemək çatdırılması xidməti", period: "2023 – indi", points: ["Gündə 25+ sifariş", "Müştəri reytinqi 4.9 / 5", "Gecikmə faizi 2%-dən az"] },
      { role: "Ekspeditor", company: "Topdan satış anbarı", period: "2021 – 2023", points: ["Mağazalara mal çatdırılması", "Qaimələrin yoxlanması"] },
    ],
    education: [{ degree: "Orta təhsil", school: "Bakı şəhəri 132 nömrəli məktəb", period: "2010 – 2021" }],
    skills: ["B kateqoriya", "Google Maps / Waze", "Nağd və kart ödənişi", "Vaxt idarəetməsi"],
    languages: ["Azərbaycan — ana dili", "Rus — orta"],
  },
];

const ru: CvSample[] = [
  {
    ...az[0],
    field: "Продажи",
    name: "Айгюн Мамедова",
    role: "Консультант по продажам",
    city: "Баку",
    summary: "Консультант с 3-летним опытом в рознице и сильными навыками общения. Стабильно выполняю месячный план продаж более чем на 110%.",
    experience: [
      { role: "Консультант по продажам", company: "Магазин электроники, 28 Mall", period: "2023 – наст. время", points: ["В среднем 115% месячного плана", "Контроль кассы и остатков склада", "Обучение 2 новых сотрудников"] },
      { role: "Кассир", company: "Сеть супермаркетов", period: "2021 – 2023", points: ["Обслуживание 200+ клиентов в день", "Ноль расхождений по кассе"] },
    ],
    education: [{ degree: "Бакалавр, маркетинг", school: "Азербайджанский государственный экономический университет", period: "2017 – 2021" }],
    skills: ["Активные продажи", "Обслуживание клиентов", "Касса 1С", "Работа с возражениями", "MS Excel"],
    languages: ["Азербайджанский — родной", "Русский — хороший", "Английский — средний"],
  },
  {
    ...az[1],
    field: "Финансы",
    name: "Рашад Алиев",
    role: "Бухгалтер",
    city: "Баку",
    summary: "5 лет бухгалтерского опыта в малых и средних компаниях. Свободно работаю с налоговыми декларациями, расчётом зарплаты и 1С.",
    experience: [
      { role: "Помощник главного бухгалтера", company: "Строительная компания", period: "2022 – наст. время", points: ["Месячные и квартальные налоговые декларации", "Зарплатная ведомость на 60 человек", "Сверка банковских выписок"] },
      { role: "Бухгалтер", company: "Торговое ООО", period: "2019 – 2022", points: ["Учёт первичных документов", "Акты сверки с контрагентами"] },
    ],
    education: [{ degree: "Бакалавр, бухучёт и аудит", school: "Бакинский университет бизнеса", period: "2015 – 2019" }],
    skills: ["1С: Бухгалтерия", "e-taxes.gov.az", "Расчёт зарплаты", "MS Excel (ВПР, сводные)", "Учёт НДС"],
    languages: ["Азербайджанский — родной", "Русский — средний", "Английский — начальный"],
  },
  {
    ...az[2],
    field: "IT",
    name: "Турал Гасанов",
    role: "Frontend-разработчик",
    city: "Баку (возможно удалённо)",
    summary: "2 года коммерческого опыта с React и Next.js. Делаю быстрые, адаптивные и SEO-дружелюбные интерфейсы.",
    experience: [
      { role: "Frontend-разработчик", company: "Цифровое агентство", period: "2024 – наст. время", points: ["8 клиентских сайтов на Next.js", "Ускорение загрузки страниц на 40%", "Работа с дизайнерами в Figma"] },
      { role: "Стажёр-разработчик", company: "Стартап", period: "2023 – 2024", points: ["Компоненты админ-панели", "Интеграция REST API"] },
    ],
    education: [{ degree: "Бакалавр, компьютерные науки", school: "Университет ADA", period: "2019 – 2023" }],
    languages: ["Азербайджанский — родной", "Английский — хороший", "Турецкий — хороший"],
  },
  {
    ...az[3],
    field: "Логистика",
    name: "Эльвин Гулиев",
    role: "Курьер / водитель",
    city: "Баку",
    summary: "Ответственный курьер, хорошо знаю улицы Баку. Права категории B и личный автомобиль.",
    experience: [
      { role: "Курьер", company: "Сервис доставки еды", period: "2023 – наст. время", points: ["25+ заказов в день", "Рейтинг клиентов 4.9 / 5", "Опозданий менее 2%"] },
      { role: "Экспедитор", company: "Оптовый склад", period: "2021 – 2023", points: ["Доставка товара в магазины", "Проверка накладных"] },
    ],
    education: [{ degree: "Среднее образование", school: "Школа №132, Баку", period: "2010 – 2021" }],
    skills: ["Категория B", "Google Maps / Waze", "Наличная и карточная оплата", "Тайм-менеджмент"],
    languages: ["Азербайджанский — родной", "Русский — средний"],
  },
];

const en: CvSample[] = [
  {
    ...az[0],
    field: "Sales",
    name: "Aygun Mammadova",
    role: "Sales consultant",
    city: "Baku",
    summary: "Retail sales consultant with 3 years of experience and strong people skills. Consistently hit over 110% of the monthly sales target.",
    experience: [
      { role: "Sales consultant", company: "Electronics store, 28 Mall", period: "2023 – present", points: ["Averaged 115% of monthly target", "Managed till and stock levels", "Trained 2 new hires"] },
      { role: "Cashier", company: "Supermarket chain", period: "2021 – 2023", points: ["Served 200+ customers a day", "Zero till discrepancies"] },
    ],
    education: [{ degree: "BA, Marketing", school: "Azerbaijan State University of Economics", period: "2017 – 2021" }],
    skills: ["Active selling", "Customer service", "1C POS", "Objection handling", "MS Excel"],
    languages: ["Azerbaijani — native", "Russian — good", "English — intermediate"],
  },
  {
    ...az[1],
    field: "Finance",
    name: "Rashad Aliyev",
    role: "Accountant",
    city: "Baku",
    summary: "5 years of accounting experience in small and mid-sized companies. Confident with tax returns, payroll and 1C.",
    experience: [
      { role: "Assistant chief accountant", company: "Construction company", period: "2022 – present", points: ["Monthly and quarterly tax returns", "Payroll for 60 employees", "Bank statement reconciliation"] },
      { role: "Accountant", company: "Trading LLC", period: "2019 – 2022", points: ["Primary document bookkeeping", "Reconciliation statements with suppliers"] },
    ],
    education: [{ degree: "BSc, Accounting and Audit", school: "Baku Business University", period: "2015 – 2019" }],
    skills: ["1C: Accounting", "e-taxes.gov.az", "Payroll", "MS Excel (VLOOKUP, pivots)", "VAT accounting"],
    languages: ["Azerbaijani — native", "Russian — intermediate", "English — basic"],
  },
  {
    ...az[2],
    field: "IT",
    name: "Tural Hasanov",
    role: "Frontend developer",
    city: "Baku (open to remote)",
    summary: "2 years of commercial experience with React and Next.js. I build fast, mobile-friendly, SEO-ready interfaces.",
    experience: [
      { role: "Frontend developer", company: "Digital agency", period: "2024 – present", points: ["Built 8 client sites with Next.js", "Cut page load time by 40%", "Worked with designers in Figma"] },
      { role: "Developer intern", company: "Startup", period: "2023 – 2024", points: ["Admin panel components", "REST API integration"] },
    ],
    education: [{ degree: "BSc, Computer Science", school: "ADA University", period: "2019 – 2023" }],
    languages: ["Azerbaijani — native", "English — good", "Turkish — good"],
  },
  {
    ...az[3],
    field: "Logistics",
    name: "Elvin Guliyev",
    role: "Courier / driver",
    city: "Baku",
    summary: "Reliable courier who knows Baku's streets well. Category B licence and own car.",
    experience: [
      { role: "Courier", company: "Food delivery service", period: "2023 – present", points: ["25+ orders a day", "Customer rating 4.9 / 5", "Under 2% late deliveries"] },
      { role: "Delivery driver", company: "Wholesale warehouse", period: "2021 – 2023", points: ["Delivered goods to shops", "Checked delivery notes"] },
    ],
    education: [{ degree: "Secondary school", school: "School No. 132, Baku", period: "2010 – 2021" }],
    skills: ["Category B licence", "Google Maps / Waze", "Cash and card payments", "Time management"],
    languages: ["Azerbaijani — native", "Russian — intermediate"],
  },
];

const samples: Record<Locale, CvSample[]> = { az, ru, en };
export const getCvSamples = (locale: Locale) => samples[locale];

/** KarYera AI — CV-ni süni intellektlə hazırlayan ayrıca alət */
export const KARYERA_URL = process.env.NEXT_PUBLIC_KARYERA_URL || "https://karyera-ai.vercel.app";

/** KarYera AI linki: hansı düymədən gəldiyini görmək üçün UTM ilə */
export const karyeraLink = (from: string) => `${KARYERA_URL}/?utm_source=isyeri&utm_medium=referral&utm_campaign=${from}`;
