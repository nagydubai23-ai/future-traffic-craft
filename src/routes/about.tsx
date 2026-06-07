import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { absUrl, hreflangLinks, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | ارت ترافيك" },
      { name: "description", content: "ارت ترافيك — بيت خبرة سعودي متخصص في استشارات هندسة المرور." },
      { property: "og:title", content: "من نحن | ارت ترافيك" },
      { property: "og:description", content: "بيت خبرة سعودي متخصص في استشارات هندسة المرور." },
      { property: "og:url", content: absUrl("/about") },
    ],
    links: [{ rel: "canonical", href: absUrl("/about") }, ...hreflangLinks("/about")],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(breadcrumbJsonLd([
        { name: "الرئيسية", path: "/" },
        { name: "من نحن", path: "/about" },
      ])),
    }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, dir } = useI18n();
  return (
    <main dir={dir} className="bg-background">
      <section className="bg-gradient-to-bl from-primary to-secondary text-primary-foreground">
        <div className="max-w-[1320px] mx-auto px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("page.about.title")}</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{t("page.about.intro")}</p>
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6">
          <p className="text-muted-foreground leading-loose max-w-3xl">{t("common.coming_soon")}</p>
        </div>
      </section>
    </main>
  );
}