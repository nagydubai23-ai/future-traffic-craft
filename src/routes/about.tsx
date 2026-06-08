import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, MessageCircle, Target, Eye, Award, Users, Building2, MapPin, ShieldCheck, Compass, Layers } from "lucide-react";
import { absUrl, hreflangLinks, breadcrumbJsonLd, organizationJsonLd, faqJsonLd } from "@/lib/seo";
import { useQuote } from "@/components/quote/QuoteContext";
import aboutHero from "@/assets/about-hero.jpg";
import { useContactSettings, waHref } from "@/hooks/useContactSettings";
import { getStaticPageSeo } from "@/lib/content.functions";

const META_TITLE = "من نحن | مكتب دراسة مرورية معتمد في السعودية — ارت ترافيك";
const META_DESC = "ارت ترافيك مكتب دراسة مرورية معتمد في المملكة العربية السعودية، متخصص في دراسات الأثر المروري والسلامة المرورية والتنقل الذكي وفق اشتراطات الهيئات والبلديات.";

const WHATSAPP_MESSAGE = "مرحباً، أرغب في طلب دراسة مرورية من مكتب ارت ترافيك المعتمد.";

const FAQS = [
  { q: "ما الذي يجعل ارت ترافيك مكتب دراسة مرورية معتمد؟", a: "نعمل وفق اشتراطات وزارة النقل والخدمات اللوجستية والأمانات والبلديات السعودية، ويضم فريقنا مهندسين معتمدين من الهيئة السعودية للمهندسين بخبرة تتجاوز 12 عامًا في دراسات الأثر المروري والسلامة." },
  { q: "ما الخدمات التي يقدمها المكتب؟", a: "دراسات الأثر المروري (TIA)، دراسات السلامة المرورية، تصميم التقاطعات والإشارات، خطط إدارة المرور المؤقتة، وحلول التنقل الذكي والمحاكاة الدقيقة." },
  { q: "هل تخدمون مشاريع خارج الرياض؟", a: "نعم، نغطي جميع مدن المملكة بما فيها جدة، الدمام، مكة المكرمة، المدينة المنورة، أبها، نيوم والعلا، مع فرق ميدانية متنقلة." },
  { q: "كم تستغرق الدراسة المرورية النموذجية؟", a: "تتراوح المدة بين أسبوعين وستة أسابيع حسب حجم المشروع وتعقيد الشبكة المرورية المحيطة." },
];

