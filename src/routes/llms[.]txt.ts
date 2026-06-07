import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL } from "@/lib/seo";

// /llms.txt — Answer Engine Optimization (AEO) entry point.
// Spec: https://llmstxt.org — read by ChatGPT, Perplexity, Claude, Gemini,
// and other LLM crawlers to understand the site without parsing the JS shell.
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const [services, cities, posts] = await Promise.all([
          supabaseAdmin
            .from("services")
            .select("slug, title_ar, title_en, short_description, description_ar, description_en")
            .eq("is_published", true)
            .order("display_order"),
          supabaseAdmin
            .from("cities")
            .select("slug, name_ar")
            .eq("is_published", true),
          supabaseAdmin
            .from("blog_posts")
            .select("slug, title, excerpt")
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .limit(10),
        ]);

        const lines: string[] = [];
        lines.push(`# ART Traffic — ارت ترافيك`);
        lines.push("");
        lines.push(
          `> مكتب استشارات هندسية متخصص في الدراسات المرورية في المملكة العربية السعودية: دراسات التأثير المروري (TIA)، السلامة المرورية، تصميم التقاطعات والإشارات، خطط إدارة المرور (TMP)، ودراسات المواقف والمشاة. خدمات معتمدة في الرياض وجدة والدمام ومكة المكرمة والمدينة المنورة.`,
        );
        lines.push("");
        lines.push(
          `ART Traffic (Art Traffic / ارت ترافيك) is a Saudi traffic engineering consultancy delivering Traffic Impact Assessment (TIA), traffic safety audits, intersection and signal design, traffic management plans (TMP), parking studies, and pedestrian/bike studies in compliance with Saudi MOMRAH and municipal regulations.`,
        );
        lines.push("");
        lines.push(`- Website: ${BASE_URL}`);
        lines.push(`- Country: Saudi Arabia (KSA)`);
        lines.push(`- Languages: Arabic (primary), English`);
        lines.push(`- Contact: ${BASE_URL}/contact`);
        lines.push("");

        lines.push(`## Core pages`);
        lines.push(`- [Home / الرئيسية](${BASE_URL}/): Overview of services and offices.`);
        lines.push(`- [About / من نحن](${BASE_URL}/about): Company background, team, certifications.`);
        lines.push(`- [Services / الخدمات](${BASE_URL}/services): Full list of traffic engineering services.`);
        lines.push(`- [Projects / المشاريع](${BASE_URL}/projects): Portfolio of completed traffic studies and designs.`);
        lines.push(`- [Blog / المدونة](${BASE_URL}/blog): Articles on Saudi traffic engineering, regulations, and best practices.`);
        lines.push(`- [Contact / اتصل بنا](${BASE_URL}/contact): Request a traffic study quote.`);
        lines.push("");

        lines.push(`## Services / الخدمات`);
        for (const s of services.data ?? []) {
          const title = s.title_ar || s.title_en || s.slug;
          const desc = (s.description_ar || s.description_en || s.short_description || "").replace(/\s+/g, " ").trim();
          lines.push(`- [${title}](${BASE_URL}/services/${s.slug})${desc ? `: ${desc.slice(0, 200)}` : ""}`);
        }
        lines.push("");

        lines.push(`## Cities served / المدن`);
        for (const c of cities.data ?? []) {
          lines.push(`- [${c.name_ar}](${BASE_URL}/cities/${c.slug}): دراسات مرورية معتمدة في ${c.name_ar}.`);
        }
        lines.push("");

        if ((posts.data ?? []).length > 0) {
          lines.push(`## Recent articles`);
          for (const p of posts.data ?? []) {
            const excerpt = (p.excerpt || "").replace(/\s+/g, " ").trim();
            lines.push(`- [${p.title}](${BASE_URL}/blog/${p.slug})${excerpt ? `: ${excerpt.slice(0, 160)}` : ""}`);
          }
          lines.push("");
        }

        lines.push(`## Optional`);
        lines.push(`- [Sitemap](${BASE_URL}/sitemap.xml): Machine-readable list of all public URLs.`);
        lines.push("");

        return new Response(lines.join("\n"), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});