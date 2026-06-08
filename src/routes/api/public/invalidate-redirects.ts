import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/invalidate-redirects")({
  server: {
    handlers: {
      POST: async () => {
        const { invalidateRedirectsCache } = await import("@/lib/redirects-cache.server");
        invalidateRedirectsCache();
        return Response.json({ ok: true });
      },
    },
  },
});