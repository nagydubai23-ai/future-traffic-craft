import {
  Activity,
  ShieldCheck,
  BarChart3,
  Gauge,
  ParkingCircle,
  Footprints,
  TrafficCone,
  ClipboardList,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Activity,
  ShieldCheck,
  BarChart3,
  Gauge,
  ParkingCircle,
  Footprints,
  TrafficCone,
  ClipboardList,
};

export function IconByName({ name, className }: { name: string | null; className?: string }) {
  const Icon = (name && MAP[name]) || Sparkles;
  return <Icon className={className} aria-hidden />;
}