import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, BarChart3, Eye, Search, Code2 } from "lucide-react";

const FIELDS: {
  key: string;
  label: string;
  placeholder: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  multiline?: boolean;
}[] = [
  {
    key: "ga4_measurement_id",
    label: "Google Analytics 4 — Measurement ID",
    placeholder: "G-XXXXXXXXXX",
    hint: "تجده في حساب GA4 → Admin → Data Streams",
    icon: BarChart3,
  },
  {
    key: "gtm_container_id",
    label: "Google Tag Manager — Container ID",
    placeholder: "GTM-XXXXXXX",
    hint: "اختياري — يستخدم لإدارة كل وسوم التتبع من مكان واحد",
    icon: Code2,
  },
  {
    key: "clarity_project_id",
    label: "Microsoft Clarity — Project ID",
    placeholder: "abcd1234ef",
    hint: "تجده في clarity.microsoft.com → Settings → Setup",
    icon: Eye,
  },
  {
    key: "gsc_verification",
    label: "Google Search Console — Verification Code",
    placeholder: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    hint: "انسخ قيمة content فقط من الـ meta tag الذي يعطيه Search Console",
    icon: Search,
  },
  {
    key: "head_custom_code",
    label: "كود مخصص داخل <head>",
    placeholder: "<!-- أي سكربتات أو meta tags إضافية -->",
    hint: "للمتقدمين فقط — يُحقن في <head> الموقع",
    icon: Code2,
    multiline: true,
  },
  {
    key: "body_custom_code",
    label: "كود مخصص داخل <body>",
    placeholder: "<!-- مثال: noscript لـ GTM -->",
    hint: "للمتقدمين فقط — يُحقن في نهاية <body>",
    icon: Code2,
    multiline: true,
  },
];

export function TrackingPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_settings_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => {
        map[r.key] = r.value ?? "";
      });
      return map;
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      const init: Record<string, string> = {};
      FIELDS.forEach((f) => (init[f.key] = data[f.key] ?? ""));
      setForm(init);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = FIELDS.map((f) => ({ key: f.key, value: form[f.key] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حفظ الأكواد بنجاح. سيتم تطبيقها على الموقع خلال دقائق.");
      qc.invalidateQueries({ queryKey: ["site_settings_admin"] });
      qc.invalidateQueries({ queryKey: ["site_settings_tracking"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">جاري التحميل…</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-6">
        <h2 className="text-lg font-bold mb-1">أكواد التتبع والتحليلات</h2>
        <p className="text-sm text-muted-foreground">
          ضع المعرّفات هنا ليتم حقنها تلقائياً في جميع صفحات الموقع. لا حاجة لتعديل الكود.
        </p>
      </div>

      <div className="grid gap-5">
        {FIELDS.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.key}
              className="rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded-lg bg-[var(--color-primary)]/10 p-2">
                  <Icon className="h-4 w-4 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold">{f.label}</Label>
                  {f.hint && (
                    <p className="text-xs text-muted-foreground mt-1">{f.hint}</p>
                  )}
                </div>
              </div>
              {f.multiline ? (
                <Textarea
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  rows={5}
                  className="font-mono text-xs"
                  dir="ltr"
                />
              ) : (
                <Input
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  dir="ltr"
                  className="font-mono text-sm"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {save.isPending ? "جاري الحفظ…" : "حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}