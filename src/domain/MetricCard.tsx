import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  delta?: { value: string; direction: "up" | "down" | "neutral" };
  frosted?: boolean;
  focus?: boolean;
  spotlight?: boolean;
  className?: string;
}

const DELTA_STYLES = { up: "text-emerald-400", down: "text-red-400", neutral: "text-white/[0.45]" };
const DELTA_ARROWS = { up: "↑", down: "↓", neutral: "→" };

export function MetricCard({ label, value, icon, delta, frosted = true, focus = false, spotlight = false, className = "" }: MetricCardProps) {
  return (
    <div data-frosted={frosted ? "true" : "false"} data-focus={focus ? "true" : "false"} data-spotlight={spotlight ? "true" : "false"} className={`overview-glass-card p-6 flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">{label}</span>
        {icon && (
          <span className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            {icon}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <span className="block text-3xl font-semibold tracking-tight text-white drop-shadow-md tabular-nums">{value}</span>
        {delta && (
          <span className={`flex items-center gap-1.5 text-xs font-medium text-white/50 ${DELTA_STYLES[delta.direction]}`}>
            {DELTA_ARROWS[delta.direction]} {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}
