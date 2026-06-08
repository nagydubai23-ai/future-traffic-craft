import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Globe, Image as ImageIcon, FileText, Send } from "lucide-react";

const KEYS = ["default_meta_title_template", "default_og_image", "robots_txt_content"];

const DEFAULT_ROBOTS = `# Default — allow all crawlers
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /api/

Sitemap: https://atr-traffic.com/sitemap.xml
`;

export function GlobalSeoPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_settings_global_seo"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value").in("key", KEYS);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => (map[r.key] = r.value ?? ""));
      return map;
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) {
      setForm({
        default_meta_title_template: data.default_meta_title_template ?? "%title% | ارت ترافيك",
        default_og_image: data.default_og_image ?? "",
        robots_txt_content: data.robots_txt_content || DEFAULT_ROBOTS,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = KEYS.map((k) => ({ key: k, value: form[k] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم الحفظ");
      qc.invalidateQueries({ queryKey: ["site_settings_global_seo"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [pinging, setPinging] = useState(false);
  const pingEngines = async () => {
    setPinging(true);
    try {
      const res = await fetch("/api/public/ping-search-engines", { method: "POST" });
      const json = await res.json();
      toast.success(`Bing: ${json.bing ?? "?"} · Google: ${json.google ?? "?"}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setPinging(false);
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">جاري التحميل…</p>;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-lg bg-[var(--color-primary)]/10 p-2"><FileText className="h-4 w-4 text-[var(--color-primary)]" /></div>
          <div>
            <Label className="text-sm font-semibold">قالب Meta Title الافتراضي</Label>
            <p className="text-xs text-muted-foreground mt-1">يُستخدم عندما لا يحتوي صفحة meta_title خاص. استخدم %title% كعنصر استبدال.</p>
          </div>
        </div>
        <Input dir="ltr" value={form.default_meta_title_template ?? ""} onChange={(e) => setForm({ ...form, default_meta_title_template: e.target.value })} placeholder="%title% | ارت ترافيك" />
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-lg bg-[var(--color-primary)]/10 p-2"><ImageIcon className="h-4 w-4 text-[var(--color-primary)]" /></div>
          <div>
            <Label className="text-sm font-semibold">صورة og:image الافتراضية</Label>
            <p className="text-xs text-muted-foreground mt-1">رابط مطلق يُستخدم احتياطياً عند غياب صورة الصفحة.</p>
          </div>
        </div>
        <Input dir="ltr" value={form.default_og_image ?? ""} onChange={(e) => setForm({ ...form, default_og_image: e.target.value })} placeholder="https://..." />
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="rounded-lg bg-[var(--color-primary)]/10 p-2"><Globe className="h-4 w-4 text-[var(--color-primary)]" /></div>
          <div className="flex-1">
            <Label className="text-sm font-semibold">محرر robots.txt</Label>
            <p className="text-xs text-muted-foreground mt-1">
              يُقدّم ديناميكياً عبر <code dir="ltr">/robots.txt</code>. إذا كان فارغاً يعود الموقع للملف الافتراضي.
            </p>
          </div>
        </div>
        <Textarea rows={14} dir="ltr" className="font-mono text-xs" value={form.robots_txt_content ?? ""} onChange={(e) => setForm({ ...form, robots_txt_content: e.target.value })} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => save.mutate()} disabled={save.isPending} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
          <Save className="h-4 w-4" /> {save.isPending ? "جاري الحفظ…" : "حفظ الإعدادات"}
        </button>
        <button onClick={pingEngines} disabled={pinging} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-50">
          <Send className="h-4 w-4" /> {pinging ? "جاري الإرسال…" : "إعلام Google/Bing بتحديث السايتماب"}
        </button>
      </div>
    </div>
  );
}