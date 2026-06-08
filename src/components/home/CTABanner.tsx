import { MessageCircle, Phone, CheckCircle2 } from "lucide-react";
import { useContactSettings, waHref, telHref } from "@/hooks/useContactSettings";

const MESSAGE = "مرحباً، أرغب في طلب عرض سعر لدراسة مرورية. تفاصيل المشروع:";

const BENEFITS = [
  "عرض سعر مجاني خلال 24 ساعة",
  "استشارة فنية أولية بدون التزام",
  "تسليم في الموعد المحدد",
  "اعتماد رسمي من الجهات المختصة",
];

export function CTABanner() {
  const { whatsapp, phone } = useContactSettings();
  return (
    <section dir="rtl" id="cta" className="relative overflow-hidden bg-[var(--color-primary)] py-24 md:py-28">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #25D366, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/85">احصل على عرض سعر الآن</span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]">
              جاهز تبدأ <span className="text-[var(--color-accent)]">دراستك المرورية؟</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/75 leading-loose max-w-xl">
              تواصل معنا الآن عبر واتساب واحصل على عرض سعر مجاني خلال 24 ساعة.
              فريقنا الهندسي جاهز لخدمتك في جميع مناطق المملكة.
            </p>

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/85">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-accent)] shrink-0" />
                  <span className="text-sm md:text-base">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={waHref(whatsapp, MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-[0_15px_45px_-10px_rgba(37,211,102,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_55px_-10px_rgba(37,211,102,0.9)]"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
                تواصل عبر واتساب
              </a>
              <a
                href={telHref(phone)}
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
              >
                <Phone className="h-5 w-5" />
                اتصل بنا
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/15 p-8">
              <div className="absolute -top-6 -right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] shadow-[0_15px_40px_-10px_rgba(37,211,102,0.8)]">
                <MessageCircle className="h-7 w-7 text-white" strokeWidth={2.4} />
              </div>
              <div className="space-y-4">
                <ChatBubble side="them">مرحباً! أحتاج دراسة تأثير مروري لمشروع تجاري في الرياض.</ChatBubble>
                <ChatBubble side="us">أهلاً بك في ارت ترافيك ✨ سنرسل لك عرض السعر خلال 24 ساعة.</ChatBubble>
                <ChatBubble side="them">ممتاز، كم تستغرق الدراسة؟</ChatBubble>
                <ChatBubble side="us">عادة بين 3 إلى 6 أسابيع، مع متابعة الاعتماد من الأمانة.</ChatBubble>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-white/60">
                <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                <span>متاحون الآن للرد على استفسارك</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ side, children }: { side: "us" | "them"; children: React.ReactNode }) {
  const isUs = side === "us";
  return (
    <div className={`flex ${isUs ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUs
            ? "bg-[#25D366] text-white rounded-bl-sm"
            : "bg-white/10 text-white/90 backdrop-blur-sm rounded-br-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}