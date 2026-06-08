import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Inbox,
  FolderKanban,
  MapPin,
  LogOut,
  Check,
  Trash2,
  Plus,
  ShieldCheck,
  MailOpen,
  Briefcase,
  Newspaper,
  Users as UsersIcon,
  LineChart,
  LayoutDashboard,
  Search,
  ArrowLeftRight,
  Globe,
  Image as ImageIcon,
  Phone as PhoneIcon,
} from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TrackingPanel } from "@/components/admin/TrackingPanel";
import { DashboardPanel } from "@/components/admin/DashboardPanel";
import { SeoFieldsInline } from "@/components/admin/SeoFieldsGroup";
import { SeoOverviewPanel } from "@/components/admin/SeoOverviewPanel";
import { RedirectsPanel } from "@/components/admin/RedirectsPanel";
import { GlobalSeoPanel } from "@/components/admin/GlobalSeoPanel";
import { ImagesPanel } from "@/components/admin/ImagesPanel";
import { ContactPanel } from "@/components/admin/ContactPanel";
import { MarkdownContent } from "@/components/MarkdownContent";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | ارت ترافيك" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const SERVICES = [
  "دراسة التأثير المروري TIA",
  "دراسات السلامة المرورية",
  "تحليل حجم الحركة المرورية",
  "دراسات السرعة",
  "دراسات مواقف السيارات",
  "دراسات المشاة والدراجات",
  "تصميم التقاطعات والإشارات",
  "خطط إدارة المرور TMP",
];

function AdminPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-muted)]">جارٍ التحميل...</div>;
  }

  if (!isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[var(--color-muted)] p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <ShieldCheck className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-[var(--color-primary)]">صلاحيات غير كافية</h1>
          <p className="mt-2 text-sm text-[oklch(0.45_0.02_247)]">
            حسابك ({email}) لا يملك صلاحية الدخول للوحة التحكم. يجب أن يقوم مالك المشروع بمنحك دور "admin" من قاعدة البيانات.
          </p>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--color-muted)]">
      {/* Header */}
      <header className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto max-w-[1320px] flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30">
              <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold">لوحة تحكم ارت ترافيك</h1>
              <p className="text-xs text-white/55">{email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-6 py-10">
        <Tabs defaultValue="dashboard" dir="rtl" className="w-full">
          <TabsList className="bg-white border border-[oklch(0.929_0.013_255.508)] p-1 rounded-full h-auto">
            <TabsTrigger value="dashboard" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <LayoutDashboard className="h-4 w-4" /> الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="quotes" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <Inbox className="h-4 w-4" /> طلبات الدراسات
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <Briefcase className="h-4 w-4" /> الخدمات
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <FolderKanban className="h-4 w-4" /> المشاريع
            </TabsTrigger>
            <TabsTrigger value="cities" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <MapPin className="h-4 w-4" /> صفحات المدن
            </TabsTrigger>
            <TabsTrigger value="blog" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <Newspaper className="h-4 w-4" /> المدونة
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <UsersIcon className="h-4 w-4" /> المستخدمين
            </TabsTrigger>
            <TabsTrigger value="tracking" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <LineChart className="h-4 w-4" /> التتبع والتحليلات
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <Search className="h-4 w-4" /> SEO Overview
            </TabsTrigger>
            <TabsTrigger value="redirects" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <ArrowLeftRight className="h-4 w-4" /> إعادات التوجيه
            </TabsTrigger>
            <TabsTrigger value="global-seo" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <Globe className="h-4 w-4" /> إعدادات SEO عامة
            </TabsTrigger>
            <TabsTrigger value="images" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <ImageIcon className="h-4 w-4" /> الصور
            </TabsTrigger>
            <TabsTrigger value="contact" className="rounded-full data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white gap-2 px-5 py-2">
              <PhoneIcon className="h-4 w-4" /> أرقام التواصل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6"><DashboardPanel /></TabsContent>
          <TabsContent value="quotes" className="mt-6"><QuotesPanel /></TabsContent>
          <TabsContent value="services" className="mt-6"><ServicesPanel /></TabsContent>
          <TabsContent value="projects" className="mt-6"><ProjectsPanel /></TabsContent>
          <TabsContent value="cities" className="mt-6"><CitiesPanel /></TabsContent>
          <TabsContent value="blog" className="mt-6"><BlogPanel /></TabsContent>
          <TabsContent value="users" className="mt-6"><UsersPanel /></TabsContent>
          <TabsContent value="tracking" className="mt-6"><TrackingPanel /></TabsContent>
          <TabsContent value="seo" className="mt-6"><SeoOverviewPanel /></TabsContent>
          <TabsContent value="redirects" className="mt-6"><RedirectsPanel /></TabsContent>
          <TabsContent value="global-seo" className="mt-6"><GlobalSeoPanel /></TabsContent>
          <TabsContent value="images" className="mt-6"><ImagesPanel /></TabsContent>
          <TabsContent value="contact" className="mt-6"><ContactPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------------- Quotes ---------------- */

function QuotesPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase.from("quote_requests").update({ is_read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quote_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("تم الحذف");
    },
  });

  if (isLoading) return <p className="text-sm text-[oklch(0.45_0.02_247)]">جارٍ التحميل...</p>;
  if (!data?.length) return <Empty title="لا توجد طلبات بعد" />;

  const unread = data.filter((q) => !q.is_read).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm">
        <span className="font-semibold text-[var(--color-primary)]">{data.length} طلب</span>
        {unread > 0 && (
          <span className="rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-primary)]">
            {unread} جديد
          </span>
        )}
      </div>
      <div className="space-y-3">
        {data.map((q) => (
          <div
            key={q.id}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              q.is_read ? "border-[oklch(0.929_0.013_255.508)]" : "border-[var(--color-accent)] shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] px-2.5 py-1">
                    {q.service}
                  </span>
                  {!q.is_read && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                  <span className="text-xs text-[oklch(0.45_0.02_247)]">
                    {new Date(q.created_at).toLocaleString("ar-SA")}
                  </span>
                </div>
                <h3 className="mt-2 font-bold text-[var(--color-primary)]">{q.name}{q.company ? ` · ${q.company}` : ""}</h3>
                <p className="mt-1 text-sm text-[oklch(0.45_0.02_247)]">
                  {q.city}{q.district ? ` — ${q.district}` : ""} · <span dir="ltr">{q.phone}</span> · <span dir="ltr">{q.email}</span>
                </p>
                <p className="mt-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">{q.details}</p>
                {q.file_names?.length > 0 && (
                  <p className="mt-2 text-xs text-[oklch(0.45_0.02_247)]">
                    ملفات: {q.file_names.join("، ")}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => markRead.mutate({ id: q.id, is_read: !q.is_read })}
                  title={q.is_read ? "تحديد كغير مقروء" : "تحديد كمقروء"}
                  className="rounded-lg p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10"
                >
                  {q.is_read ? <MailOpen className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => confirm("حذف الطلب؟") && remove.mutate(q.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Projects ---------------- */

function ProjectsPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", location: "", service: SERVICES[0], image_url: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["projects-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        location: form.location.trim(),
        service: form.service,
        image_url: form.image_url.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects-admin"] });
      setForm({ title: "", description: "", location: "", service: SERVICES[0], image_url: "" });
      toast.success("تمت إضافة المشروع");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects-admin"] }),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("projects").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects-admin"] }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <div>
        {isLoading ? (
          <p className="text-sm text-[oklch(0.45_0.02_247)]">جارٍ التحميل...</p>
        ) : !data?.length ? (
          <Empty title="لا توجد مشاريع بعد" />
        ) : (
          <div className="space-y-3">
            {data.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-[oklch(0.929_0.013_255.508)] flex gap-4">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-20 w-28 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="h-20 w-28 rounded-xl bg-[var(--color-muted)] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--color-primary)] truncate">{p.title}</h3>
                  <p className="text-xs text-[oklch(0.45_0.02_247)] mt-1">{p.service} · {p.location}</p>
                  {p.description && <p className="text-sm mt-2 line-clamp-2 text-[oklch(0.45_0.02_247)]">{p.description}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Switch checked={p.is_published} onCheckedChange={(v) => togglePublish.mutate({ id: p.id, is_published: v })} />
                  <button onClick={() => confirm("حذف؟") && remove.mutate(p.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="bg-white rounded-2xl p-5 border border-[oklch(0.929_0.013_255.508)] h-fit sticky top-6">
        <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2"><Plus className="h-4 w-4" />مشروع جديد</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); if (form.title && form.location) add.mutate(); }}
          className="mt-4 space-y-3"
        >
          <Field label="العنوان"><Input value={form.title} maxLength={150} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="الموقع / المدينة"><Input value={form.location} maxLength={120} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="الخدمة">
            <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })} dir="rtl">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="رابط الصورة"><Input dir="ltr" placeholder="https://..." value={form.image_url} maxLength={500} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></Field>
          <Field label="الوصف"><Textarea rows={3} value={form.description} maxLength={1000} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <button type="submit" disabled={add.isPending} className="w-full rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] disabled:opacity-60">
            {add.isPending ? "..." : "إضافة المشروع"}
          </button>
        </form>
      </aside>
    </div>
  );
}

/* ---------------- Cities ---------------- */

function CitiesPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ slug: "", name_ar: "", name_en: "", hero_title: "", hero_description: "", body: "", image_url: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["cities-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cities").select("*").order("display_order").order("name_ar");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("cities").insert({
        slug: form.slug.trim().toLowerCase(),
        name_ar: form.name_ar.trim(),
        name_en: form.name_en.trim() || null,
        hero_title: form.hero_title.trim() || null,
        hero_description: form.hero_description.trim() || null,
        body: form.body.trim() || null,
        image_url: form.image_url.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cities-admin"] });
      setForm({ slug: "", name_ar: "", name_en: "", hero_title: "", hero_description: "", body: "", image_url: "" });
      toast.success("تمت إضافة المدينة");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"cities"> }) => {
      const { error } = await supabase.from("cities").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cities-admin"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cities-admin"] }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <div>
        {isLoading ? (
          <p className="text-sm text-[oklch(0.45_0.02_247)]">جارٍ التحميل...</p>
        ) : !data?.length ? (
          <Empty title="لا توجد صفحات مدن بعد" />
        ) : (
          <div className="space-y-3">
            {data.map((c) => (
              <details key={c.id} className="bg-white rounded-2xl border border-[oklch(0.929_0.013_255.508)] overflow-hidden">
                <summary className="cursor-pointer p-4 flex items-center justify-between gap-3 list-none">
                  <div>
                    <h3 className="font-bold text-[var(--color-primary)]">{c.name_ar}</h3>
                    <p className="text-xs text-[oklch(0.45_0.02_247)] mt-0.5">/{c.slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={c.is_published} onCheckedChange={(v) => update.mutate({ id: c.id, patch: { is_published: v } })} />
                    <button onClick={(e) => { e.preventDefault(); if (confirm("حذف؟")) remove.mutate(c.id); }} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                   <CityEditField city={c} field="hero_title" label="عنوان الهيرو" onSave={(v) => update.mutate({ id: c.id, patch: { hero_title: v } })} />
                   <CityEditField city={c} field="hero_description" label="وصف الهيرو" multiline onSave={(v) => update.mutate({ id: c.id, patch: { hero_description: v } })} />
                   <CityEditField city={c} field="body" label="المحتوى" rich onSave={(v) => update.mutate({ id: c.id, patch: { body: v } })} />
                   <CityEditField city={c} field="compliance_info" label="معلومات الالتزام (Saudi regs)" rich onSave={(v) => update.mutate({ id: c.id, patch: { compliance_info: v } })} />
                   <CityEditField city={c} field="seo_content_ar" label="محتوى SEO بالعربية" rich onSave={(v) => update.mutate({ id: c.id, patch: { seo_content_ar: v } })} />
                   <CityEditField city={c} field="seo_content_en" label="SEO Content (EN)" rich onSave={(v) => update.mutate({ id: c.id, patch: { seo_content_en: v } })} />
                   <CityEditField city={c} field="image_url" label="رابط الصورة" onSave={(v) => update.mutate({ id: c.id, patch: { image_url: v } })} />
                   <SeoFieldsInline record={c as unknown as Record<string, unknown>} onSave={(patch) => update.mutate({ id: c.id, patch })} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      <aside className="bg-white rounded-2xl p-5 border border-[oklch(0.929_0.013_255.508)] h-fit sticky top-6">
        <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2"><Plus className="h-4 w-4" />مدينة جديدة</h3>
        <form onSubmit={(e) => { e.preventDefault(); if (form.slug && form.name_ar) add.mutate(); }} className="mt-4 space-y-3">
          <Field label="المعرف (slug)"><Input dir="ltr" placeholder="riyadh" value={form.slug} maxLength={60} onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/[^a-z0-9-]/gi, "-") })} /></Field>
          <Field label="الاسم بالعربية"><Input value={form.name_ar} maxLength={80} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></Field>
          <Field label="Name (EN)"><Input dir="ltr" value={form.name_en} maxLength={80} onChange={(e) => setForm({ ...form, name_en: e.target.value })} /></Field>
          <Field label="عنوان الهيرو"><Input value={form.hero_title} maxLength={150} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} /></Field>
          <Field label="وصف الهيرو"><Textarea rows={2} value={form.hero_description} maxLength={500} onChange={(e) => setForm({ ...form, hero_description: e.target.value })} /></Field>
          <Field label="المحتوى"><Textarea rows={4} value={form.body} maxLength={4000} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
          <Field label="رابط الصورة"><Input dir="ltr" placeholder="https://..." value={form.image_url} maxLength={500} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></Field>
          <button type="submit" disabled={add.isPending} className="w-full rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] disabled:opacity-60">
            {add.isPending ? "..." : "إضافة المدينة"}
          </button>
        </form>
      </aside>
    </div>
  );
}

function CityEditField({
  city,
  field,
  label,
  multiline,
  rich,
  onSave,
}: {
  city: Record<string, unknown>;
  field: string;
  label: string;
  multiline?: boolean;
  rich?: boolean;
  onSave: (v: string) => void;
}) {
  const [val, setVal] = useState<string>((city[field] as string) ?? "");
  const original = (city[field] as string) ?? "";
  const dirty = val !== original;
  return (
    <div>
      <Label className="text-xs text-[oklch(0.45_0.02_247)]">{label}</Label>
      <div className="mt-1 flex gap-2">
        {rich ? (
          <div className="flex-1"><RichTextEditor value={val} onChange={setVal} minHeight={180} /></div>
        ) : multiline ? (
          <Textarea rows={3} value={val} onChange={(e) => setVal(e.target.value)} className="flex-1" />
        ) : (
          <Input value={val} onChange={(e) => setVal(e.target.value)} className="flex-1" />
        )}
        {dirty && (
          <button onClick={() => onSave(val)} className="rounded-lg bg-[var(--color-accent)] px-3 text-xs font-bold text-[var(--color-primary)]">
            حفظ
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-[oklch(0.45_0.02_247)]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Empty({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-[oklch(0.929_0.013_255.508)] p-12 text-center text-sm text-[oklch(0.45_0.02_247)]">
      {title}
    </div>
  );
}

/* ---------------- Services ---------------- */

function ServicesPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    slug: "",
    title_ar: "",
    title_en: "",
    short_description: "",
    hero_description: "",
    icon_name: "",
    content_ar: "",
    image_url: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["services-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("services").insert({
        slug: form.slug.trim().toLowerCase(),
        title_ar: form.title_ar.trim(),
        title_en: form.title_en.trim() || null,
        short_description: form.short_description.trim() || null,
        hero_description: form.hero_description.trim() || null,
        icon_name: form.icon_name.trim() || null,
        content_ar: form.content_ar || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services-admin"] });
      setForm({ slug: "", title_ar: "", title_en: "", short_description: "", hero_description: "", icon_name: "", content_ar: "", image_url: "" });
      toast.success("تمت إضافة الخدمة");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"services"> }) => {
      const { error } = await supabase.from("services").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-admin"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-admin"] }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <div>
        {isLoading ? (
          <p className="text-sm text-[oklch(0.45_0.02_247)]">جارٍ التحميل...</p>
        ) : !data?.length ? (
          <Empty title="لا توجد خدمات بعد" />
        ) : (
          <div className="space-y-3">
            {data.map((s) => (
              <details key={s.id} className="bg-white rounded-2xl border border-[oklch(0.929_0.013_255.508)] overflow-hidden">
                <summary className="cursor-pointer p-4 flex items-center justify-between gap-3 list-none">
                  <div>
                    <h3 className="font-bold text-[var(--color-primary)]">{s.title_ar}</h3>
                    <p className="text-xs text-[oklch(0.45_0.02_247)] mt-0.5">/{s.slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={s.is_published} onCheckedChange={(v) => update.mutate({ id: s.id, patch: { is_published: v } })} />
                    <button onClick={(e) => { e.preventDefault(); if (confirm("حذف؟")) remove.mutate(s.id); }} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <CityEditField city={s as unknown as Record<string, unknown>} field="title_ar" label="العنوان بالعربية" onSave={(v) => update.mutate({ id: s.id, patch: { title_ar: v } })} />
                  <CityEditField city={s as unknown as Record<string, unknown>} field="title_en" label="Title (EN)" onSave={(v) => update.mutate({ id: s.id, patch: { title_en: v } })} />
                  <CityEditField city={s as unknown as Record<string, unknown>} field="short_description" label="وصف مختصر (SEO)" multiline onSave={(v) => update.mutate({ id: s.id, patch: { short_description: v } })} />
                  <CityEditField city={s as unknown as Record<string, unknown>} field="hero_description" label="وصف الهيرو" multiline onSave={(v) => update.mutate({ id: s.id, patch: { hero_description: v } })} />
                  <CityEditField city={s as unknown as Record<string, unknown>} field="icon_name" label="الأيقونة (Lucide name)" onSave={(v) => update.mutate({ id: s.id, patch: { icon_name: v } })} />
                  <CityEditField city={s as unknown as Record<string, unknown>} field="content_ar" label="المحتوى الكامل" rich onSave={(v) => update.mutate({ id: s.id, patch: { content_ar: v } })} />
                  <CityEditField city={s as unknown as Record<string, unknown>} field="content_en" label="Content (EN)" rich onSave={(v) => update.mutate({ id: s.id, patch: { content_en: v } })} />
                  <SeoFieldsInline record={s as unknown as Record<string, unknown>} onSave={(patch) => update.mutate({ id: s.id, patch })} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      <aside className="bg-white rounded-2xl p-5 border border-[oklch(0.929_0.013_255.508)] h-fit sticky top-6">
        <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2"><Plus className="h-4 w-4" />خدمة جديدة</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); if (form.slug && form.title_ar) add.mutate(); }}
          className="mt-4 space-y-3"
        >
          <Field label="المعرف (slug)"><Input dir="ltr" placeholder="traffic-impact-study" value={form.slug} maxLength={80} onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/[^a-z0-9-]/gi, "-") })} /></Field>
          <Field label="العنوان بالعربية"><Input value={form.title_ar} maxLength={120} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></Field>
          <Field label="Title (EN)"><Input dir="ltr" value={form.title_en} maxLength={120} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></Field>
          <Field label="وصف مختصر (SEO)"><Textarea rows={2} value={form.short_description} maxLength={300} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></Field>
          <Field label="وصف الهيرو"><Textarea rows={2} value={form.hero_description} maxLength={500} onChange={(e) => setForm({ ...form, hero_description: e.target.value })} /></Field>
          <Field label="الأيقونة (Lucide)"><Input dir="ltr" placeholder="TrafficCone" value={form.icon_name} maxLength={60} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} /></Field>
          <Field label="المحتوى"><RichTextEditor value={form.content_ar} onChange={(v) => setForm({ ...form, content_ar: v })} minHeight={160} /></Field>
          <button type="submit" disabled={add.isPending} className="w-full rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] disabled:opacity-60">
            {add.isPending ? "..." : "إضافة الخدمة"}
          </button>
        </form>
      </aside>
    </div>
  );
}

/* ---------------- Blog ---------------- */

function BlogPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    slug: "",
    title_ar: "",
    title_en: "",
    image_url: "",
    body_ar: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["blog-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("blog_posts").insert({
        slug: form.slug.trim().toLowerCase(),
        title_ar: form.title_ar.trim(),
        title_en: form.title_en.trim() || null,
        image_url: form.image_url.trim() || null,
        body_ar: form.body_ar || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blog-admin"] });
      setForm({ slug: "", title_ar: "", title_en: "", image_url: "", body_ar: "" });
      toast.success("تم نشر المقال");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"blog_posts"> }) => {
      const { error } = await supabase.from("blog_posts").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-admin"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-admin"] }),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <div>
        {isLoading ? (
          <p className="text-sm text-[oklch(0.45_0.02_247)]">جارٍ التحميل...</p>
        ) : !data?.length ? (
          <Empty title="لا توجد مقالات بعد" />
        ) : (
          <div className="space-y-3">
            {data.map((p) => (
              <details key={p.id} className="bg-white rounded-2xl border border-[oklch(0.929_0.013_255.508)] overflow-hidden">
                <summary className="cursor-pointer p-4 flex items-center justify-between gap-3 list-none">
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-12 w-16 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-16 rounded-lg bg-[var(--color-muted)]" />
                    )}
                    <div>
                      <h3 className="font-bold text-[var(--color-primary)]">{p.title_ar}</h3>
                      <p className="text-xs text-[oklch(0.45_0.02_247)] mt-0.5">/{p.slug} · {new Date(p.created_at).toLocaleDateString("ar-SA")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={p.is_published} onCheckedChange={(v) => update.mutate({ id: p.id, patch: { is_published: v } })} />
                    <button onClick={(e) => { e.preventDefault(); if (confirm("حذف؟")) remove.mutate(p.id); }} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </summary>
                <div className="px-4 pb-4 space-y-2 text-sm">
                  <CityEditField city={p as unknown as Record<string, unknown>} field="title_ar" label="العنوان بالعربية" onSave={(v) => update.mutate({ id: p.id, patch: { title_ar: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="title_en" label="Title (EN)" onSave={(v) => update.mutate({ id: p.id, patch: { title_en: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="excerpt" label="الملخص (يظهر في القائمة وكـ description)" multiline onSave={(v) => update.mutate({ id: p.id, patch: { excerpt: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="category" label="التصنيف" onSave={(v) => update.mutate({ id: p.id, patch: { category: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="author" label="الكاتب" onSave={(v) => update.mutate({ id: p.id, patch: { author: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="reading_minutes" label="مدة القراءة (دقائق)" onSave={(v) => update.mutate({ id: p.id, patch: { reading_minutes: v ? parseInt(v) : null } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="image_url" label="رابط صورة الغلاف" onSave={(v) => update.mutate({ id: p.id, patch: { image_url: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="body_ar" label="المحتوى بالعربية" rich onSave={(v) => update.mutate({ id: p.id, patch: { body_ar: v } })} />
                  <CityEditField city={p as unknown as Record<string, unknown>} field="body_en" label="Content (EN)" rich onSave={(v) => update.mutate({ id: p.id, patch: { body_en: v } })} />
                  <SeoFieldsInline record={p as unknown as Record<string, unknown>} onSave={(patch) => update.mutate({ id: p.id, patch })} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      <aside className="bg-white rounded-2xl p-5 border border-[oklch(0.929_0.013_255.508)] h-fit sticky top-6">
        <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2"><Plus className="h-4 w-4" />مقال جديد</h3>
        <form onSubmit={(e) => { e.preventDefault(); if (form.slug && form.title_ar) add.mutate(); }} className="mt-4 space-y-3">
          <Field label="المعرف (slug)"><Input dir="ltr" placeholder="article-slug" value={form.slug} maxLength={120} onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/[^a-z0-9-]/gi, "-") })} /></Field>
          <Field label="العنوان بالعربية"><Input value={form.title_ar} maxLength={200} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></Field>
          <Field label="Title (EN)"><Input dir="ltr" value={form.title_en} maxLength={200} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></Field>
          <Field label="رابط صورة الغلاف"><Input dir="ltr" placeholder="https://..." value={form.image_url} maxLength={500} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></Field>
          <Field label="المحتوى"><RichTextEditor value={form.body_ar} onChange={(v) => setForm({ ...form, body_ar: v })} minHeight={200} /></Field>
          {form.body_ar && (
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)] mb-2">معاينة Markdown</p>
              <div className="rounded-xl border border-[oklch(0.929_0.013_255.508)] bg-white p-4 max-h-[400px] overflow-auto">
                <MarkdownContent content={form.body_ar} dir="rtl" />
              </div>
            </div>
          )}
          <button type="submit" disabled={add.isPending} className="w-full rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] disabled:opacity-60">
            {add.isPending ? "..." : "نشر المقال"}
          </button>
        </form>
      </aside>
    </div>
  );
}

/* ---------------- Users ---------------- */

function UsersPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["users-admin"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      const rolesByUser = new Map<string, string[]>();
      for (const r of rolesRes.data ?? []) {
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      }
      return (profilesRes.data ?? []).map((p) => ({ ...p, roles: rolesByUser.get(p.id) ?? [] }));
    },
  });

  if (isLoading) return <p className="text-sm text-[oklch(0.45_0.02_247)]">جارٍ التحميل...</p>;
  if (!data?.length) return <Empty title="لا يوجد مستخدمون مسجلون بعد" />;

  return (
    <div>
      <div className="mb-4 rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-4 text-xs text-[oklch(0.45_0.02_247)]">
        لإضافة دور admin لمستخدم، استخدم قاعدة البيانات مباشرة:
        <code dir="ltr" className="mt-2 block rounded-lg bg-[var(--color-muted)] p-2 text-[11px] text-[var(--color-primary)]">
          INSERT INTO public.user_roles (user_id, role) VALUES ('USER_UUID', 'admin');
        </code>
      </div>
      <div className="space-y-2">
        {data.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl p-4 border border-[oklch(0.929_0.013_255.508)] flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-bold text-[var(--color-primary)] truncate">{u.full_name ?? "بدون اسم"}</h3>
              <p className="text-xs text-[oklch(0.45_0.02_247)] mt-0.5">
                <span dir="ltr">{u.email ?? "—"}</span>
                {u.company ? ` · ${u.company}` : ""}
                {u.phone ? ` · ${u.phone}` : ""}
              </p>
              <p className="text-[11px] text-[oklch(0.45_0.02_247)] mt-1" dir="ltr">{u.id}</p>
            </div>
            <div className="flex flex-wrap gap-1 shrink-0">
              {u.roles.length === 0 ? (
                <span className="rounded-full bg-[var(--color-muted)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.45_0.02_247)]">client</span>
              ) : (
                u.roles.map((r) => (
                  <span key={r} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r === "admin" ? "bg-[var(--color-accent)] text-[var(--color-primary)]" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"}`}>{r}</span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
