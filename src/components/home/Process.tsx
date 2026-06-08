const STEPS = [
  { n: "01", title: "تواصل وتحديد النطاق", desc: "نستلم تفاصيل مشروعك ونحدد نوع الدراسة المطلوبة خلال 24 ساعة." },
  { n: "02", title: "عرض فني ومالي", desc: "عرض مفصّل بالنطاق والجدول الزمني والسعر بدون التزام." },
  { n: "03", title: "جمع البيانات والتحليل", desc: "عدّات ميدانية ونمذجة باستخدام Synchro / VISSIM / Sidra." },
  { n: "04", title: "تسليم واعتماد", desc: "تقرير جاهز للاعتماد مع المتابعة حتى موافقة الجهة المختصة." },
];

export function Process() {
  return (
    <section dir="rtl" className="bg-[var(--color-muted)] py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/15 bg-white px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-secondary)]" />
            <span className="text-xs font-medium tracking-wide text-[var(--color-primary)]">خطوات العمل</span>
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
            من الفكرة إلى <span className="text-[var(--color-secondary)]">الاعتماد</span> في 4 خطوات
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl bg-white p-7 border border-[oklch(0.929_0.013_255.508)] hover:border-[var(--color-secondary)]/30 transition-all hover:-translate-y-1"
            >
              <span className="text-5xl font-extrabold text-[var(--color-accent)] leading-none">{s.n}</span>
              <h3 className="mt-5 text-lg font-bold text-[var(--color-primary)]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[oklch(0.45_0.02_247)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}