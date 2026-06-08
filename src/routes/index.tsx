import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";
import { Stats } from "@/components/home/Stats";
import { Services } from "@/components/home/Services";
import { AEOFaq } from "@/components/home/AEOFaq";
import { absUrl, hreflangLinks, BASE_URL } from "@/lib/seo";
import { getStaticPageSeo } from "@/lib/content.functions";

export const Route = createFileRoute("/")({
  loader: () => getStaticPageSeo({ data: { page: "home" } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? "ارت ترافيك" },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: loaderData?.title ?? "ارت ترافيك" },
      { property: "og:description", content: loaderData?.description ?? "" },
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
      <AEOFaq />
    </main>
  );
}
