import type { VacancyView } from "./data";
import type { Dict } from "./dictionaries";
import { fmt, type Locale } from "./i18n";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://isyeri.az";
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const employmentType: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  shift: "FULL_TIME",
  remote: "FULL_TIME",
  internship: "INTERN",
};

export function jobPostingJsonLd(v: VacancyView, locale: Locale) {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.title,
    inLanguage: locale,
    description: `<p>${v.description}</p>` + (v.requirements ? `<ul>${v.requirements.split("\n").map((r) => `<li>${r}</li>`).join("")}</ul>` : ""),
    datePosted: v.publishedAt,
    validThrough: v.expiresAt,
    employmentType: employmentType[v.schedule],
    hiringOrganization: { "@type": "Organization", name: v.company.name },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: v.district ? `${v.district}, ${v.city.name}` : v.city.name, addressCountry: "AZ" },
    },
    identifier: { "@type": "PropertyValue", name: v.company.name, value: v.id },
  };
  if (v.schedule === "remote") ld.jobLocationType = "TELECOMMUTE";
  if (v.salaryMin || v.salaryMax) {
    ld.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "AZN",
      value: { "@type": "QuantitativeValue", minValue: v.salaryMin, maxValue: v.salaryMax, unitText: "MONTH" },
    };
  }
  return ld;
}

export function formatSalary(s: Dict["salary"], min?: number, max?: number) {
  if (min && max) return fmt(s.range, { min, max });
  if (min) return fmt(s.from, { min });
  if (max) return fmt(s.upTo, { max });
  return s.negotiable;
}

export function formatDate(d: Dict["date"], iso: string) {
  const days = Math.floor((Date.now() - +new Date(iso)) / 86400000);
  if (days <= 0) return d.today;
  if (days === 1) return d.yesterday;
  return fmt(d.daysAgo, { n: days });
}
