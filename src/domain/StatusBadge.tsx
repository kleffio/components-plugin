import type { GameServerStatus } from "./types";

interface StatusBadgeProps {
  status: GameServerStatus;
  showDot?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<GameServerStatus, { label: string; dot: string; badge: string }> = {
  running: { label: "Running", dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]", badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" },
  stopped: { label: "Stopped", dot: "bg-white/[0.35]", badge: "bg-white/[0.08] text-white/[0.55] ring-white/10" },
  starting: { label: "Starting", dot: "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,181,23,0.7)]", badge: "bg-amber-400/10 text-amber-400 ring-amber-400/20" },
  stopping: { label: "Stopping", dot: "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,181,23,0.7)]", badge: "bg-amber-400/10 text-amber-400 ring-amber-400/20" },
  restarting: { label: "Restarting", dot: "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.7)]", badge: "bg-blue-400/10 text-blue-400 ring-blue-400/20" },
  provisioning: { label: "Provisioning", dot: "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.7)]", badge: "bg-blue-400/10 text-blue-400 ring-blue-400/20" },
  crashed: { label: "Crashed", dot: "bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.7)]", badge: "bg-red-500/10 text-red-400 ring-red-500/20" },
  error: { label: "Error", dot: "bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.7)]", badge: "bg-red-500/10 text-red-400 ring-red-500/20" },
};

export function StatusBadge({ status, showDot = true, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset shadow-[0_0_12px_rgba(255,255,255,0.03)] ${config.badge} ${className}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}
