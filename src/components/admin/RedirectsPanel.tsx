import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Download, ArrowLeftRight } from "lucide-react";

interface Redirect {
  id: string;
  source: string;
  destination: string;
  status_code: number;
  is_active: boolean;
  notes: string | null;
}

export function RedirectsPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ source: "", destination: "", status_code: "301" });
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery<Redirect[]>({
    queryKey: ["redirects-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Redirect[];
    },
  });

  const add = useMutation({
    mutationFn: async (rows: { source: string; destination: string; status_code: number }[]) => {
      const { error } = await supabase.from("redirects").upsert(rows, { onConflict: "source" });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["redirects-admin"] });
      toast.success(`تم حفظ ${vars.length} إعادة توجيه`);
      setForm({ source: "", destination: "", status_code: "301" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Redirect> }) => {
      const { error } = await supabase.from("redirects").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects-admin"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["redirects-admin"] });
      toast.success("تم الحذف");
    },
  });

  const handleSubmit = () => {
    if (!form.source.trim() || !form.destination.trim()) return toast.error("املأ المصدر والوجهة");
    add.mutate([{ source: form.source.trim(), destination: form.destination.trim(), status_code: Number(form.status_code) }]);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data ?? [], null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `redirects-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const rows: { source: string; destination: string; status_code: number }[] = [];
    for (const line of lines) {
      if (/^source/i.test(line)) continue;
      const [source, destination, code] = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      if (!source || !destination) continue;
      rows.push({ source, destination, status_code: Number(code) === 302 ? 302 : 301 });
    }
    if (!rows.length) return toast.error("CSV فارغ أو غير صالح");
    add.mutate(rows);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5">
        <h3 className="font-bold text-[var(--color-primary)] mb-3 flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4" /> إضافة إعادة توجيه جديدة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_auto] gap-3 items-end">
          <div>
            <Label className="text-[11px] text-muted-foreground">المصدر (من)</Label>
            <Input dir="ltr" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="/old-page" />
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">الوجهة (إلى)</Label>
            <Input dir="ltr" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="/new-page" />
          </div>
          <div>
            <Label className="text-[11px] text-muted-foreground">النوع</Label>
            <Select value={form.status_code} onValueChange={(v) => setForm({ ...form, status_code: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="301">301 (دائم)</SelectItem>
                <SelectItem value="302">302 (مؤقت)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> إضافة
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs">
            <Upload className="h-3.5 w-3.5" /> استيراد CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleCsv} className="hidden" />
          <button onClick={exportJson} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs">
            <Download className="h-3.5 w-3.5" /> تصدير JSON
          </button>
          <p className="text-[11px] text-muted-foreground self-center">
            صيغة CSV: <code dir="ltr">source,destination,status_code</code>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h3 className="font-bold text-[var(--color-primary)] mb-3">
          القائمة ({data?.length ?? 0})
        </h3>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">جاري التحميل…</p>
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground">لا توجد إعادات توجيه بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-right p-2">المصدر</th>
                  <th className="text-right p-2">الوجهة</th>
                  <th className="text-right p-2">النوع</th>
                  <th className="text-right p-2">فعّال</th>
                  <th className="text-right p-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2 font-mono text-xs" dir="ltr">{r.source}</td>
                    <td className="p-2 font-mono text-xs" dir="ltr">{r.destination}</td>
                    <td className="p-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status_code === 301 ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>
                        {r.status_code}
                      </span>
                    </td>
                    <td className="p-2">
                      <Switch checked={r.is_active} onCheckedChange={(c) => update.mutate({ id: r.id, patch: { is_active: c } })} />
                    </td>
                    <td className="p-2 text-left">
                      <button onClick={() => confirm("حذف؟") && remove.mutate(r.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}