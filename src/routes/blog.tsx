import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { absUrl, hreflangLinks, breadcrumbJsonLd } from "@/lib/seo";
import { listBlogPosts, type BlogPostRow } from "@/lib/blog.functions";
import { transformImage } from "@/lib/image-url";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog")({
  loader: () => listBlogPosts(),
  head: () => ({
    meta: [
      { title: "المدونة | ارت ترافيك" },
      { name: "description", content: "أحدث المقالات في هندسة المرور والنقل الذكي." },
      { property: "og:title", content: "المدونة | ارت ترافيك" },
      { property: "og:description", content: "أحدث المقالات في هندسة المرور والنقل الذكي." },
      { property: "og:url", content: absUrl("/blog") },
    ],
    links: [{ rel: "canonical", href: absUrl("/blog") }, ...hreflangLinks("/blog")],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(breadcrumbJsonLd([
        { name: "الرئيسية", path: "/" },
        { name: "المدونة", path: "/blog" },
      ])),
    }],
  }),
  component: BlogPage,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <main dir="rtl" className="min-h-[60vh] grid place-items-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">تعذر تحميل المدونة</h1>
          <button onClick={() => { reset(); router.invalidate(); }} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground">إعادة المحاولة</button>
        </div>
      </main>
    );
  },
  notFoundComponent: () => null,
});

function BlogPage() {
  const { t, dir } = useI18n();
  const posts = Route.useLoaderData();
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
          {posts.length === 0 ? (
            <p className="text-muted-foreground leading-loose max-w-3xl">{t("common.coming_soon")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p: BlogPostRow) => (
                <Link
                  key={p.id}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group rounded-3xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all"
                >
                  {p.image_url ? (
                    <img src={transformImage(p.image_url, { width: 800 })} alt={p.title_ar} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10" />
                  )}
                  <div className="p-6">
                    {p.category && (
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-secondary mb-2">{p.category}</span>
                    )}
                    <h2 className="text-xl font-bold text-primary mb-2 line-clamp-2">{p.title_ar}</h2>
                    {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{p.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(p.published_at ?? p.created_at).toLocaleDateString("ar-SA")}
                      </span>
                      {p.reading_minutes && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {p.reading_minutes} د قراءة
                        </span>
                      )}
                      <span className="mr-auto inline-flex items-center gap-1 text-secondary font-semibold">
                        اقرأ المزيد <ArrowLeft className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}