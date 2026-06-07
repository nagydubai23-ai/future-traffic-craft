import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { getService, type FAQ, type ProjectRow } from "@/lib/content.functions";
import { IconByName } from "@/components/shared/IconByName";
import { useQuote } from "@/components/quote/QuoteContext";
import { useState } from "react";
import { ChevronDown, ArrowLeft, CheckCircle2, MapPin } from "lucide-react";
import { absUrl, hreflangLinks, breadcrumbJsonLd, faqJsonLd, BASE_URL } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const result = await getService({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const title = loaderData?.service.title_ar ?? "خدمة";
    const desc = loaderData?.service.short_description ?? "";
    const slug = loaderData?.service.slug ?? "";
    const path = `/services/${slug}`;
    const faqs = loaderData?.service.faqs ?? [];
    return {
      meta: [
        { title: `${title} | ارت ترافيك` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} | ارت ترافيك` },
        { property: "og:description", content: desc },
        { property: "og:url", content: absUrl(path) },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: absUrl(path) }, ...hreflangLinks(path)],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: title,
            description: desc,
            url: `${BASE_URL}${path}`,
            provider: { "@type": "Organization", name: "ارت ترافيك", url: BASE_URL },
            areaServed: { "@type": "Country", name: "Saudi Arabia" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "الخدمات", path: "/services" },
            { name: title, path },
          ])),
        },
        ...(faqs.length > 0 ? [{
          type: "application/ld+json",
          children: JSON.stringify(faqJsonLd(faqs)),
        }] : []),
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <main dir="rtl" className="min-h-[60vh] grid place-items-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">الخدمة غير موجودة</h1>
        <Link to="/" className="text-secondary underline">العودة للرئيسية</Link>
      </div>
    </main>
  ),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <main dir="rtl" className="min-h-[60vh] grid place-items-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">تعذر تحميل المحتوى</h1>
          <button onClick={() => { reset(); router.invalidate(); }} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground">إعادة المحاولة</button>
        </div>
      </main>
    );
  },
});

function ServicePage() {
  const { service, projects } = Route.useLoaderData();
  const quote = useQuote();
  return (
    <main dir="rtl" className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary via-primary to-secondary text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%)" }} />
        <div className="relative max-w-[1320px] mx-auto px-6 py-24 md:py-32">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70 flex items-center gap-2">
            <Link to="/" className="hover:text-white">الرئيسية</Link>
            <span>/</span>
            <span>الخدمات</span>
            <span>/</span>
            <span className="text-white">{service.title_ar}</span>
          </nav>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
              <IconByName name={service.icon_name} className="w-12 h-12 text-[var(--color-accent)]" />
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-accent)] font-semibold mb-3 tracking-wide">{service.title_en}</p>
              <h1 className="font-[var(--font-arabic)] text-4xl md:text-6xl font-bold leading-tight mb-6">{service.title_ar}</h1>
              <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{service.hero_description ?? service.short_description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={quote.open} className="px-7 py-3.5 rounded-full bg-[var(--color-accent)] text-primary font-bold hover:scale-[1.02] transition">اطلب دراسة الآن</button>
                <a href="#process" className="px-7 py-3.5 rounded-full bg-white/10 border border-white/30 backdrop-blur-md hover:bg-white/20 transition">منهجية العمل</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-h" className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6">
          <header className="mb-12 max-w-2xl">
            <p className="text-secondary font-semibold mb-2">الفوائد الهندسية</p>
            <h2 id="benefits-h" className="text-3xl md:text-4xl font-bold text-primary">لماذا تختار {service.title_ar}؟</h2>
          </header>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.benefits.map((b: string, i: number) => (
              <li key={i} className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <CheckCircle2 className="w-8 h-8 text-[var(--color-accent)] mb-4" />
                <p className="text-base leading-relaxed text-foreground/90">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section id="process" aria-labelledby="process-h" className="py-20 md:py-28 bg-muted/40">
        <div className="max-w-[1320px] mx-auto px-6">
          <header className="mb-14 max-w-2xl">
            <p className="text-secondary font-semibold mb-2">منهجيتنا</p>
            <h2 id="process-h" className="text-3xl md:text-4xl font-bold text-primary">خطوات تنفيذ الدراسة</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">منهجية هندسية واضحة من جمع البيانات وحتى تسليم التقرير النهائي.</p>
          </header>
          <ol className="relative grid gap-6">
            {service.process_steps.map((step: string, i: number) => (
              <li key={i} className="relative bg-card border border-border rounded-2xl p-6 md:p-8 flex gap-6 items-start">
                <span className="shrink-0 w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-bold text-lg">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-lg leading-relaxed text-foreground/90 pt-3">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related projects */}
      {projects.length > 0 && (
        <section aria-labelledby="projects-h" className="py-20 md:py-28">
          <div className="max-w-[1320px] mx-auto px-6">
            <header className="mb-12 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="text-secondary font-semibold mb-2">مشاريع ذات صلة</p>
                <h2 id="projects-h" className="text-3xl md:text-4xl font-bold text-primary">من أعمالنا في {service.title_ar}</h2>
              </div>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p: ProjectRow) => (
                <article key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                  {p.image_url && (
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mb-2"><MapPin className="w-3.5 h-3.5" />{p.location}</p>
                    <h3 className="text-xl font-bold text-primary mb-2">{p.title}</h3>
                    {p.description && <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section aria-labelledby="faq-h" className="py-20 md:py-28 bg-muted/40">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-10 text-center">
            <p className="text-secondary font-semibold mb-2">الأسئلة الشائعة</p>
            <h2 id="faq-h" className="text-3xl md:text-4xl font-bold text-primary">إجابات على أكثر التساؤلات</h2>
          </header>
          <div className="space-y-4">
            {service.faqs.map((f: FAQ, i: number) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />)}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-secondary p-10 md:p-16 text-primary-foreground">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-8 justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">جاهز لبدء دراسة {service.title_ar}؟</h2>
                <p className="text-white/85 text-lg">تواصل مع فريقنا الهندسي للحصول على عرض مخصص خلال 24 ساعة.</p>
              </div>
              <button onClick={quote.open} className="shrink-0 px-8 py-4 rounded-full bg-[var(--color-accent)] text-primary font-bold inline-flex items-center gap-2 hover:scale-[1.02] transition">
                اطلب عرض سعر <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <details open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)} className="group bg-card border border-border rounded-2xl overflow-hidden">
      <summary className="cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-4">
        <h3 className="font-bold text-lg text-primary">{q}</h3>
        <ChevronDown className={`w-5 h-5 text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </summary>
      <div className="px-5 md:px-6 pb-6 text-muted-foreground leading-relaxed">{a}</div>
    </details>
  );
}