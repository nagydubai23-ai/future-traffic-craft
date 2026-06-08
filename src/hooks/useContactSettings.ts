import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const KEYS = ["contact_phone", "contact_whatsapp", "contact_email"] as const;

export type ContactSettings = {
  phone: string;
  whatsapp: string;
  email: string;
};

export const DEFAULT_CONTACT: ContactSettings = {
  phone: "+966 50 000 0000",
  whatsapp: "966500000000",
  email: "info@art-traffic.sa",
};

export function sanitizeWhatsapp(v: string) {
  return (v || "").replace(/[^\d]/g, "");
}

export function telHref(phone: string) {
  const digits = (phone || "").replace(/[^\d+]/g, "");
  return `tel:${digits || "+966500000000"}`;
}

export function waHref(whatsapp: string, message?: string) {
  const num = sanitizeWhatsapp(whatsapp) || DEFAULT_CONTACT.whatsapp;
  const msg = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${msg}`;
}

export function useContactSettings(): ContactSettings {
  const { data } = useQuery({
    queryKey: ["contact_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", KEYS as unknown as string[]);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((r) => (map[r.key] = r.value ?? ""));
      return map;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    phone: data?.contact_phone || DEFAULT_CONTACT.phone,
    whatsapp: sanitizeWhatsapp(data?.contact_whatsapp || "") || DEFAULT_CONTACT.whatsapp,
    email: data?.contact_email || DEFAULT_CONTACT.email,
  };
}