import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "المدونة | ارت ترافيك" },
      { name: "description", content: "أحدث المقالات في هندسة المرور والنقل الذكي." },
      { property: "og:title", content: "المدونة | ارت ترافيك" },
      { property: "og:description", content: "أحدث المقالات في هندسة المرور والنقل الذكي." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { t, dir } = useI18n();
  return (
    <main dir={dir} className="bg-background">
      <section className="bg-gradient-to-bl from-primary to-secondary text-primary-foreground">
        <div className="max-w-[1320px] mx-auto px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("page.blog.title")}</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{t("page.blog.intro")}</p>
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