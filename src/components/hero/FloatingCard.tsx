import { type LucideIcon } from "lucide-react";

interface FloatingCardProps {
  icon: LucideIcon;
  title: string;
  caption: string;
  className?: string;
  delay?: string;
}

export function FloatingCard({ icon: Icon, title, caption, className = "", delay = "0s" }: FloatingCardProps) {
  return (
    <div
      className={`glass-card animate-float-soft rounded-2xl p-5 w-64 transition-transform duration-500 hover:-translate-y-1 ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 ring-1 ring-[var(--color-accent)]/30">
          <Icon className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white leading-tight">{title}</h3>
          <p className="mt-0.5 text-xs text-white/60 leading-snug truncate">{caption}</p>
        </div>
      </div>
    </div>
  );
}
