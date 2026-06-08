/**
 * Server-only in-memory redirect cache. Loaded lazily, refreshed every 5
 * minutes, and invalidated explicitly via /api/public/invalidate-redirects.
 * Per-worker-instance — eventual consistency across instances is bounded
 * by the TTL.
 */
type Entry = { destination: string; status_code: number };

const TTL_MS = 5 * 60 * 1000;
let cache: Map<string, Entry> | null = null;
let loadedAt = 0;
let inflight: Promise<Map<string, Entry>> | null = null;

async function loadFromDb(): Promise<Map<string, Entry>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("redirects")
    .select("source, destination, status_code")
    .eq("is_active", true);
  if (error) throw error;
  const map = new Map<string, Entry>();
  for (const r of data ?? []) {
    map.set(normalize(r.source), { destination: r.destination, status_code: r.status_code });
  }
  return map;
}

function normalize(p: string): string {
  if (!p) return "/";
  let path = p.trim();
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

export async function getRedirect(path: string): Promise<Entry | null> {
  const now = Date.now();
  if (!cache || now - loadedAt > TTL_MS) {
    if (!inflight) {
      inflight = loadFromDb()
        .then((m) => {
          cache = m;
          loadedAt = Date.now();
          return m;
        })
        .finally(() => {
          inflight = null;
        });
    }
    try {
      await inflight;
    } catch {
      // On failure, keep stale cache if present; otherwise no redirects.
      if (!cache) cache = new Map();
    }
  }
  return cache!.get(normalize(path)) ?? null;
}

export function invalidateRedirectsCache() {
  cache = null;
  loadedAt = 0;
}