import { createServerFn } from "@tanstack/react-start";

export interface BlogPostRow {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string | null;
  body_ar: string | null;
  body_en: string | null;
  image_url: string | null;
  excerpt: string | null;
  category: string | null;
  author: string | null;
  reading_minutes: number | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  noindex: boolean | null;
  nofollow: boolean | null;
  schema_type: string | null;
  schema_json: unknown;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}

const SELECT_COLS =
  "id, slug, title_ar, title_en, body_ar, body_en, image_url, excerpt, category, author, reading_minutes, meta_title, meta_description, keywords, og_image, canonical_url, og_title, og_description, noindex, nofollow, schema_type, schema_json, published_at, created_at, updated_at, is_published";

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select(SELECT_COLS)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as BlogPostRow[];
});

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;

    const { data: related } = await supabaseAdmin
      .from("blog_posts")
      .select("id, slug, title_ar, image_url, excerpt, category, reading_minutes")
      .eq("is_published", true)
      .neq("slug", data.slug)
      .limit(3);

    return {
      post: post as unknown as BlogPostRow,
      related: (related ?? []) as Array<Pick<BlogPostRow, "id" | "slug" | "title_ar" | "image_url" | "excerpt" | "category" | "reading_minutes">>,
    };
  });