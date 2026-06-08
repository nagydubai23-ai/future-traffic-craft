import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calcSeoScore } from "@/lib/seo-score";
import { AlertTriangle, Image as ImageIcon, FileText, Type, Gauge } from "lucide-react";

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

  if (isLoading) return <p className="text-sm text-muted-foreground">جاري التحميل…</p>;
  if (!data) return null;

  const missingMeta = data.filter((r) => !r.meta_title);
  const missingDesc = data.filter((r) => !r.meta_description);
  const missingOg = data.filter((r) => !r.og_image);
  const scores = data.map((r) => calcSeoScore({ ...r, title: r.title }).score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const cards = [
    { label: "متوسط درجة SEO", value: `${avg}/100`, icon: Gauge, color: "from-emerald-500 to-teal-500" },
    { label: "بدون Meta Title", value: missingMeta.length, icon: Type, color: "from-rose-500 to-red-500" },
    { label: "بدون Meta Description", value: missingDesc.length, icon: FileText, color: "from-amber-500 to-orange-500" },
    { label: "بدون og:image", value: missingOg.length, icon: ImageIcon, color: "from-violet-500 to-purple-500" },
  ];

  const worst = [...data]
    .map((r) => ({ ...r, score: calcSeoScore({ ...r, title: r.title }).score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl bg-white border border-[oklch(0.929_0.013_255.508)] p-5">
              <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${c.color} p-2.5 text-white mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">{c.value}</p>
            </div>
          );
        })}
      </div>

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