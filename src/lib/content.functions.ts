import { createServerFn } from "@tanstack/react-start";

export interface FAQ { q: string; a: string }

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
      .select("id, slug, title_ar, title_en, icon_name, short_description, hero_description, benefits, process_steps, faqs, body, display_order, is_published")
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
      .select("id, slug, name_ar, name_en, hero_title, hero_description, compliance_info, faqs, image_url, body, is_published")
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