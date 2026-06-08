import { createServerFn } from "@tanstack/react-start";
import type { Json } from "@/integrations/supabase/types";

export interface FAQ { q: string; a: string }

/* ---------- Static page SEO (admin-editable via site_settings) ---------- */

export type StaticPageKey = "home" | "about" | "contact" | "services" | "blog" | "projects";

export interface StaticPageSeo {
  title: string;
  description: string;
}

export const STATIC_PAGE_DEFAULTS: Record<StaticPageKey, StaticPageSeo & { label: string; path: string }> = {
  home: {
    label: "الرئيسية",
    path: "/",
    title: "ارت ترافيك | حلول مرورية ذكية لمدن المستقبل",
    description: "ارت ترافيك — استشارات هندسة المرور: دراسات الأثر المروري، السلامة المرورية، والتنقل الذكي.",
  },
  about: {
    label: "من نحن",
    path: "/about",
    title: "من نحن | مكتب دراسة مرورية معتمد في السعودية — ارت ترافيك",
    description: "ارت ترافيك مكتب دراسة مرورية معتمد في المملكة العربية السعودية، متخصص في دراسات الأثر المروري والسلامة المرورية والتنقل الذكي وفق اشتراطات الهيئات والبلديات.",
  },
  contact: {
    label: "تواصل معنا",
    path: "/contact",
    title: "تواصل معنا | ارت ترافيك",
    description: "تواصل مع فريق ارت ترافيك للاستفسارات والعروض.",
  },
  services: {
    label: "الخدمات",
    path: "/services",
    title: "خدماتنا | ارت ترافيك",
    description: "باقة شاملة من الدراسات والاستشارات الهندسية المرورية.",
  },
  blog: {
    label: "المدونة",
    path: "/blog",
    title: "المدونة | ارت ترافيك",
    description: "أحدث المقالات في هندسة المرور والنقل الذكي.",
  },
  projects: {
    label: "المشاريع",
    path: "/projects",
    title: "المشاريع | ارت ترافيك",
    description: "أبرز مشاريع ارت ترافيك في مدن المملكة.",
  },
};

const STATIC_PAGE_KEYS = Object.keys(STATIC_PAGE_DEFAULTS) as StaticPageKey[];

function isStaticPageKey(v: string): v is StaticPageKey {
  return (STATIC_PAGE_KEYS as string[]).includes(v);
}

export const getStaticPageSeo = createServerFn({ method: "GET" })
  .inputValidator((input: { page: StaticPageKey }) => {
    if (!isStaticPageKey(input.page)) throw new Error("invalid page key");
    return input;
  })
  .handler(async ({ data }): Promise<StaticPageSeo> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const defaults = STATIC_PAGE_DEFAULTS[data.page];
    const titleKey = `seo:${data.page}:title`;
    const descKey = `seo:${data.page}:description`;
    const { data: rows } = await supabaseAdmin
      .from("site_settings")
      .select("key,value")
      .in("key", [titleKey, descKey]);
    const map: Record<string, string> = {};
    (rows ?? []).forEach((r) => { if (r.value) map[r.key] = r.value; });
    return {
      title: map[titleKey]?.trim() || defaults.title,
      description: map[descKey]?.trim() || defaults.description,
    };
  });

export interface ServiceRow {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string | null;
  icon_name: string | null;
  short_description: string | null;
  hero_description: string | null;
  benefits: string[];
  process_steps: string[];
  faqs: FAQ[];
  body: string | null;
  display_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image?: string | null;
  image_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  canonical_url?: string | null;
  noindex?: boolean | null;
  nofollow?: boolean | null;
  schema_type?: string | null;
  schema_json?: Json | null;
}

export interface CityRow {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string | null;
  hero_title: string | null;
  hero_description: string | null;
  compliance_info: string | null;
  faqs: FAQ[];
  image_url: string | null;
  body: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  og_image?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  canonical_url?: string | null;
  noindex?: boolean | null;
  nofollow?: boolean | null;
  schema_type?: string | null;
  schema_json?: Json | null;
}

export interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  location: string;
  service: string;
  image_url: string | null;
}

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id, slug, title_ar, title_en, icon_name, short_description, hero_description, benefits, process_steps, faqs, body, display_order, is_published")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ServiceRow[];
});

export const getService = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: service, error } = await supabaseAdmin
      .from("services")
      .select("id, slug, title_ar, title_en, icon_name, short_description, hero_description, benefits, process_steps, faqs, body, display_order, is_published, meta_title, meta_description, keywords, og_image, og_title, og_description, canonical_url, noindex, nofollow, schema_type, schema_json")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!service) return null;
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("id, title, description, location, service, image_url")
      .eq("is_published", true)
      .eq("service", (service as { title_ar: string }).title_ar)
      .limit(6);
    return {
      service: service as unknown as ServiceRow,
      projects: (projects ?? []) as unknown as ProjectRow[],
    };
  });

export const getCity = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: city, error } = await supabaseAdmin
      .from("cities")
      .select("id, slug, name_ar, name_en, hero_title, hero_description, compliance_info, faqs, image_url, body, is_published, meta_title, meta_description, keywords, og_image, og_title, og_description, canonical_url, noindex, nofollow, schema_type, schema_json")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!city) return null;
    const services = await (async () => {
      const { data: rows } = await supabaseAdmin
        .from("services")
        .select("id, slug, title_ar, icon_name, short_description, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });
      return rows ?? [];
    })();
    return {
      city: city as unknown as CityRow,
      services: services as unknown as Pick<ServiceRow, "id" | "slug" | "title_ar" | "icon_name" | "short_description" | "display_order">[],
    };
  });