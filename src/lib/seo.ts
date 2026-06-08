// Centralized SEO helpers. Update BASE_URL when the production domain changes.
export const BASE_URL = "https://art-traffics.com";
export const SITE_NAME_AR = "ارت ترافيك";
export const SITE_NAME_EN = "Art Traffic";

export function absUrl(path: string): string {
  if (!path) return BASE_URL;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build hreflang <link> tags for a given path.
 * Until /en routing exists we self-reference ar-SA + x-default; the EN
 * variant can be added once the bilingual routes ship.
 */
export function hreflangLinks(path: string) {
  const ar = absUrl(path);
  return [
    { rel: "alternate", hreflang: "ar-SA", href: ar },
    { rel: "alternate", hreflang: "x-default", href: ar },
  ];
}

export interface Crumb { name: string; path: string }

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME_AR,
  alternateName: SITE_NAME_EN,
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  areaServed: { "@type": "Country", name: "Saudi Arabia" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+966-541-325-922",
    contactType: "customer service",
    areaServed: "SA",
    availableLanguage: ["Arabic", "English"],
  },
};