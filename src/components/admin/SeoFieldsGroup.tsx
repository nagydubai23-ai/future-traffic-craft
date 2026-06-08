import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Search } from "lucide-react";

export interface SeoFieldsValue {
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image?: string | null;
}

/**
 * Inline editable SEO fields with Save buttons for an existing record.
 */
export function SeoFieldsInline({
  record,
  onSave,
}: {
  record: Record<string, unknown>;
  onSave: (patch: SeoFieldsValue) => void;
}) {
  const [v, setV] = useState({
    meta_title: (record.meta_title as string) ?? "",
    meta_description: (record.meta_description as string) ?? "",
    keywords: (record.keywords as string) ?? "",
    og_image: (record.og_image as string) ?? "",
  });

  const dirty =
    v.meta_title !== ((record.meta_title as string) ?? "") ||
    v.meta_description !== ((record.meta_description as string) ?? "") ||
    v.keywords !== ((record.keywords as string) ?? "") ||
    v.og_image !== ((record.og_image as string) ?? "");

  return (
    <div className="rounded-xl border border-dashed border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5 p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
        <Search className="h-3.5 w-3.5" /> إعدادات SEO
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">Meta Title (≤60 حرف)</Label>
        <Input value={v.meta_title} maxLength={70} onChange={(e) => setV({ ...v, meta_title: e.target.value })} />
        <p className="text-[10px] text-muted-foreground mt-1">{v.meta_title.length}/60</p>
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">Meta Description (≤160 حرف)</Label>
        <Textarea rows={2} value={v.meta_description} maxLength={180} onChange={(e) => setV({ ...v, meta_description: e.target.value })} />
        <p className="text-[10px] text-muted-foreground mt-1">{v.meta_description.length}/160</p>
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">الكلمات المفتاحية (مفصولة بفواصل)</Label>
        <Input value={v.keywords} maxLength={300} onChange={(e) => setV({ ...v, keywords: e.target.value })} placeholder="دراسات مرورية, الرياض, TIA" />
      </div>
      <div>
        <Label className="text-[11px] text-muted-foreground">صورة المشاركة (og:image — رابط مطلق)</Label>
        <Input dir="ltr" value={v.og_image} maxLength={500} onChange={(e) => setV({ ...v, og_image: e.target.value })} placeholder="https://..." />
      </div>
      {dirty && (
        <button
          onClick={() => onSave({
            meta_title: v.meta_title || null,
            meta_description: v.meta_description || null,
            keywords: v.keywords || null,
            og_image: v.og_image || null,
          })}
          className="w-full mt-1 rounded-lg bg-[var(--color-primary)] py-2 text-xs font-bold text-white"
        >
          حفظ إعدادات SEO
        </button>
      )}
    </div>
  );
}