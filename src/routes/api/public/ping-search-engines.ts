import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const SITEMAP = "https://atr-traffic.com/sitemap.xml";

export const Route = createFileRoute("/api/public/ping-search-engines")({
  server: {
    handlers: {
      POST: async () => {
        const results: Record<string, string> = {};
        // Bing (still active)
        try {
          const r = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`, { method: "GET" });
          results.bing = `${r.status}`;
        } catch (e) {
          results.bing = `error: ${(e as Error).message}`;
        }
        // Google deprecated /ping in 2023 — we attempt it anyway for completeness
        try {
          const r = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`, { method: "GET" });
          results.google = `${r.status} (Google deprecated ping — استخدم Search Console)`;
        } catch (e) {
          results.google = `error: ${(e as Error).message}`;
        }
        return Response.json(results);
      },
    },
  },
});