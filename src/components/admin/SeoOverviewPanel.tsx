import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calcSeoScore } from "@/lib/seo-score";
import { AlertTriangle, Image as ImageIcon, FileText, Type, Gauge, Copy, Link as LinkIcon, X } from "lucide-react";

interface Row {
  table: "services" | "cities" | "blog_posts";
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  canonical_url: string | null;
  keywords: string | null;
  schema_type: string | null;
  noindex: boolean | null;
  body: string | null;
}

async function fetchAll(): Promise<Row[]> {
  const cols = "id, slug, meta_title, meta_description, og_image, og_title, og_description, canonical_url, keywords, schema_type, noindex";
  const [s, c, b] = await Promise.all([
    supabase.from("services").select(`${cols}, title_ar, body`),
    supabase.from("cities").select(`${cols}, name_ar, body`),
    supabase.from("blog_posts").select(`${cols}, title_ar, body_ar`),
  ]);
  const rows: Row[] = [];
  (s.data ?? []).forEach((r) => rows.push({ table: "services", id: r.id, slug: r.slug, title: r.title_ar, meta_title: r.meta_title, meta_description: r.meta_description, og_image: r.og_image, og_title: r.og_title, og_description: r.og_description, canonical_url: r.canonical_url, keywords: r.keywords, schema_type: r.schema_type, noindex: r.noindex, body: r.body }));
  (c.data ?? []).forEach((r) => rows.push({ table: "cities", id: r.id, slug: r.slug, title: r.name_ar, meta_title: r.meta_title, meta_description: r.meta_description, og_image: r.og_image, og_title: r.og_title, og_description: r.og_description, canonical_url: r.canonical_url, keywords: r.keywords, schema_type: r.schema_type, noindex: r.noindex, body: r.body }));
  (b.data ?? []).forEach((r) => rows.push({ table: "blog_posts", id: r.id, slug: r.slug, title: r.title_ar, meta_title: r.meta_title, meta_description: r.meta_description, og_image: r.og_image, og_title: r.og_title, og_description: r.og_description, canonical_url: r.canonical_url, keywords: r.keywords, schema_type: r.schema_type, noindex: r.noindex, body: r.body_ar }));
  return rows;
}

const tableLabel = { services: "خدمة", cities: "مدينة", blog_posts: "مقال" } as const;

export function SeoOverviewPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["seo-overview"], queryFn: fetchAll });
  const [filter, setFilter] = useState<null | { key: string; label: string; rows: Row[] }>(null);

  if (isLoading) return <p className="text-sm text-muted-foreground">جاري التحميل…</p>;
  if (!data) return null;

  const missingMeta = data.filter((r) => !r.meta_title);
  const missingDesc = data.filter((r) => !r.meta_description);
  const missingOg = data.filter((r) => !r.og_image);
  const missingCanonical = data.filter((r) => !r.canonical_url);

  // duplicate slugs (cross-table or within-table)
  const slugBuckets = new Map<string, Row[]>();
  for (const r of data) {
    if (!r.slug) continue;
    if (!slugBuckets.has(r.slug)) slugBuckets.set(r.slug, []);
    slugBuckets.get(r.slug)!.push(r);
  }
  const duplicateSlugRows: Row[] = [];
  slugBuckets.forEach((rows) => { if (rows.length > 1) duplicateSlugRows.push(...rows); });

  const scores = data.map((r) => calcSeoScore({ ...r, title: r.title }).score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const cards = [
    { key: "avg", label: "متوسط درجة SEO", value: `${avg}/100`, icon: Gauge, color: "from-emerald-500 to-teal-500", rows: null as Row[] | null },
    { key: "meta", label: "بدون Meta Title", value: missingMeta.length, icon: Type, color: "from-rose-500 to-red-500", rows: missingMeta },
    { key: "desc", label: "بدون Meta Description", value: missingDesc.length, icon: FileText, color: "from-amber-500 to-orange-500", rows: missingDesc },
    { key: "og", label: "بدون og:image", value: missingOg.length, icon: ImageIcon, color: "from-violet-500 to-purple-500", rows: missingOg },
    { key: "canon", label: "بدون Canonical URL", value: missingCanonical.length, icon: LinkIcon, color: "from-sky-500 to-blue-500", rows: missingCanonical },
    { key: "dup", label: "سلاجات مكررة", value: duplicateSlugRows.length, icon: Copy, color: "from-fuchsia-500 to-pink-500", rows: duplicateSlugRows },
  ];

  const worst = [...data]
    .map((r) => ({ ...r, score: calcSeoScore({ ...r, title: r.title }).score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const clickable = !!c.rows;
          return (
            <button
              key={c.key}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && c.rows && setFilter({ key: c.key, label: c.label, rows: c.rows })}
              className="text-start rounded-2xl bg-white border border-[oklch(0.929_0.013_255.508)] p-5 transition hover:shadow-md disabled:cursor-default disabled:hover:shadow-none"
            >
              <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${c.color} p-2.5 text-white mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">{c.value}</p>
            </button>
          );
        })}
      </div>

      {filter && (
        <div className="rounded-2xl bg-white border border-[oklch(0.929_0.013_255.508)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--color-primary)]">الصفحات: {filter.label} ({filter.rows.length})</h3>
            <button onClick={() => setFilter(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-2 max-h-96 overflow-auto">
            {filter.rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد صفحات.</p>
            ) : filter.rows.map((r) => (
              <div key={`${r.table}-${r.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground">{tableLabel[r.table]} · /{r.slug}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-[oklch(0.929_0.013_255.508)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="font-bold text-[var(--color-primary)]">أضعف 10 صفحات في SEO</h3>
        </div>
        <div className="space-y-2">
          {worst.map((r) => {
            const color =
              r.score >= 80 ? "bg-green-100 text-green-700" : r.score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
            return (
              <div key={`${r.table}-${r.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-dashed p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground">{tableLabel[r.table]} · /{r.slug}</p>
                </div>
                <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${color}`}>{r.score}/100</span>
              </div>
            );
          })}
          {worst.length === 0 && <p className="text-sm text-muted-foreground">لا توجد بيانات.</p>}
        </div>
      </div>
    </div>
  );
}