import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 250, suffix: "+", label: "مشروع منجز" },
  { value: 15, suffix: "+", label: "سنة خبرة" },
  { value: 50, suffix: "+", label: "دراسة مرورية" },
  { value: 13, suffix: "", label: "مدينة" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1800;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section dir="rtl" className="relative bg-[var(--color-primary)] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span className="text-xs font-medium tracking-wide text-white/85">أرقامنا</span>
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            إنجازات تتحدث عن <span className="text-[var(--color-accent)]">جودتنا</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-3xl overflow-hidden border border-white/10">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="bg-[var(--color-primary)] p-8 md:p-10 transition-colors hover:bg-white/[0.03] group"
            >
              <div className="text-5xl md:text-6xl font-extrabold text-white leading-none">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 h-px w-10 bg-[var(--color-accent)] transition-all group-hover:w-20" />
              <p className="mt-4 text-sm md:text-base text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
