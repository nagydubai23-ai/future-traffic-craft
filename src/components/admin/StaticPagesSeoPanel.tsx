import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { STATIC_PAGE_DEFAULTS, type StaticPageKey } from "@/lib/content.functions";

const PAGES = Object.entries(STATIC_PAGE_DEFAULTS) as [StaticPageKey, typeof STATIC_PAGE_DEFAULTS[StaticPageKey]][];

type FormState = Record<string, { title: string; description: string }>;

export function StaticPagesSeoPanel() {
  const qc = useQueryClient();
  const keys = PAGES.flatMap(([p]) => [`seo:${p}:title`, `seo:${p}:description`]);

  const { data, isLoading } = useQuery({
    queryKey: ["site_settings_static_seo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", keys);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => (map[r.key] = r.value ?? ""));
      return map;
    },
  });

  const [form, setForm] = useState<FormState>({});

  useEffect(() => {
    if (!data) return;
    const next: FormState = {};
    for (const [page, def] of PAGES) {
      next[page] = {
        title: data[`seo:${page}:title`] || def.title,
        description: data[`seo:${page}:description`] || def.description,
      };
    }
    setForm(next);
  }, [data]);

  const save = useMutation({
    mutationFn: async (page: StaticPageKey) => {
      const f = form[page];
      const rows = [
        { key: `seo:${page}:title`, value: f.title.trim() },
        { key: `seo:${page}:description`, value: f.description.trim() },
      ];
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم الحفظ");
      qc.invalidateQueries({ queryKey: ["site_settings_static_seo"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !Object.keys(form).length) {
    return <p className="text-sm text-muted-foreground">جاري التحميل…</p>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-bold mb-1">SEO الصفحات الثابتة</h2>
        <p className="text-sm text-muted-foreground">
          عدّل عنوان ووصف الـ Meta لكل صفحة ثابتة. تترك فارغة لاستخدام القيمة الافتراضية.
        </p>
      </div>

      {PAGES.map(([page, def]) => {
        const f = form[page] ?? { title: "", description: "" };
        const titleLen = f.title.length;
        const descLen = f.description.length;
        return (
          <div key={page} className="rounded-2xl border bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[var(--color-primary)]">{def.label}</h3>
                <p className="text-xs text-muted-foreground" dir="ltr">{def.path}</p>
              </div>
              <button
                onClick={() => save.mutate(page)}
                disabled={save.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" /> حفظ
              </button>
            </div>

            <div>
              <Label className="text-[11px] text-muted-foreground">Meta Title (≤60 حرف)</Label>
              <Input
                value={f.title}
                maxLength={70}
                onChange={(e) => setForm({ ...form, [page]: { ...f, title: e.target.value } })}
              />
              <p className={`text-[10px] mt-1 ${titleLen > 60 ? "text-red-600" : "text-muted-foreground"}`}>
                {titleLen}/60
              </p>
            </div>

            <div>
              <Label className="text-[11px] text-muted-foreground">Meta Description (≤160 حرف)</Label>
              <Textarea
                rows={2}
                value={f.description}
                maxLength={180}
                onChange={(e) => setForm({ ...form, [page]: { ...f, description: e.target.value } })}
              />
              <p className={`text-[10px] mt-1 ${descLen > 160 ? "text-red-600" : "text-muted-foreground"}`}>
                {descLen}/160
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}