import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, FolderKanban, MapPin, Briefcase, Newspaper, Users as UsersIcon, Clock, CheckCircle2, TrendingUp } from "lucide-react";

interface Counts {
  quotesTotal: number;
  quotesNew: number;
  quotesContacted: number;
  services: number;
  projects: number;
  cities: number;
  blog: number;
  users: number;
  recent: Array<{ id: string; name: string; service: string; created_at: string; status: string | null }>;
  topServices: Array<{ service: string; count: number }>;
}

export function DashboardPanel() {
  const { data, isLoading } = useQuery<Counts>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [q, s, p, c, b, u, recent, byService] = await Promise.all([
        supabase.from("quote_requests").select("status", { count: "exact", head: false }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("cities").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("quote_requests")
          .select("id, name, service, created_at, status")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("quote_requests").select("service"),
      ]);

      const allStatus = (q.data ?? []) as Array<{ status: string | null }>;
      const quotesNew = allStatus.filter((r) => !r.status || r.status === "new").length;
      const quotesContacted = allStatus.filter((r) => r.status === "contacted").length;

      const tally = new Map<string, number>();
      ((byService.data ?? []) as Array<{ service: string | null }>).forEach((r) => {
        const k = r.service ?? "—";
        tally.set(k, (tally.get(k) ?? 0) + 1);
      });
      const topServices = Array.from(tally.entries())
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        quotesTotal: q.count ?? allStatus.length,
        quotesNew,
        quotesContacted,
        services: s.count ?? 0,
        projects: p.count ?? 0,
        cities: c.count ?? 0,
        blog: b.count ?? 0,
        users: u.count ?? 0,
        recent: (recent.data ?? []) as Counts["recent"],
        topServices,
      };
    },
    refetchInterval: 60_000,
  });

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground">جاري تحميل الإحصائيات…</p>;
  }

  const cards = [
    { label: "إجمالي الطلبات", value: data.quotesTotal, icon: Inbox, color: "from-indigo-500 to-blue-500" },
    { label: "طلبات جديدة", value: data.quotesNew, icon: TrendingUp, color: "from-amber-500 to-orange-500" },
    { label: "تم التواصل", value: data.quotesContacted, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
    { label: "الخدمات", value: data.services, icon: Briefcase, color: "from-sky-500 to-cyan-500" },
    { label: "المشاريع", value: data.projects, icon: FolderKanban, color: "from-purple-500 to-fuchsia-500" },
    { label: "صفحات المدن", value: data.cities, icon: MapPin, color: "from-rose-500 to-pink-500" },
    { label: "المقالات", value: data.blog, icon: Newspaper, color: "from-lime-500 to-green-500" },
    { label: "المستخدمين", value: data.users, icon: UsersIcon, color: "from-slate-500 to-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-5">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-bold text-[var(--color-primary)]">{c.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-5">
          <h3 className="font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            آخر الطلبات
          </h3>
          {data.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
          ) : (
            <div className="space-y-2">
              {data.recent.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--color-muted)]">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[var(--color-primary)] truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.service}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {new Date(r.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-5">
          <h3 className="font-bold text-[var(--color-primary)] mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            أكثر الخدمات طلباً
          </h3>
          {data.topServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد بيانات.</p>
          ) : (
            <div className="space-y-3">
              {data.topServices.map((s) => {
                const max = data.topServices[0].count || 1;
                const pct = Math.round((s.count / max) * 100);
                return (
                  <div key={s.service}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-[var(--color-primary)] truncate">{s.service}</span>
                      <span className="text-xs text-muted-foreground">{s.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                      <div className="h-full bg-gradient-to-l from-[var(--color-accent)] to-[var(--color-primary)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}