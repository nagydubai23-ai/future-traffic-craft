import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL } from "@/lib/seo";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/services", changefreq: "weekly", priority: "0.9" },
          { path: "/projects", changefreq: "weekly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
        ];

        const [services, cities, posts] = await Promise.all([
          supabaseAdmin.from("services").select("slug, updated_at, priority, changefreq, noindex").eq("is_published", true),
          supabaseAdmin.from("cities").select("slug, updated_at, priority, changefreq, noindex").eq("is_published", true),
          supabaseAdmin.from("blog_posts").select("slug, updated_at, priority, changefreq, noindex").eq("is_published", true),
        ]);

        for (const s of services.data ?? []) {
          if (s.noindex) continue;
          entries.push({ path: `/services/${s.slug}`, lastmod: s.updated_at?.slice(0, 10), changefreq: (s.changefreq as SitemapEntry["changefreq"]) ?? "monthly", priority: s.priority != null ? String(s.priority) : "0.8" });
        }
        for (const c of cities.data ?? []) {
          if (c.noindex) continue;
          entries.push({ path: `/cities/${c.slug}`, lastmod: c.updated_at?.slice(0, 10), changefreq: (c.changefreq as SitemapEntry["changefreq"]) ?? "monthly", priority: c.priority != null ? String(c.priority) : "0.8" });
        }
        for (const p of posts.data ?? []) {
          if (p.noindex) continue;
          entries.push({ path: `/blog/${p.slug}`, lastmod: p.updated_at?.slice(0, 10), changefreq: (p.changefreq as SitemapEntry["changefreq"]) ?? "monthly", priority: p.priority != null ? String(p.priority) : "0.6" });
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `    <xhtml:link rel="alternate" hreflang="ar-SA" href="${BASE_URL}${e.path}" />`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${e.path}" />`,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});