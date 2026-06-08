/**
 * Utilities for transforming Supabase Storage URLs to use Image
 * Transformations (WebP + width) at display time.
 */
const STORAGE_OBJECT_SEGMENT = "/storage/v1/object/public/";
const STORAGE_RENDER_SEGMENT = "/storage/v1/render/image/public/";

export interface ImageOpts {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "origin";
}

/** Convert a Supabase public Storage URL into an Image-Transformations URL. */
export function transformImage(url: string | null | undefined, opts: ImageOpts = {}): string {
  if (!url) return "";
  if (!url.includes(STORAGE_OBJECT_SEGMENT) && !url.includes(STORAGE_RENDER_SEGMENT)) return url;
  const rendered = url.replace(STORAGE_OBJECT_SEGMENT, STORAGE_RENDER_SEGMENT);
  const u = new URL(rendered);
  const w = opts.width ?? 1200;
  const f = opts.format ?? "webp";
  u.searchParams.set("width", String(w));
  if (opts.height) u.searchParams.set("height", String(opts.height));
  u.searchParams.set("quality", String(opts.quality ?? 80));
  u.searchParams.set("format", f);
  return u.toString();
}

/** Extracts the bucket-relative path from a Supabase public Storage URL. */
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  for (const seg of [STORAGE_OBJECT_SEGMENT, STORAGE_RENDER_SEGMENT]) {
    const idx = url.indexOf(seg);
    if (idx >= 0) return url.slice(idx + seg.length).split("?")[0];
  }
  return null;
}