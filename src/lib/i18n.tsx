import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
const STORAGE_KEY = "art-traffic-lang";

type Dict = Record<string, { ar: string; en: string }>;

export const DICT = {
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "من نحن", en: "About" },
  "nav.services": { ar: "الخدمات", en: "Services" },
  "nav.projects": { ar: "المشاريع", en: "Projects" },
  "nav.blog": { ar: "المدونة", en: "Blog" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },
  "nav.quote": { ar: "اطلب دراسة", en: "Request a Study" },
  "lang.switch": { ar: "EN", en: "عربي" },
  "brand.name": { ar: "ارت ترافيك", en: "Art Traffic" },
  "brand.tag": { ar: "استشارات هندسة المرور", en: "Traffic Engineering Consultancy" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  "footer.company": { ar: "الشركة", en: "Company" },
  "footer.explore": { ar: "استكشف", en: "Explore" },
  "footer.contact": { ar: "تواصل", en: "Contact" },
  "page.about.title": { ar: "من نحن", en: "About Us" },
  "page.about.intro": {
    ar: "ارت ترافيك بيت خبرة سعودي متخصص في استشارات هندسة المرور ودراسات النقل، نخدم القطاعين الحكومي والخاص بأعلى المعايير الدولية.",
    en: "Art Traffic is a Saudi consultancy specialized in traffic engineering and transport studies, serving public and private sectors with the highest international standards.",
  },
  "page.services.title": { ar: "خدماتنا", en: "Our Services" },
  "page.services.intro": {
    ar: "باقة شاملة من الدراسات والاستشارات الهندسية لكل تحدٍ مروري.",
    en: "A complete suite of engineering studies and consultancy for every traffic challenge.",
  },
  "page.projects.title": { ar: "المشاريع", en: "Our Projects" },
  "page.projects.intro": {
    ar: "أبرز مشاريعنا في مدن المملكة العربية السعودية.",
    en: "Highlighted projects across Saudi cities.",
  },
  "page.blog.title": { ar: "المدونة", en: "Insights & Blog" },
  "page.blog.intro": {
    ar: "أحدث المقالات والتحليلات في هندسة المرور والنقل الذكي.",
    en: "Latest articles and analyses in traffic engineering and smart mobility.",
  },
  "page.contact.title": { ar: "تواصل معنا", en: "Contact Us" },
  "page.contact.intro": {
    ar: "نسعد بالرد على استفساراتك خلال ساعات العمل الرسمية.",
    en: "We are happy to answer your inquiries during business hours.",
  },
  "page.contact.email": { ar: "البريد الإلكتروني", en: "Email" },
  "page.contact.phone": { ar: "الهاتف", en: "Phone" },
  "page.contact.address": { ar: "العنوان", en: "Address" },
  "page.contact.address.value": { ar: "الرياض، المملكة العربية السعودية", en: "Riyadh, Saudi Arabia" },
  "common.coming_soon": { ar: "محتوى قريباً — يُدار من لوحة التحكم.", en: "Content coming soon — managed from the dashboard." },
} satisfies Dict;

type Key = keyof typeof DICT;

interface I18nCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (k: Key) => string;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const Ctx = createContext<I18nCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (window.localStorage.getItem(STORAGE_KEY) as Lang | null) ?? "ar";
    setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    const font = lang === "ar" ? "var(--font-arabic)" : "var(--font-body)";
    document.body.style.fontFamily = font;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const value = useMemo<I18nCtx>(() => ({
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: (k) => DICT[k][lang],
    setLang,
    toggle: () => setLang(lang === "ar" ? "en" : "ar"),
  }), [lang, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used inside LanguageProvider");
  return c;
}