/**
 * SEO completeness scoring (0-100) for a content record.
 * Used for badges in admin and the SEO Overview dashboard.
 */

export interface SeoScoreInput {
  title?: string | null; // base title (title_ar / name_ar / hero_title)
  body?: string | null; // body / content text
  slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  canonical_url?: string | null;
  schema_type?: string | null;
  noindex?: boolean | null;
}

export interface SeoScoreResult {
  score: number; // 0-100
  level: "red" | "yellow" | "green";
  checks: { label: string; ok: boolean; weight: number }[];
}

export function calcSeoScore(r: SeoScoreInput): SeoScoreResult {
  const mt = (r.meta_title ?? "").trim();
  const md = (r.meta_description ?? "").trim();
  const checks = [
    { label: "Meta title موجود", ok: mt.length > 0, weight: 12 },
    { label: "Meta title بطول مناسب (30-60)", ok: mt.length >= 30 && mt.length <= 60, weight: 10 },
    { label: "Meta description موجود", ok: md.length > 0, weight: 12 },
    { label: "Meta description بطول مناسب (120-160)", ok: md.length >= 120 && md.length <= 160, weight: 10 },
    { label: "Slug موجود", ok: !!(r.slug ?? "").trim(), weight: 6 },
    { label: "كلمات مفتاحية", ok: !!(r.keywords ?? "").trim(), weight: 6 },
    { label: "og:image", ok: !!(r.og_image ?? "").trim(), weight: 10 },
    { label: "og:title", ok: !!(r.og_title ?? "").trim(), weight: 6 },
    { label: "og:description", ok: !!(r.og_description ?? "").trim(), weight: 6 },
    { label: "Canonical URL", ok: !!(r.canonical_url ?? "").trim(), weight: 6 },
    { label: "Schema.org type", ok: !!(r.schema_type ?? "").trim(), weight: 6 },
    { label: "محتوى نصي كافٍ (300+ حرف)", ok: (r.body ?? "").length >= 300, weight: 6 },
    { label: "غير مخفي عن المحركات", ok: !r.noindex, weight: 4 },
  ];
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
  const score = Math.round((earned / totalWeight) * 100);
  const level: SeoScoreResult["level"] = score >= 80 ? "green" : score >= 50 ? "yellow" : "red";
  return { score, level, checks };
}