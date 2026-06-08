import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { getCity, type FAQ } from "@/lib/content.functions";
import { IconByName } from "@/components/shared/IconByName";
import { useQuote } from "@/components/quote/QuoteContext";
import { useState } from "react";
import { ChevronDown, ArrowLeft, ShieldCheck, MapPin, Phone } from "lucide-react";
import { absUrl, hreflangLinks, breadcrumbJsonLd, faqJsonLd, BASE_URL } from "@/lib/seo";
import { useContactSettings, telHref } from "@/hooks/useContactSettings";

export const Route = createFileRoute("/cities/$city")({
  loader: async ({ params }) => {
    const result = await getCity({ data: { slug: params.city } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const c = loaderData?.city;
    const name = c?.name_ar ?? "";
    const title = c?.meta_title || c?.hero_title || `دراسات مرورية في ${name}`;
    const desc = c?.meta_description || c?.hero_description || "";
    const slug = loaderData?.city.slug ?? "";
    const path = `/cities/${slug}`;
    const faqs = loaderData?.city.faqs ?? [];
    const image = c?.og_image || c?.image_url || undefined;
    const ogTitle = c?.og_title || `${title} | ارت ترافيك`;
    const ogDesc = c?.og_description || desc;
    const robotsParts = [c?.noindex ? "noindex" : "index", c?.nofollow ? "nofollow" : "follow"];
    return {
      meta: [
        { title: `${title} | ارت ترافيك` },
        { name: "description", content: desc },
        { name: "robots", content: robotsParts.join(", ") },
        ...(c?.keywords ? [{ name: "keywords", content: c.keywords }] : []),
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:url", content: absUrl(path) },
        { property: "og:type", content: "website" },
        ...(image ? [
          { property: "og:image", content: image },
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
        ] : []),
      ],
      links: [{ rel: "canonical", href: c?.canonical_url || absUrl(path) }, ...hreflangLinks(path)],
      scripts: [
        c?.schema_json ? {
          type: "application/ld+json",
          children: JSON.stringify(c.schema_json),
        } : {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": c?.schema_type || "LocalBusiness",
            name: `ارت ترافيك - ${name}`,
            description: desc,
            url: `${BASE_URL}${path}`,
            areaServed: { "@type": "City", name },
            address: { "@type": "PostalAddress", addressLocality: name, addressCountry: "SA" },
            telephone: "+966-50-000-0000",
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "المدن", path: "/" },
            { name, path },
          ])),
        },
        ...(faqs.length > 0 ? [{
          type: "application/ld+json",
          children: JSON.stringify(faqJsonLd(faqs)),
        }] : []),
      ],
    };
  },
  component: CityPage,
  notFoundComponent: () => (
    <main dir="rtl" className="min-h-[60vh] grid place-items-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">المدينة غير موجودة</h1>
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

interface CityService { id: string; slug: string; title_ar: string; icon_name: string | null; short_description: string | null }

function CityPage() {
  const { city, services } = Route.useLoaderData();
  const quote = useQuote();

  return (
    <main dir="rtl" className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, var(--color-accent) 0, transparent 45%), radial-gradient(circle at 10% 80%, var(--color-secondary) 0, transparent 45%)" }} />
        <div className="relative max-w-[1320px] mx-auto px-6 py-24 md:py-32">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/70 flex items-center gap-2">
            <Link to="/" className="hover:text-white">الرئيسية</Link>
            <span>/</span>
            <span>المدن</span>
            <span>/</span>
            <span className="text-white">{city.name_ar}</span>
          </nav>
          <div className="flex items-center gap-3 mb-6 text-[var(--color-accent)] font-semibold">
            <MapPin className="w-5 h-5" /> <span>المملكة العربية السعودية · {city.name_en ?? city.name_ar}</span>
          </div>
          <h1 className="font-[var(--font-arabic)] text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-4xl">{city.hero_title ?? `دراسات مرورية معتمدة في ${city.name_ar}`}</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{city.hero_description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={quote.open} className="px-7 py-3.5 rounded-full bg-[var(--color-accent)] text-primary font-bold hover:scale-[1.02] transition">اطلب دراسة في {city.name_ar}</button>
            <a href="#services" className="px-7 py-3.5 rounded-full bg-white/10 border border-white/30 backdrop-blur-md hover:bg-white/20 transition">خدماتنا في المدينة</a>
          </div>
        </div>
      </section>

      {/* Services in city */}
      <section id="services" aria-labelledby="services-h" className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6">
          <header className="mb-12 max-w-2xl">
            <p className="text-secondary font-semibold mb-2">خدماتنا المتاحة</p>
            <h2 id="services-h" className="text-3xl md:text-4xl font-bold text-primary">حلول هندسة المرور في {city.name_ar}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">نقدم باقة متكاملة من الدراسات الهندسية لخدمة المشاريع التطويرية في {city.name_ar}.</p>
          </header>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s: CityService) => (
              <Link key={s.id} to="/services/$slug" params={{ slug: s.slug }} className="group bg-card border border-border rounded-2xl p-6 hover:border-secondary hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/5 grid place-items-center mb-4 group-hover:bg-secondary/10 transition">
                  <IconByName name={s.icon_name} className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-bold text-lg text-primary mb-2 group-hover:text-secondary transition">{s.title_ar}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{s.short_description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      {city.compliance_info && (
        <section aria-labelledby="compliance-h" className="py-20 md:py-28 bg-muted/40">
          <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center mb-5">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <p className="text-secondary font-semibold mb-2">الامتثال المحلي</p>
              <h2 id="compliance-h" className="text-3xl md:text-4xl font-bold text-primary leading-tight">الاشتراطات السعودية والمحلية في {city.name_ar}</h2>
            </div>
            <article
              dir="rtl"
              className="bg-card border border-border rounded-2xl p-8 md:p-10 prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary prose-strong:text-primary prose-img:rounded-2xl prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-[var(--color-accent)]"
              dangerouslySetInnerHTML={{ __html: city.compliance_info }}
            />
          </div>
        </section>
      )}

      {/* SEO Content */}
      {(city.seo_content_ar || city.body) && (
        <section aria-labelledby="seo-h" className="py-16 md:py-20">
          <div className="max-w-[860px] mx-auto px-6">
            <header className="mb-8">
              <p className="text-secondary font-semibold mb-2">معلومات إضافية</p>
              <h2 id="seo-h" className="text-3xl md:text-4xl font-bold text-primary">دراسات مرورية في {city.name_ar} — دليل متكامل</h2>
            </header>
            <article
              dir="rtl"
              className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-a:text-secondary prose-strong:text-primary prose-img:rounded-2xl prose-blockquote:border-r-4 prose-blockquote:border-l-0 prose-blockquote:border-[var(--color-accent)] prose-blockquote:bg-muted/40 prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:rounded-lg"
              dangerouslySetInnerHTML={{ __html: (city.seo_content_ar ?? city.body) as string }}
            />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section aria-labelledby="faq-h" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-10 text-center">
            <p className="text-secondary font-semibold mb-2">أسئلة شائعة</p>
            <h2 id="faq-h" className="text-3xl md:text-4xl font-bold text-primary">دراسات مرورية في {city.name_ar}</h2>
          </header>
          <div className="space-y-4">
            {city.faqs.map((f: FAQ, i: number) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />)}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-secondary p-10 md:p-16 text-primary-foreground">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-8 justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">مشروعك في {city.name_ar}؟ تحدث مع مهندسينا</h2>
                <p className="text-white/85 text-lg">فريق متخصص يخدم {city.name_ar} والمدن المجاورة بأعلى المعايير الهندسية.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button onClick={quote.open} className="px-8 py-4 rounded-full bg-[var(--color-accent)] text-primary font-bold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition">
                  اطلب عرض سعر <ArrowLeft className="w-5 h-5" />
                </button>
                <a href={telHref(contact.phone)} className="px-8 py-4 rounded-full bg-white/10 border border-white/30 backdrop-blur-md inline-flex items-center justify-center gap-2 hover:bg-white/20 transition">
                  <Phone className="w-5 h-5" /> اتصل بنا
                </a>
              </div>
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