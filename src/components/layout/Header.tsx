import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useQuote } from "@/components/quote/QuoteContext";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { t, lang, toggle, dir } = useI18n();
  const quote = useQuote();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/services", label: t("nav.services") },
    { to: "/projects", label: t("nav.projects") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header dir={dir} className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">A</span>
          <span className="font-bold text-primary text-lg leading-none">{t("brand.name")}</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-muted transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{t("lang.switch")}</span>
          </button>
          <button
            onClick={quote.open}
            className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-accent)] text-primary font-bold text-sm hover:scale-[1.02] transition"
          >
            {t("nav.quote")}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-md text-primary"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="lg:hidden border-t border-border bg-background">
          <div className="px-6 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => { toggle(); setOpen(false); }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-muted self-start"
            >
              <Globe className="w-4 h-4" /> {lang === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}