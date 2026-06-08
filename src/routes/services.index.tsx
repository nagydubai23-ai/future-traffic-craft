import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { listServices, getStaticPageSeo, type ServiceRow } from "@/lib/content.functions";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { IconByName } from "@/components/shared/IconByName";
import { ArrowLeft } from "lucide-react";
import { absUrl, hreflangLinks, breadcrumbJsonLd } from "@/lib/seo";

const servicesQuery = queryOptions({
  queryKey: ["services", "list"],
  queryFn: () => listServices(),
});

export const Route = createFileRoute("/services/")({
  loader: async ({ context }) => {
    const [, seo] = await Promise.all([
      context.queryClient.ensureQueryData(servicesQuery),
      getStaticPageSeo({ data: { page: "services" } }),
    ]);
    return seo;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? "خدماتنا | ارت ترافيك" },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: loaderData?.title ?? "خدماتنا | ارت ترافيك" },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:url", content: absUrl("/services") },
    ],
    links: [{ rel: "canonical", href: absUrl("/services") }, ...hreflangLinks("/services")],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(breadcrumbJsonLd([
        { name: "الرئيسية", path: "/" },
        { name: "الخدمات", path: "/services" },
      ])),
    }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { t, lang, dir } = useI18n();
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <main dir={dir} className="bg-background">
      <section className="bg-gradient-to-bl from-primary to-secondary text-primary-foreground">
        <div className="max-w-[1320px] mx-auto px-6 py-24 md:py-28">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("page.services.title")}</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{t("page.services.intro")}</p>
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6">
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s: ServiceRow) => (
              <li key={s.id}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group block h-full bg-card border border-border rounded-2xl p-7 hover:border-secondary hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/5 grid place-items-center mb-5 group-hover:bg-secondary/10 transition">
                    <IconByName name={s.icon_name} className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition">
                    {lang === "ar" ? s.title_ar : (s.title_en ?? s.title_ar)}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.short_description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                    {lang === "ar" ? "اقرأ المزيد" : "Read more"}
                    <ArrowLeft className={`w-4 h-4 ${dir === "ltr" ? "rotate-180" : ""}`} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}