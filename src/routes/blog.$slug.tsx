import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { getBlogPost } from "@/lib/blog.functions";
import { absUrl, hreflangLinks, breadcrumbJsonLd, BASE_URL } from "@/lib/seo";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const result = await getBlogPost({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "مقال | ارت ترافيك" }] };
    const title = p.meta_title || p.title_ar;
    const description = p.meta_description || p.excerpt || "";
    const path = `/blog/${p.slug}`;
    const image = p.og_image || p.image_url || undefined;
    const publishedISO = p.published_at ?? p.created_at;
    const ogTitle = p.og_title || title;
    const ogDesc = p.og_description || description;
    const robotsParts = [p.noindex ? "noindex" : "index", p.nofollow ? "nofollow" : "follow"];

    return {
      meta: [
        { title: `${title} | ارت ترافيك` },
        { name: "description", content: description },
        { name: "robots", content: robotsParts.join(", ") },
        ...(p.keywords ? [{ name: "keywords", content: p.keywords }] : []),
        ...(p.author ? [{ name: "author", content: p.author }] : []),
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDesc },
        { property: "og:url", content: absUrl(path) },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "ar_SA" },
        { property: "article:published_time", content: publishedISO },
        { property: "article:modified_time", content: p.updated_at },
        ...(p.category ? [{ property: "article:section", content: p.category }] : []),
        ...(image ? [
          { property: "og:image", content: image },
          { name: "twitter:image", content: image },
        ] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: ogTitle },
        { name: "twitter:description", content: ogDesc },
      ],
      links: [
        { rel: "canonical", href: p.canonical_url || absUrl(path) },
        ...hreflangLinks(path),
      ],
      scripts: [
        p.schema_json ? {
          type: "application/ld+json",
          children: JSON.stringify(p.schema_json),
        } : {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": p.schema_type || "Article",
            headline: title,
            description,
            image: image ? [image] : undefined,
            datePublished: publishedISO,
            dateModified: p.updated_at,
            author: { "@type": p.author ? "Person" : "Organization", name: p.author || "ارت ترافيك" },
            publisher: {
              "@type": "Organization",
              name: "ارت ترافيك",
              url: BASE_URL,
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}${path}` },
            articleSection: p.category || undefined,
            keywords: p.keywords || undefined,
            inLanguage: "ar-SA",
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "المدونة", path: "/blog" },
            { name: title, path },
          ])),
        },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <main dir="rtl" className="min-h-[60vh] grid place-items-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">المقال غير موجود</h1>
        <Link to="/blog" className="text-secondary underline">العودة للمدونة</Link>
      </div>
    </main>
  ),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <main dir="rtl" className="min-h-[60vh] grid place-items-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">تعذر تحميل المقال</h1>
          <button onClick={() => { reset(); router.invalidate(); }} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground">إعادة المحاولة</button>
        </div>
      </main>
    );
  },
});

function BlogPostPage() {
  const { post, related } = Route.useLoaderData();
  const publishedAt = post.published_at ?? post.created_at;

  return (
    <main dir="rtl" className="bg-background">
      <article>
        {/* Hero */}
        <header className="bg-gradient-to-bl from-primary to-secondary text-primary-foreground">
          <div className="max-w-[920px] mx-auto px-6 py-16 md:py-24">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4" /> العودة للمدونة
            </Link>
            {post.category && (
              <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{post.title_ar}</h1>
            {post.excerpt && <p className="text-lg text-white/85 leading-relaxed mb-6">{post.excerpt}</p>}
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/75">
              {post.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {post.author}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={publishedAt}>{new Date(publishedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</time>
              </span>
              {post.reading_minutes && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {post.reading_minutes} دقيقة قراءة
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Cover */}
        {post.image_url && (
          <div className="max-w-[920px] mx-auto px-6 -mt-10">
            <img src={post.image_url} alt={post.title_ar} className="w-full rounded-3xl shadow-xl aspect-[16/9] object-cover" />
          </div>
        )}

        {/* Body */}
        <section className="py-12 md:py-16">
          <div className="max-w-[760px] mx-auto px-6">
            {post.body_ar ? (
              <div
                className="prose prose-lg prose-rtl max-w-none prose-headings:text-primary prose-a:text-secondary prose-img:rounded-2xl prose-blockquote:border-secondary"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: post.body_ar }}
              />
            ) : (
              <p className="text-muted-foreground">لا يوجد محتوى لهذا المقال بعد.</p>
            )}

            {post.keywords && (
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground mb-2">الوسوم</p>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.split(",").map((k: string) => {
                    const tag = k.trim();
                    if (!tag) return null;
                    return (
                      <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full text-primary">
                        #{tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-16 bg-muted/40">
            <div className="max-w-[1320px] mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((r: typeof related[number]) => (
                  <Link key={r.id} to="/blog/$slug" params={{ slug: r.slug }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all">
                    {r.image_url && <img src={r.image_url} alt={r.title_ar} className="w-full h-40 object-cover" loading="lazy" />}
                    <div className="p-5">
                      {r.category && <span className="text-[11px] font-bold uppercase text-secondary">{r.category}</span>}
                      <h3 className="font-bold text-primary mt-1 line-clamp-2">{r.title_ar}</h3>
                      {r.excerpt && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </main>
  );
}