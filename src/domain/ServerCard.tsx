import type { GameServer } from "./types";
import { REGION_LABELS } from "./types";
import { StatusBadge } from "./StatusBadge";
import { PlanBadge } from "./PlanBadge";

interface ServerCardProps {
  server: GameServer;
  onStart?: (id: string) => void;
  onStop?: (id: string) => void;
  onSelect?: (server: GameServer) => void;
  frosted?: boolean;
  focus?: boolean;
  spotlight?: boolean;
  className?: string;
}

function ResourceBar({ label, percent }: { label: string; percent: number }) {
  const color = percent >= 90 ? "bg-red-500" : percent >= 70 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-white/40">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full border border-white/[0.06] bg-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
        <div className={`h-full rounded-full shadow-[0_0_14px_rgba(255,255,255,0.16)] transition-all ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  );
}

export function ServerCard({ server, onStart, onStop, onSelect, frosted = true, focus = false, spotlight = false, className = "" }: ServerCardProps) {
  const isRunning = server.status === "running";
  const isTransitioning = ["starting", "stopping", "restarting", "provisioning"].includes(server.status);

  return (
    <div
      data-frosted={frosted ? "true" : "false"}
      data-focus={focus ? "true" : "false"}
      data-spotlight={spotlight ? "true" : "false"}
      className={`overview-glass-card p-6 flex flex-col gap-4 ${onSelect ? "cursor-pointer" : ""} ${className}`}
      onClick={() => onSelect?.(server)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-white truncate">{server.name}</span>
          <span className="text-xs text-white/40">{server.gameType}</span>
        </div>
        <StatusBadge status={server.status} />
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-white/[0.55]">
        <span>{REGION_LABELS[server.region] ?? server.region}</span>
        <span className="text-white/20">·</span>
        <span>{server.currentPlayers} / {server.plan.maxPlayers} players</span>
        {server.ipAddress && (
          <>
            <span className="text-white/20">·</span>
            <span className="font-mono">{server.ipAddress}:{server.port ?? "—"}</span>
          </>
        )}
      </div>

      {server.resources && (
        <div className="flex flex-col gap-2">
          <ResourceBar label="CPU" percent={server.resources.cpuPercent} />
          <ResourceBar label="Memory" percent={server.resources.memoryPercent} />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
        <PlanBadge tier={server.plan.tier} />
        <div className="flex items-center gap-2">
          {isRunning && onStop && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onStop(server.id); }}
              disabled={isTransitioning}
              className="glass-surface rounded-md px-2.5 py-1 text-xs font-medium text-white/75 hover:bg-white/[0.07] hover:text-white disabled:opacity-40 transition-colors"
            >
              Stop
            </button>
          )}
          {!isRunning && onStart && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onStart(server.id); }}
              disabled={isTransitioning}
              className="rounded-md border border-primary/70 bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-[0_0_16px_rgba(245,181,23,0.28)] hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
