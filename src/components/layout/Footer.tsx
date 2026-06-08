import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Mail, Phone, MapPin } from "lucide-react";
import { useContactSettings } from "@/hooks/useContactSettings";

export function Footer() {
  const { t, dir, lang } = useI18n();
  const { phone, email } = useContactSettings();
  const year = new Date().getFullYear();
  return (
    <footer dir={dir} className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-[1320px] mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-xl bg-[var(--color-accent)] text-primary grid place-items-center font-bold">A</span>
            <div>
              <p className="font-bold text-lg leading-none">{t("brand.name")}</p>
              <p className="text-xs text-white/70 mt-1">{t("brand.tag")}</p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            {lang === "ar"
              ? "حلول هندسية مرورية متقدمة لمدن المملكة العربية السعودية."
              : "Advanced traffic engineering solutions for cities across Saudi Arabia."}
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-[var(--color-accent)]">{t("footer.company")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/about" className="hover:text-white">{t("nav.about")}</Link></li>
            <li><Link to="/projects" className="hover:text-white">{t("nav.projects")}</Link></li>
            <li><Link to="/blog" className="hover:text-white">{t("nav.blog")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-[var(--color-accent)]">{t("footer.explore")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/services" className="hover:text-white">{t("nav.services")}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 text-[var(--color-accent)]">{t("footer.contact")}</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> <span dir="ltr">{email}</span></li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> <span dir="ltr">{phone}</span></li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t("page.contact.address.value")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 py-5 text-xs text-white/60 flex justify-between">
          <span>© {year} {t("brand.name")} — {t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  );
}