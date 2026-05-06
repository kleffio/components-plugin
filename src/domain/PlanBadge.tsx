import type { GameServerPlanTier } from "./types";

interface PlanBadgeProps {
  tier: GameServerPlanTier;
  className?: string;
}

const PLAN_CONFIG: Record<GameServerPlanTier, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-white/[0.08] text-white/[0.55] ring-white/10" },
  starter: { label: "Starter", className: "bg-blue-500/10 text-blue-400 ring-blue-500/20" },
  pro: { label: "Pro", className: "bg-primary/[0.15] text-primary ring-primary/25 shadow-[0_0_12px_rgba(245,181,23,0.14)]" },
  business: { label: "Business", className: "bg-purple-500/10 text-purple-400 ring-purple-500/20" },
  enterprise: { label: "Enterprise", className: "bg-gradient-to-r from-primary/[0.15] to-purple-500/10 text-primary ring-primary/25 shadow-[0_0_12px_rgba(245,181,23,0.14)]" },
};

export function PlanBadge({ tier, className = "" }: PlanBadgeProps) {
  const config = PLAN_CONFIG[tier];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
