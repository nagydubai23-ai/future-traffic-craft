import { ArrowLeft, BarChart3, ShieldCheck, Cpu, MoveDown, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-traffic.jpg";
import { FloatingCard } from "./FloatingCard";
import { useQuote } from "@/components/quote/QuoteContext";
import { useContactSettings, waHref } from "@/hooks/useContactSettings";

const WA_MESSAGE = "مرحباً، أرغب في طلب عرض سعر لدراسة مرورية.";

export function Hero() {
  const { open } = useQuote();
  const { whatsapp } = useContactSettings();
  return (
    <section
      dir="rtl"
      className="relative min-h-screen w-full overflow-hidden bg-[var(--color-primary)]"
    >
      {/* Background image */}
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />

      {/* Navy gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1320px] flex-col px-6 pt-28 pb-16 md:px-10 lg:pt-32">
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Text column — appears on the right in RTL */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/85">
                استشارات هندسة المرور
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-7 font-extrabold leading-[1.1] text-white text-balance"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}>
              حلول مرورية{" "}
              <span className="relative inline-block text-[var(--color-accent)]">
                ذكية
                <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-[var(--color-accent)]/40" />
              </span>
              <br />
              لمدن المستقبل
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-loose text-white/75 md:text-lg">
              نقدم دراسات وتحليلات مرورية متقدمة تساعد المشاريع على تحسين الحركة
              والسلامة وفق أعلى المعايير الهندسية.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={open}
                className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-bold text-[var(--color-primary)] shadow-[0_10px_40px_-10px_rgba(200,241,53,0.6)] transition-all hover:shadow-[0_15px_50px_-10px_rgba(200,241,53,0.8)] hover:-translate-y-0.5"
              >
                اطلب دراسة مرورية
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </button>
              <a
                href={waHref(whatsapp, WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.55)] transition-all hover:shadow-[0_15px_50px_-10px_rgba(37,211,102,0.8)] hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
                واتساب فوري
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
              >
                استكشف خدماتنا
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-7">
              <Stat value="+150" label="مشروع منجز" />
              <Divider />
              <Stat value="+12" label="سنة خبرة" />
              <Divider />
              <Stat value="+8" label="مدن سعودية" />
            </div>
          </div>

          {/* Floating cards column — appears on the left in RTL */}
          <div className="relative lg:col-span-5 order-1 lg:order-2 min-h-[420px] lg:min-h-[600px]">
            <FloatingCard
              icon={BarChart3}
              title="تقييم الأثر المروري"
              caption="Traffic Impact Assessment"
              className="lg:absolute lg:top-4 lg:right-0"
              delay="0s"
            />
            <FloatingCard
              icon={ShieldCheck}
              title="السلامة المرورية"
              caption="Traffic Safety"
              className="lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:-left-4 mt-4 lg:mt-0"
              delay="1.2s"
            />
            <FloatingCard
              icon={Cpu}
              title="التنقل الذكي"
              caption="Smart Mobility"
              className="lg:absolute lg:bottom-6 lg:right-12 mt-4 lg:mt-0"
              delay="2.4s"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 flex items-center justify-center gap-3 text-white/50">
          <span className="h-px w-10 bg-white/20" />
          <MoveDown className="h-4 w-4 animate-bounce" />
          <span className="text-xs tracking-wide">اسحب للأسفل</span>
          <span className="h-px w-10 bg-white/20" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-xs text-white/55">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="h-8 w-px bg-white/15" aria-hidden="true" />;
}
