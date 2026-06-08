import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const FALLBACK = `# Default — allow all crawlers
User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth
Disallow: /api/

Sitemap: https://atr-traffic.com/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data } = await supabaseAdmin
          .from("site_settings")
          .select("value")
          .eq("key", "robots_txt_content")
          .maybeSingle();
        const body = (data?.value && data.value.trim()) ? data.value : FALLBACK;
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});