export const Route = createFileRoute("/about")({
  loader: () => getStaticPageSeo({ data: { page: "about" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? META_TITLE },
      { name: "description", content: loaderData?.description ?? META_DESC },
      { name: "keywords", content: "مكتب دراسة مرورية معتمد, دراسة مرورية, استشارات هندسة المرور, دراسة الأثر المروري, السلامة المرورية, ارت ترافيك, السعودية" },
      { property: "og:title", content: loaderData?.title ?? META_TITLE },
      { property: "og:description", content: loaderData?.description ?? META_DESC },
      { property: "og:url", content: absUrl("/about") },
      { property: "og:type", content: "website" },
      { property: "og:image", content: absUrl("/og-about.jpg") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/about") }, ...hreflangLinks("/about")],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbJsonLd([
          { name: "الرئيسية", path: "/" },
          { name: "من نحن", path: "/about" },
        ])),
      },
      { type: "application/ld+json", children: JSON.stringify(organizationJsonLd) },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { open } = useQuote();
  const { whatsapp } = useContactSettings();
  const WHATSAPP_HREF = waHref(whatsapp, WHATSAPP_MESSAGE);
  return (
    <main dir="rtl" className="bg-background">
      {/* HERO */}
      <section className="relative min-h-[88vh] w-full overflow-hidden bg-[var(--color-primary)]">
        <img
          src={aboutHero}
          alt="مكتب دراسة مرورية معتمد — ارت ترافيك"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(6,43,82,0.95) 0%, rgba(6,43,82,0.78) 55%, rgba(22,119,200,0.45) 100%)" }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />
        <div className="pointer-events-none absolute -top-32 -left-32 h-[460px] w-[460px] rounded-full opacity-25 blur-3xl"
             style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }} />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1320px] flex-col justify-center px-6 pt-32 pb-20 md:px-10">
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <BadgeCheck className="h-4 w-4 text-[var(--color-accent)]" />
            <span className="text-xs font-medium tracking-wide text-white/85">مكتب دراسة مرورية معتمد في المملكة العربية السعودية</span>
          </div>

          <h1 className="mt-7 max-w-4xl font-extrabold leading-[1.1] text-white text-balance"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)" }}>
            دراسة{" "}
            <span className="relative inline-block text-[var(--color-accent)]">
              مرورية
              <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-[var(--color-accent)]/40" />
            </span>
            <br />
            بدقّة هندسية معتمدة
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-loose text-white/80 md:text-lg">
            ارت ترافيك بيت خبرة سعودي ومكتب دراسة مرورية معتمد، نقدّم دراسات الأثر المروري والسلامة وخطط التنقل الذكي لكبرى المشاريع الحكومية والخاصة، وفق اشتراطات وزارة النقل والأمانات والبلديات في المملكة.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={open}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-bold text-[var(--color-primary)] shadow-[0_10px_40px_-10px_rgba(200,241,53,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-10px_rgba(200,241,53,0.8)]"
            >
              اطلب دراسة مرورية
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل عبر واتساب
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-7">
            <Stat value="+12" label="سنة خبرة هندسية" />
            <Divider />
            <Stat value="+150" label="دراسة مرورية منجزة" />
            <Divider />
            <Stat value="+8" label="مدن سعودية" />
            <Divider />
            <Stat value="100%" label="التزام بالمعايير" />
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">من نحن</span>
              <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">بيت خبرة سعودي في هندسة المرور والنقل</h2>
            </div>
            <div className="space-y-6 text-base leading-loose text-muted-foreground md:text-lg lg:col-span-7">
              <p>
                تأسست <strong className="text-foreground">ارت ترافيك</strong> لتكون مكتب دراسة مرورية معتمد يجمع بين عمق الخبرة المحلية والمعرفة الهندسية الدولية. نقدّم حلولاً متكاملة في
                <strong className="text-foreground"> دراسات الأثر المروري (TIA)</strong>،
                <strong className="text-foreground"> السلامة المرورية</strong>،
                <strong className="text-foreground"> تصميم التقاطعات والإشارات</strong>، وخطط إدارة المرور للمشاريع الكبرى في المملكة.
              </p>
              <p>
                نعمل وفق اشتراطات <strong className="text-foreground">وزارة النقل والخدمات اللوجستية</strong>، <strong className="text-foreground">الهيئة العامة للطرق</strong>، والأمانات والبلديات السعودية، ونعتمد منهجية هندسية صارمة قائمة على البيانات والمحاكاة الدقيقة باستخدام أحدث برمجيات الصناعة مثل VISSIM وSynchro وSidra.
              </p>
              <p>
                خدماتنا تشمل القطاعين العام والخاص — من المشاريع التجارية والسكنية والمستشفيات والمدارس وصولاً إلى المشاريع الكبرى ضمن رؤية المملكة 2030.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="mb-14 max-w-2xl">
            <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">المنهجية</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">رؤيتنا، رسالتنا، وقيمنا</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Pillar icon={Eye} title="الرؤية" body="أن نكون المكتب الاستشاري المروري الأول في المملكة، وأن نُسهم في صناعة مدن أكثر أمانًا وكفاءة وذكاءً." />
            <Pillar icon={Target} title="الرسالة" body="تقديم دراسات مرورية معتمدة بمعايير دولية تدعم متخذي القرار وتُسرّع اعتماد المشاريع لدى الجهات التنظيمية." />
            <Pillar icon={ShieldCheck} title="القيم" body="الدقة الهندسية، الشفافية، الالتزام بالمواعيد، والاعتماد الكامل على البيانات في كل توصية." />
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="mb-14 max-w-2xl">
            <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">لماذا نحن</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">لماذا تختار مكتب دراسة مرورية معتمد كـ ارت ترافيك؟</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={BadgeCheck} title="اعتماد رسمي" body="اعتماد كامل لدى وزارة النقل والأمانات السعودية، وانتساب فريقنا للهيئة السعودية للمهندسين." />
            <Feature icon={Award} title="خبرة موثّقة" body="أكثر من 150 دراسة منجزة لمشاريع تجارية وحكومية في 8 مدن سعودية." />
            <Feature icon={Layers} title="منهجية معتمدة" body="نطبّق منهجيات HCM وAASHTO والدليل السعودي للسلامة المرورية لضمان قبول دراساتنا أول مرة." />
            <Feature icon={Compass} title="محاكاة دقيقة" body="نستخدم برمجيات VISSIM وSynchro وSidra لتقديم نتائج رقمية قابلة للتحقق." />
            <Feature icon={Users} title="فريق متعدد التخصصات" body="مهندسو مرور، مخططو نقل، ومحللو بيانات يعملون ضمن فريق واحد لكل مشروع." />
            <Feature icon={Building2} title="خدمة شاملة" body="من جمع البيانات الميدانية حتى اعتماد الدراسة من الجهة التنظيمية." />
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="mb-10 max-w-2xl">
            <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">تغطيتنا</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">نخدم مشاريعك في كل مدن المملكة</h2>
            <p className="mt-4 leading-loose text-muted-foreground">
              فرق هندسية ميدانية جاهزة للعمل في كافة مناطق المملكة، مع معرفة عميقة باشتراطات كل بلدية وأمانة على حدة.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["الرياض","جدة","الدمام","مكة المكرمة","المدينة المنورة","أبها","الخبر","نيوم","العلا","تبوك"].map((c) => (
              <span key={c} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-secondary" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">الأسئلة الشائعة</span>
            <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">أسئلة يطرحها عملاؤنا</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-background p-6 transition-all hover:border-secondary/40">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-foreground">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary/10 text-secondary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-loose text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[var(--color-primary)] py-20 md:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[460px] w-[460px] rounded-full opacity-25 blur-3xl"
             style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }} />
        <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
             style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 text-center md:px-10">
          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            جاهز لبدء دراستك المرورية مع{" "}
            <span className="text-[var(--color-accent)]">مكتب معتمد؟</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-loose text-white/75 md:text-lg">
            احصل على استشارة أولية مجانية وعرض سعر مفصّل خلال 24 ساعة من فريق ارت ترافيك.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={open}
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-accent)] px-8 py-4 text-sm font-bold text-[var(--color-primary)] shadow-[0_10px_40px_-10px_rgba(200,241,53,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-10px_rgba(200,241,53,0.8)]"
            >
              اطلب دراسة مرورية الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-10px_rgba(37,211,102,0.8)]"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل واتساب مباشرة
            </a>
          </div>
        </div>
      </section>
    </main>
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

function Pillar({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-7 transition-all hover:-translate-y-1 hover:border-secondary/40 hover:shadow-lg">
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-secondary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="leading-loose text-muted-foreground">{body}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 transition-all hover:border-secondary/40 hover:shadow-md">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}