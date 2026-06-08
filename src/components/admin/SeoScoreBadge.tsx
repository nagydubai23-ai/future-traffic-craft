import { calcSeoScore, type SeoScoreInput } from "@/lib/seo-score";

export function SeoScoreBadge({ record, compact = false }: { record: SeoScoreInput; compact?: boolean }) {
  const { score, level, checks } = calcSeoScore(record);
  const color =
    level === "green"
      ? "bg-green-100 text-green-700 border-green-200"
      : level === "yellow"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-red-100 text-red-700 border-red-200";
  const label = level === "green" ? "ممتاز" : level === "yellow" ? "متوسط" : "ضعيف";

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${color}`} title={`${score}/100 — ${label}`}>
        SEO {score}
      </span>
    );
  }

  return (
    <div className={`rounded-lg border px-3 py-2 ${color}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">{score}</span>
          <span className="text-[10px] opacity-70">/100</span>
          <span className="text-xs font-semibold">{label}</span>
        </div>
        <span className="text-[10px] opacity-70">{checks.filter((c) => c.ok).length}/{checks.length} فحوصات</span>
      </div>
    </div>
  );
}