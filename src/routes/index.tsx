import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";
import { Stats } from "@/components/home/Stats";
import { Services } from "@/components/home/Services";
import { absUrl, hreflangLinks, BASE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ارت ترافيك | حلول مرورية ذكية لمدن المستقبل" },
      { name: "description", content: "ارت ترافيك — استشارات هندسة المرور: دراسات الأثر المروري، السلامة المرورية، والتنقل الذكي." },
      { property: "og:title", content: "ارت ترافيك | حلول مرورية ذكية" },
      { property: "og:description", content: "دراسات وتحليلات مرورية متقدمة وفق أعلى المعايير الهندسية." },
      { property: "og:url", content: absUrl("/") },
    ],
    links: [{ rel: "canonical", href: absUrl("/") }, ...hreflangLinks("/")],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "ارت ترافيك",
        url: BASE_URL,
        areaServed: { "@type": "Country", name: "Saudi Arabia" },
        priceRange: "$$",
        telephone: "+966-50-000-0000",
      }),
    }],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
    </main>
  );
}
