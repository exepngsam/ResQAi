import { Radio, Clock } from "lucide-react";

const CommandHeader = ({
  title,
  description,
  badge = "LIVE TELEMETRY",
  action,
  lastUpdated
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08] mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-white uppercase">
            {title}
          </h1>
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider bg-white/[0.04] text-white border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs md:text-sm text-secondary mt-1 font-normal max-w-2xl">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {lastUpdated && (
          <div className="hidden md:flex items-center gap-1 text-[11px] text-muted font-mono">
            <Clock className="w-3 h-3 text-secondary" />
            <span>Updated {lastUpdated}</span>
          </div>
        )}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export { CommandHeader };
