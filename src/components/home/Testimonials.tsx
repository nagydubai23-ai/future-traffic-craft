import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "م. عبدالله الشهري",
    role: "مدير مشاريع — مجموعة عقارية",
    quote: "دراسة التأثير المروري كانت دقيقة جداً واعتمدت من الأمانة من أول مراجعة. وفروا علينا أسابيع من التعديلات.",
  },
  {
    name: "م. سارة العتيبي",
    role: "استشاري تخطيط — جدة",
    quote: "احترافية في التعامل، التزام بالمواعيد، وتقارير هندسية بجودة عالية. شريك موثوق لكل مشاريعنا.",
  },
  {
    name: "م. خالد القحطاني",
    role: "مالك مشروع تجاري — الرياض",
    quote: "خدمة سريعة وعرض سعر واضح خلال 24 ساعة. الفريق ساعدنا حتى الحصول على التصريح النهائي.",
  },
];

export function Testimonials() {
  return (
    <section dir="rtl" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/15 bg-[var(--color-muted)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-secondary)]" />
            <span className="text-xs font-medium tracking-wide text-[var(--color-primary)]">آراء عملائنا</span>
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
            ثقة <span className="text-[var(--color-secondary)]">مهندسين ومطورين</span> في المملكة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="relative rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-[var(--color-muted)] p-7 transition-all hover:-translate-y-1 hover:shadow-[0_25px_60px_-25px_rgba(6,43,82,0.18)]"
            >
              <Quote className="h-8 w-8 text-[var(--color-accent)]" />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                ))}
              </div>
              <p className="mt-4 text-[oklch(0.30_0.02_247)] leading-relaxed">{t.quote}</p>
              <div className="mt-6 pt-5 border-t border-[var(--color-primary)]/10">
                <p className="font-bold text-[var(--color-primary)]">{t.name}</p>
                <p className="text-sm text-[oklch(0.45_0.02_247)] mt-0.5">{t.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}