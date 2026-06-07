import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | ارت ترافيك" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("تم تسجيل الدخول");
      await router.invalidate();
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("تم إنشاء الحساب. تواصل مع المسؤول لمنحك صلاحيات الإدارة.");
      setMode("signin");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[var(--color-primary)] relative overflow-hidden p-6"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
      />
      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30">
              <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">لوحة تحكم ارت ترافيك</h1>
              <p className="text-xs text-white/60">دخول المسؤولين فقط</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="text-xs text-white/70">البريد الإلكتروني</Label>
              <div className="relative mt-1">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  dir="ltr"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 pr-10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-white/70">كلمة المرور</Label>
              <div className="relative mt-1">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  dir="ltr"
                  type="password"
                  required
                  minLength={6}
                  maxLength={72}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30 pr-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-[var(--color-primary)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs text-white/60 hover:text-white"
          >
            {mode === "signin" ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ تسجيل الدخول"}
          </button>
        </div>
      </div>
    </div>
  );
}
