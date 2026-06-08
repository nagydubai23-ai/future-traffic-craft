import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ImageRow {
  path: string;
  name: string;
  size: number;
  updated_at: string | null;
  public_url: string;
  alt_text: string;
  references: { table: string; id: string; column: string; label: string }[];
}

const BUCKET = "cms-images";

async function listAll(supabase: any, prefix = ""): Promise<{ name: string; size: number; updated_at: string | null; path: string }[]> {
  const out: { name: string; size: number; updated_at: string | null; path: string }[] = [];
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000, sortBy: { column: "updated_at", order: "desc" } });
  if (error) throw error;
  for (const item of data ?? []) {
    const full = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) {
      const nested = await listAll(supabase, full);
      out.push(...nested);
    } else {
      out.push({
        name: item.name,
        size: (item.metadata as any)?.size ?? 0,
        updated_at: item.updated_at ?? item.created_at ?? null,
        path: full,
      });
    }
  }
  return out;
}

export const listImages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ImageRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const files = await listAll(supabaseAdmin);

    const [services, cities, blog, projects, alts] = await Promise.all([
      supabaseAdmin.from("services").select("id, slug, title_ar, og_image"),
      supabaseAdmin.from("cities").select("id, slug, name_ar, image_url, og_image"),
      supabaseAdmin.from("blog_posts").select("id, slug, title_ar, image_url, og_image"),
      supabaseAdmin.from("projects").select("id, title_ar, image_url"),
      supabaseAdmin.from("image_alt_texts").select("storage_path, alt_text"),
    ]);

    const altMap = new Map<string, string>();
    for (const r of alts.data ?? []) altMap.set(r.storage_path, r.alt_text);

    const base = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
    const publicUrlFor = (path: string) => `${base}/storage/v1/object/public/${BUCKET}/${path}`;

    const refs = new Map<string, { table: string; id: string; column: string; label: string }[]>();
    const pushRef = (path: string, ref: { table: string; id: string; column: string; label: string }) => {
      if (!refs.has(path)) refs.set(path, []);
      refs.get(path)!.push(ref);
    };
    const pathFromUrl = (url: string | null) => {
      if (!url) return null;
      const i = url.indexOf(`/${BUCKET}/`);
      if (i < 0) return null;
      return url.slice(i + BUCKET.length + 2).split("?")[0];
    };
    for (const s of services.data ?? []) {
      const p = pathFromUrl(s.og_image);
      if (p) pushRef(p, { table: "services", id: s.id, column: "og_image", label: s.title_ar || s.slug });
    }
    for (const c of cities.data ?? []) {
      for (const col of ["image_url", "og_image"] as const) {
        const p = pathFromUrl((c as any)[col]);
        if (p) pushRef(p, { table: "cities", id: c.id, column: col, label: c.name_ar || c.slug });
      }
    }
    for (const b of blog.data ?? []) {
      for (const col of ["image_url", "og_image"] as const) {
        const p = pathFromUrl((b as any)[col]);
        if (p) pushRef(p, { table: "blog_posts", id: b.id, column: col, label: b.title_ar || b.slug });
      }
    }
    for (const pr of projects.data ?? []) {
      const p = pathFromUrl(pr.image_url);
      if (p) pushRef(p, { table: "projects", id: pr.id, column: "image_url", label: pr.title_ar });
    }

    return files.map((f) => ({
      path: f.path,
      name: f.name,
      size: f.size,
      updated_at: f.updated_at,
      public_url: publicUrlFor(f.path),
      alt_text: altMap.get(f.path) ?? "",
      references: refs.get(f.path) ?? [],
    }));
  });

export const setImageAlt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { storage_path: string; alt_text: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("image_alt_texts")
      .upsert({ storage_path: data.storage_path, alt_text: data.alt_text }, { onConflict: "storage_path" });
    if (error) throw error;
    return { ok: true };
  });