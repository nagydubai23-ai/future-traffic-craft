import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Phone, MessageCircle, Mail } from "lucide-react";
import { DEFAULT_CONTACT, sanitizeWhatsapp } from "@/hooks/useContactSettings";

const KEYS = ["contact_phone", "contact_whatsapp", "contact_email"];

export function ContactPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_settings_contact"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", KEYS);
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
        contact_phone: data.contact_phone ?? DEFAULT_CONTACT.phone,
        contact_whatsapp: data.contact_whatsapp ?? DEFAULT_CONTACT.whatsapp,
        contact_email: data.contact_email ?? DEFAULT_CONTACT.email,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = [
        { key: "contact_phone", value: form.contact_phone?.trim() ?? "" },
        { key: "contact_whatsapp", value: sanitizeWhatsapp(form.contact_whatsapp ?? "") },
        { key: "contact_email", value: form.contact_email?.trim() ?? "" },
      ];
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("تم حفظ بيانات التواصل");
      qc.invalidateQueries({ queryKey: ["site_settings_contact"] });
      qc.invalidateQueries({ queryKey: ["contact_settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">جاري التحميل…</p>;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-lg font-bold mb-1">أرقام التواصل</h2>
        <p className="text-sm text-muted-foreground">
          تُستخدم في الفوتر، زر واتساب العائم، صفحة "تواصل معنا"، وأزرار "اتصل بنا" في صفحات المدن والخدمات.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[var(--color-primary)]/10 p-2"><Phone className="h-4 w-4 text-[var(--color-primary)]" /></div>
          <div>
            <Label className="text-sm font-semibold">رقم الهاتف (للعرض والاتصال)</Label>
            <p className="text-xs text-muted-foreground mt-1">يظهر في الفوتر وصفحة التواصل. مثال: +966 50 000 0000</p>
          </div>
        </div>
        <Input dir="ltr" value={form.contact_phone ?? ""} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} placeholder="+966 50 000 0000" />
      </div>

      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#25D366]/10 p-2"><MessageCircle className="h-4 w-4 text-[#25D366]" /></div>
          <div>
            <Label className="text-sm font-semibold">رقم واتساب (أرقام فقط مع رمز الدولة)</Label>
            <p className="text-xs text-muted-foreground mt-1">يُستخدم في الزر العائم وأزرار CTA. مثال: 966500000000</p>
          </div>
        </div>
        <Input dir="ltr" value={form.contact_whatsapp ?? ""} onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })} placeholder="966500000000" />
      </div>

      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[var(--color-primary)]/10 p-2"><Mail className="h-4 w-4 text-[var(--color-primary)]" /></div>
          <div>
            <Label className="text-sm font-semibold">البريد الإلكتروني</Label>
            <p className="text-xs text-muted-foreground mt-1">يظهر في الفوتر وصفحة التواصل.</p>
          </div>
        </div>
        <Input dir="ltr" value={form.contact_email ?? ""} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="info@art-traffic.sa" />
      </div>

      <button onClick={() => save.mutate()} disabled={save.isPending} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
        <Save className="h-4 w-4" /> {save.isPending ? "جاري الحفظ…" : "حفظ"}
      </button>
    </div>
  );
}