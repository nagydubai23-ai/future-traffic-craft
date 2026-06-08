import heroImage from "@/assets/hero-traffic.jpg";

/**
 * Unified hero background used across all pages.
 * Fixed image + navy gradient + grid pattern + accent glows.
 */
export function HeroBackground() {
  return (
    <>
      {/* Fixed background image (parallax-like) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed opacity-60"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Navy gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(6,43,82,0.96) 0%, rgba(6,43,82,0.82) 55%, rgba(22,119,200,0.5) 100%)",
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />

      {/* Accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-secondary), transparent 70%)",
        }}
      />
    </>
  );
}