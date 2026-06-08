import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Settings = Record<string, string>;

export function TrackingScripts() {
  const { data } = useQuery({
    queryKey: ["site_settings_tracking"],
    queryFn: async (): Promise<Settings> => {
      const { data } = await supabase.from("site_settings").select("key,value");
      const map: Settings = {};
      (data ?? []).forEach((r: { key: string; value: string | null }) => {
        map[r.key] = r.value ?? "";
      });
      return map;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data || typeof document === "undefined") return;
    const added: HTMLElement[] = [];

    const addScript = (id: string, attrs: Record<string, string>, body?: string) => {
      if (document.getElementById(id)) return;
      const s = document.createElement("script");
      s.id = id;
      Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
      if (body) s.text = body;
      document.head.appendChild(s);
      added.push(s);
    };

    const addMeta = (id: string, name: string, content: string) => {
      if (document.getElementById(id)) return;
      const m = document.createElement("meta");
      m.id = id;
      m.setAttribute("name", name);
      m.setAttribute("content", content);
      document.head.appendChild(m);
      added.push(m);
    };

    // GA4
    if (data.ga4_measurement_id) {
      const id = data.ga4_measurement_id.trim();
      addScript("ga4-loader", { async: "", src: `https://www.googletagmanager.com/gtag/js?id=${id}` });
      addScript("ga4-init", {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`);
    }

    // GTM
    if (data.gtm_container_id) {
      const id = data.gtm_container_id.trim();
      addScript("gtm-init", {}, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`);
    }

    // Microsoft Clarity
    if (data.clarity_project_id) {
      const id = data.clarity_project_id.trim();
      addScript("clarity-init", {}, `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${id}");`);
    }

    // Google Search Console verification
    if (data.gsc_verification) {
      const v = data.gsc_verification.trim().replace(/^.*content=["']?/, "").replace(/["'].*$/, "");
      addMeta("gsc-verification", "google-site-verification", v);
    }

    // Custom head HTML
    if (data.head_custom_code) {
      const wrap = document.createElement("div");
      wrap.id = "custom-head-code";
      wrap.style.display = "none";
      wrap.innerHTML = data.head_custom_code;
      Array.from(wrap.querySelectorAll("script")).forEach((old) => {
        const s = document.createElement("script");
        for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
        s.text = old.text;
        document.head.appendChild(s);
        added.push(s);
      });
      Array.from(wrap.querySelectorAll("meta,link,noscript")).forEach((el) => {
        document.head.appendChild(el);
        added.push(el as HTMLElement);
      });
    }

    // Custom body HTML
    if (data.body_custom_code) {
      const wrap = document.createElement("div");
      wrap.id = "custom-body-code";
      wrap.innerHTML = data.body_custom_code;
      Array.from(wrap.querySelectorAll("script")).forEach((old) => {
        const s = document.createElement("script");
        for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
        s.text = old.text;
        document.body.appendChild(s);
        added.push(s);
      });
      Array.from(wrap.querySelectorAll("noscript,iframe")).forEach((el) => {
        document.body.appendChild(el);
        added.push(el as HTMLElement);
      });
    }

    return () => {
      added.forEach((el) => el.remove());
    };
  }, [data]);

  return null;
}