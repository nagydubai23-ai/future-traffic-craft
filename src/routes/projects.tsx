import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "المشاريع | ارت ترافيك" },
      { name: "description", content: "أبرز مشاريع ارت ترافيك في مدن المملكة." },
      { property: "og:title", content: "المشاريع | ارت ترافيك" },
      { property: "og:description", content: "أبرز مشاريع ارت ترافيك في مدن المملكة." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { t, dir } = useI18n();
  return (
    <main dir={dir} className="bg-background">
      <section className="bg-gradient-to-bl from-primary to-secondary text-primary-foreground">
        <div className="max-w-[1320px] mx-auto px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("page.projects.title")}</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{t("page.projects.intro")}</p>
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