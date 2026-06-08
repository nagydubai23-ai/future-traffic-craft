import { createServerFn } from "@tanstack/react-start";

/**
 * Looks up a redirect for the given path. Returns null when nothing matches.
 * Called from the client (NotFound boundary) to honor admin-managed redirects.
 */
export const lookupRedirect = createServerFn({ method: "GET" })
  .inputValidator((d: { path: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("redirects")
      .select("source, destination, status_code, is_active")
      .eq("source", data.path)
      .eq("is_active", true)
      .maybeSingle();
    if (!row) return null;
    return { destination: row.destination, status_code: row.status_code };
  });