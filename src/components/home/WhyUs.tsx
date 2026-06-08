import { Award, Clock4, Users, FileCheck2, Building2, HeadphonesIcon } from "lucide-react";

const ITEMS = [
  { icon: Award, title: "اعتماد رسمي", desc: "دراسات مطابقة لاشتراطات الأمانات والبلديات وهيئة الطرق السعودية." },
  { icon: Clock4, title: "تسليم في الموعد", desc: "جدول زمني واضح والتزام صارم بمواعيد التسليم." },
  { icon: Users, title: "فريق مهندسين معتمدين", desc: "خبرات في النمذجة بـ Synchro و VISSIM و Sidra." },
  { icon: FileCheck2, title: "تقارير جاهزة للاعتماد", desc: "صياغة هندسية احترافية تختصر دورات المراجعة." },
  { icon: Building2, title: "خبرة ميدانية واسعة", desc: "+150 مشروع منجز في أبرز مدن المملكة." },
  { icon: HeadphonesIcon, title: "دعم بعد التسليم", desc: "نرافقك حتى اعتماد الدراسة من الجهة المختصة." },
];

export function WhyUs() {
  return (
    <section dir="rtl" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/15 bg-[var(--color-muted)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-secondary)]" />
            <span className="text-xs font-medium tracking-wide text-[var(--color-primary)]">لماذا ارت ترافيك</span>
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
            شريكك الموثوق في <span className="text-[var(--color-secondary)]">الدراسات المرورية</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-[oklch(0.45_0.02_247)] leading-loose">
            نمنح مشروعك ميزة هندسية تختصر الوقت وتضمن اعتماد الدراسة من أول مراجعة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-[oklch(0.929_0.013_255.508)] bg-white p-7 transition-all hover:-translate-y-1 hover:border-[var(--color-secondary)]/30 hover:shadow-[0_25px_60px_-25px_rgba(6,43,82,0.18)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]/10 transition-all group-hover:bg-[var(--color-accent)]/20 group-hover:ring-[var(--color-accent)]/40">
                <Icon className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[var(--color-primary)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[oklch(0.45_0.02_247)]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}