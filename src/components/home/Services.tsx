import {
  BarChart3,
  ShieldCheck,
  Activity,
  Gauge,
  ParkingSquare,
  Bike,
  TrafficCone,
  ClipboardList,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
  featured?: boolean;
  slug: string;
}

const SERVICES: Service[] = [
  {
    icon: BarChart3,
    title: "دراسة التأثير المروري TIA",
    description: "تقييم شامل لتأثير المشاريع الجديدة على الشبكة المرورية المحيطة ووضع الحلول.",
    className: "md:col-span-2 md:row-span-2",
    featured: true,
    slug: "traffic-impact-assessment",
  },
  {
    icon: ShieldCheck,
    title: "دراسات السلامة المرورية",
    description: "تحليل النقاط الخطرة واقتراح تحسينات لرفع مستوى الأمان.",
    className: "md:col-span-2",
    slug: "traffic-safety",
  },
  {
    icon: Activity,
    title: "تحليل حجم الحركة المرورية",
    description: "قياس وتحليل دقيق لأحجام المرور في الفترات المختلفة.",
    className: "",
    slug: "traffic-volume-analysis",
  },
  {
    icon: Gauge,
    title: "دراسات السرعة",
    description: "رصد سرعات التشغيل واقتراح الحدود المناسبة.",
    className: "",
    slug: "speed-studies",
  },
  {
    icon: ParkingSquare,
    title: "دراسات مواقف السيارات",
    description: "تحليل الطلب على المواقف وتصميم حلول مستدامة.",
    className: "md:col-span-2",
    slug: "parking-studies",
  },
  {
    icon: Bike,
    title: "دراسات المشاة والدراجات",
    description: "تصميم بيئات آمنة وودودة للمشاة وراكبي الدراجات.",
    className: "",
    slug: "pedestrian-bike-studies",
  },
  {
    icon: TrafficCone,
    title: "تصميم التقاطعات والإشارات",
    description: "تصميم هندسي وإشارات ضوئية بأحدث المعايير.",
    className: "",
    slug: "intersection-signal-design",
  },
  {
    icon: ClipboardList,
    title: "خطط إدارة المرور TMP",
    description: "خطط متكاملة لإدارة المرور أثناء تنفيذ المشاريع والفعاليات.",
    className: "md:col-span-2",
    slug: "traffic-management-plans",
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const featured = service.featured;
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-7 md:p-8 transition-all duration-500 hover:-translate-y-1 ${
        featured
          ? "bg-[var(--color-primary)] border-white/10 text-white"
          : "bg-white border-[oklch(0.929_0.013_255.508)] hover:border-[var(--color-secondary)]/30 hover:shadow-[0_25px_60px_-25px_rgba(6,43,82,0.25)]"
      } ${service.className}`}
    >
      {/* Decorative gradient */}
      {featured && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div
            className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
          />
        </>
      )}
      {!featured && (
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
        />
      )}

      <div className="relative flex h-full flex-col">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 ${
            featured
              ? "bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30"
              : "bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]/10 group-hover:bg-[var(--color-accent)]/20 group-hover:ring-[var(--color-accent)]/40"
          }`}
        >
          <Icon
            className={featured ? "h-5 w-5 text-[var(--color-accent)]" : "h-5 w-5 text-[var(--color-primary)]"}
            strokeWidth={2}
          />
        </div>

        <h3
          className={`mt-6 font-bold leading-snug ${
            featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl text-[var(--color-primary)]"
          }`}
        >
          {service.title}
        </h3>

        <p
          className={`mt-3 text-sm leading-relaxed ${
            featured ? "text-white/75 max-w-md" : "text-[oklch(0.45_0.02_247)]"
          } flex-1`}
        >
          {service.description}
        </p>

        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
            featured
              ? "text-[var(--color-accent)] hover:text-white"
              : "text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          }`}
        >
          اقرأ المزيد
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
        </Link>
      </div>
    </article>
  );
}

export function Services() {
  return (
    <section dir="rtl" id="services" className="relative bg-[var(--color-muted)] py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/15 bg-white px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-secondary)]" />
              <span className="text-xs font-medium tracking-wide text-[var(--color-primary)]">
                خدماتنا
              </span>
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] leading-tight">
              حلول هندسية متكاملة <br className="hidden md:block" />
              <span className="text-[var(--color-secondary)]">لكل تحدٍ مروري</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-[oklch(0.45_0.02_247)]">
            باقة شاملة من الدراسات والاستشارات التي يقدمها فريق من المهندسين المعتمدين وفق أحدث المعايير الدولية.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[minmax(220px,auto)] gap-5">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
