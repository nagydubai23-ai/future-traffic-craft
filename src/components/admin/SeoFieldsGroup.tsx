import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Search, Eye, Code2 } from "lucide-react";
import { SeoScoreBadge } from "./SeoScoreBadge";

export interface SeoFieldsValue {
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  nofollow?: boolean;
  schema_type?: string | null;
  schema_json?: unknown;
  priority?: number | null;
  changefreq?: string | null;
}

const SCHEMA_TYPES = [
  { v: "Article", l: "Article — مقال" },
  { v: "BlogPosting", l: "BlogPosting — تدوينة" },
  { v: "NewsArticle", l: "NewsArticle — خبر" },
  { v: "Service", l: "Service — خدمة" },
  { v: "LocalBusiness", l: "LocalBusiness — نشاط محلي" },
  { v: "FAQPage", l: "FAQPage — أسئلة شائعة" },
  { v: "HowTo", l: "HowTo — دليل" },
  { v: "WebPage", l: "WebPage — صفحة عامة" },
];

const CHANGEFREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

/**
 * Inline editable SEO fields with one Save action.
 */
export function SeoFieldsInline({
  record,
  onSave,
}: {
  record: Record<string, unknown>;
  onSave: (patch: SeoFieldsValue) => void;
}) {
  const getStr = (k: string) => (record[k] as string) ?? "";
  const getBool = (k: string) => (record[k] as boolean) ?? false;
  const getNum = (k: string, d: number) => (record[k] as number) ?? d;
  const getJsonStr = (k: string) => {
    const v = record[k];
    if (v == null) return "";
    if (typeof v === "string") return v;
    try { return JSON.stringify(v, null, 2); } catch { return ""; }
  };

  const [v, setV] = useState({
    meta_title: getStr("meta_title"),
    meta_description: getStr("meta_description"),
    keywords: getStr("keywords"),
    og_image: getStr("og_image"),
    og_title: getStr("og_title"),
    og_description: getStr("og_description"),
    canonical_url: getStr("canonical_url"),
    noindex: getBool("noindex"),
    nofollow: getBool("nofollow"),
    schema_type: getStr("schema_type"),
    schema_json: getJsonStr("schema_json"),
    priority: getNum("priority", 0.5),
    changefreq: getStr("changefreq") || "monthly",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [jsonErr, setJsonErr] = useState<string | null>(null);

  // Live score uses current edits
  const liveRecord = { ...record, ...v };

  const handleSave = () => {
    let schema_json: unknown = null;
    if (v.schema_json.trim()) {
      try {
        schema_json = JSON.parse(v.schema_json);
        setJsonErr(null);
      } catch (e) {
        setJsonErr((e as Error).message);
        return;
      }
    }
    onSave({
      meta_title: v.meta_title || null,
      meta_description: v.meta_description || null,
      keywords: v.keywords || null,
      og_image: v.og_image || null,
      og_title: v.og_title || null,
      og_description: v.og_description || null,
      canonical_url: v.canonical_url || null,
      noindex: v.noindex,
      nofollow: v.nofollow,
      schema_type: v.schema_type || null,
      schema_json,
      priority: Number(v.priority),
      changefreq: v.changefreq,
    });
  };

  return (
    <div className="rounded-xl border border-dashed border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5 p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
          <Search className="h-3.5 w-3.5" /> إعدادات SEO
        </div>
        <SeoScoreBadge record={liveRecord} compact />
      </div>

      {/* Basic */}
      <div>
        <Label className="text-[11px] text-muted-foreground">Meta Title (≤60 حرف)</Label>
        <Input value={v.meta_title} maxLength={70} onChange={(e) => setV({ ...v, meta_title: e.target.value })} />
        <p className={`text-[10px] mt-1 ${v.meta_title.length > 60 ? "text-red-600" : "text-muted-foreground"}`}>
          {v.meta_title.length}/60
        </p>
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">Meta Description (≤160 حرف)</Label>
        <Textarea rows={2} value={v.meta_description} maxLength={180} onChange={(e) => setV({ ...v, meta_description: e.target.value })} />
        <p className={`text-[10px] mt-1 ${v.meta_description.length > 160 ? "text-red-600" : "text-muted-foreground"}`}>
          {v.meta_description.length}/160
        </p>
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">الكلمات المفتاحية (مفصولة بفواصل)</Label>
        <Input value={v.keywords} maxLength={300} onChange={(e) => setV({ ...v, keywords: e.target.value })} placeholder="دراسات مرورية, الرياض, TIA" />
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">صورة المشاركة (og:image — رابط مطلق)</Label>
        <Input dir="ltr" value={v.og_image} maxLength={500} onChange={(e) => setV({ ...v, og_image: e.target.value })} placeholder="https://..." />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="text-[11px] font-bold text-[var(--color-primary)] underline"
      >
        {showAdvanced ? "إخفاء الإعدادات المتقدمة" : "إظهار الإعدادات المتقدمة"}
      </button>

      {showAdvanced && (
        <div className="space-y-3 border-t border-[var(--color-accent)]/30 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-muted-foreground">og:title</Label>
              <Input value={v.og_title} maxLength={70} onChange={(e) => setV({ ...v, og_title: e.target.value })} />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">og:description</Label>
              <Input value={v.og_description} maxLength={180} onChange={(e) => setV({ ...v, og_description: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">Canonical URL</Label>
            <Input dir="ltr" value={v.canonical_url} onChange={(e) => setV({ ...v, canonical_url: e.target.value })} placeholder="https://atr-traffic.com/..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between rounded-lg border bg-white p-2">
              <div>
                <p className="text-xs font-semibold flex items-center gap-1"><Eye className="h-3 w-3"/> noindex</p>
                <p className="text-[10px] text-muted-foreground">إخفاء من المحركات</p>
              </div>
              <Switch checked={v.noindex} onCheckedChange={(c) => setV({ ...v, noindex: c })} />
            </label>
            <label className="flex items-center justify-between rounded-lg border bg-white p-2">
              <div>
                <p className="text-xs font-semibold">nofollow</p>
                <p className="text-[10px] text-muted-foreground">عدم تتبع الروابط</p>
              </div>
              <Switch checked={v.nofollow} onCheckedChange={(c) => setV({ ...v, nofollow: c })} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-muted-foreground">Schema.org Type</Label>
              <Select value={v.schema_type || "__none__"} onValueChange={(val) => setV({ ...v, schema_type: val === "__none__" ? "" : val })}>
                <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— بدون —</SelectItem>
                  {SCHEMA_TYPES.map((t) => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Changefreq (للسايتماب)</Label>
              <Select value={v.changefreq} onValueChange={(val) => setV({ ...v, changefreq: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CHANGEFREQS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">Priority للسايتماب (0.0 - 1.0)</Label>
            <Input type="number" min={0} max={1} step={0.1} value={v.priority} onChange={(e) => setV({ ...v, priority: Number(e.target.value) })} />
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Code2 className="h-3 w-3"/> Schema JSON-LD مخصص (يستبدل النوع الافتراضي)
            </Label>
            <Textarea rows={6} dir="ltr" className="font-mono text-[11px]" value={v.schema_json}
              onChange={(e) => setV({ ...v, schema_json: e.target.value })}
              placeholder='{"@context":"https://schema.org","@type":"Article",...}' />
            {jsonErr && <p className="text-[10px] text-red-600 mt-1">JSON غير صالح: {jsonErr}</p>}
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full mt-1 rounded-lg bg-[var(--color-primary)] py-2 text-xs font-bold text-white"
      >
        حفظ إعدادات SEO
      </button>
    </div>
  );
}