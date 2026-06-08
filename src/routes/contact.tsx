import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Mail, Phone, MapPin } from "lucide-react";
import { useQuote } from "@/components/quote/QuoteContext";
import { absUrl, hreflangLinks, breadcrumbJsonLd } from "@/lib/seo";
import { useContactSettings } from "@/hooks/useContactSettings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | ارت ترافيك" },
      { name: "description", content: "تواصل مع فريق ارت ترافيك للاستفسارات والعروض." },
      { property: "og:title", content: "تواصل معنا | ارت ترافيك" },
      { property: "og:description", content: "تواصل مع فريق ارت ترافيك للاستفسارات والعروض." },
      { property: "og:url", content: absUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absUrl("/contact") }, ...hreflangLinks("/contact")],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify(breadcrumbJsonLd([
        { name: "الرئيسية", path: "/" },
        { name: "تواصل معنا", path: "/contact" },
      ])),
    }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, dir } = useI18n();
  const quote = useQuote();
  const { phone, email } = useContactSettings();
  return (
    <main dir={dir} className="bg-background">
      <section className="bg-gradient-to-bl from-primary to-secondary text-primary-foreground">
        <div className="max-w-[1320px] mx-auto px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("page.contact.title")}</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">{t("page.contact.intro")}</p>
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-3 gap-6">
          <article className="bg-card border border-border rounded-2xl p-7">
            <Mail className="w-7 h-7 text-secondary mb-4" />
            <h2 className="font-bold text-primary mb-1">{t("page.contact.email")}</h2>
            <p className="text-muted-foreground" dir="ltr">{email}</p>
          </article>
          <article className="bg-card border border-border rounded-2xl p-7">
            <Phone className="w-7 h-7 text-secondary mb-4" />
            <h2 className="font-bold text-primary mb-1">{t("page.contact.phone")}</h2>
            <p className="text-muted-foreground" dir="ltr">{phone}</p>
          </article>
          <article className="bg-card border border-border rounded-2xl p-7">
            <MapPin className="w-7 h-7 text-secondary mb-4" />
            <h2 className="font-bold text-primary mb-1">{t("page.contact.address")}</h2>
            <p className="text-muted-foreground">{t("page.contact.address.value")}</p>
          </article>
        </div>
        <div className="max-w-[1320px] mx-auto px-6 mt-12">
          <button onClick={quote.open} className="px-7 py-3.5 rounded-full bg-[var(--color-accent)] text-primary font-bold hover:scale-[1.02] transition">
            {t("nav.quote")}
          </button>
        </div>
      </section>
    </main>
  );
}