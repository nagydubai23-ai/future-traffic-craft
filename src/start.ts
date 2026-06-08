import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Server-side redirect interceptor. Checks the in-memory redirects cache for
 * the request pathname and returns a 301/302 before any route handler runs.
 */
const redirectsMiddleware = createMiddleware().server(async ({ next, request }) => {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    // Skip assets, API routes, and special files.
    if (
      path.startsWith("/_") ||
      path.startsWith("/api/") ||
      path.startsWith("/assets/") ||
      path.includes(".")
    ) {
      return await next();
    }
    const { getRedirect } = await import("./lib/redirects-cache.server");
    const hit = await getRedirect(path);
    if (hit) {
      const dest = hit.destination.startsWith("http")
        ? hit.destination
        : new URL(hit.destination, url.origin).toString();
      return new Response(null, {
        status: hit.status_code === 302 ? 302 : 301,
        headers: { Location: dest, "Cache-Control": "no-cache" },
      });
    }
  } catch (e) {
    console.error("redirects middleware error", e);
  }
  return await next();
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, redirectsMiddleware],
}));
