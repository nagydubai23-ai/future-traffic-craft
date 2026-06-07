# Art Traffic — Hero Section Plan

Building the foundational setup plus a premium, full-screen RTL hero for **ارت ترافيك**, a Saudi traffic engineering consultancy.

## 1. Global Foundation

**Fonts (loaded via `<link>` in `src/routes/__root.tsx`):**
- Arabic: Tajawal (400, 500, 700, 800)
- English headings: Syne (600, 700, 800)
- English body: DM Sans (400, 500)

**Direction:** `<html lang="ar" dir="rtl">` in root shell.

**Design tokens in `src/styles.css` (`@theme` + `:root`, oklch values):**
- `--color-primary` Deep Navy `#062B52`
- `--color-secondary` Engineering Blue `#1677C8`
- `--color-accent` Lime Green `#C8F135`
- `--color-background` White, `--color-muted` Soft Gray `#F5F7FA`
- `--color-foreground` `#111111`
- Font tokens: `--font-arabic`, `--font-display`, `--font-body`
- Gradient + glass tokens: `--gradient-hero`, `--shadow-glass`

Body defaults to Tajawal when `dir="rtl"`.

## 2. Hero Section (`src/components/hero/Hero.tsx`, used by `src/routes/index.tsx`)

**Layout:** Full-screen (`min-h-screen`), generous padding, max-width 1320px container, RTL-aware (content aligned to the right in RTL).

**Background stack (z-ordered):**
1. High-quality smart highway / intersection image (generated to `src/assets/hero-traffic.jpg`, 1920×1080, premium quality)
2. Deep Navy gradient overlay: `linear-gradient(120deg, rgba(6,43,82,0.95) 0%, rgba(6,43,82,0.78) 55%, rgba(22,119,200,0.55) 100%)`
3. Subtle SVG grid pattern (1px lines, 4% opacity white)
4. Soft accent glow blob (lime/blue) blurred in corner

**Content (right side in RTL, ~60% width on desktop):**
- Small eyepiece tag with lime dot: "استشارات هندسة المرور"
- H1 Arabic: **حلول مرورية ذكية لمدن المستقبل** — Tajawal 800, ~clamp(2.75rem, 6vw, 5.25rem), tight leading, white with one word ("ذكية") in lime accent
- Paragraph: the provided description, Tajawal 400, muted white, max-w-xl
- CTA row:
  - Primary: **اطلب دراسة مرورية** — solid lime on navy text, arrow icon
  - Secondary: **استكشف خدماتنا** — glass outline, white text
- Trust strip below: small stats (years / projects / cities) separated by dividers

**Floating glass-morphism cards (left side, absolutely positioned, staggered):**
Each card: `backdrop-blur-xl`, `bg-white/8`, `border border-white/15`, rounded-2xl, soft shadow, small icon in lime-tinted square, title + one-line caption, subtle hover lift.
1. **Traffic Impact Assessment** — top, icon: bar chart
2. **Traffic Safety** — middle, icon: shield
3. **Smart Mobility** — bottom, icon: cpu/route

Cards animate in with a gentle float (CSS `@keyframes` translateY loop, different delays) — Webflow-style restraint, not flashy.

**Scroll indicator:** thin lime line + small Arabic "اسحب للأسفل" at bottom center.

## 3. Files Touched

- `src/styles.css` — tokens, fonts, gradient, glass utility, grid pattern, keyframes
- `src/routes/__root.tsx` — `<html dir="rtl" lang="ar">`, Google Fonts links, updated title/meta to Art Traffic
- `src/routes/index.tsx` — render `<Hero />`, SEO meta in Arabic
- `src/components/hero/Hero.tsx` — section markup
- `src/components/hero/FloatingCard.tsx` — reusable glass card
- `src/assets/hero-traffic.jpg` — generated background (premium model for fidelity)

## Technical Notes

- Tailwind v4: all tokens via `@theme` in `src/styles.css`, no `tailwind.config.js`.
- Fonts loaded via `<link>` only — never `@import` URL.
- RTL is the default; English fonts are registered for later bilingual pages but the hero ships Arabic.
- Background image: generated with the `standard` tier to keep it crisp without text artifacts.
- No external icon libraries beyond `lucide-react` (already present).
