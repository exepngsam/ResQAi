const StatCard = ({
  label,
  value,
  sublabel,
  icon: Icon,
  variant = "default",
  trend,
  className = ""
}) => {
  const variantBorder = {
    default: "border-white/[0.08] hover:border-white/20",
    critical: "border-red-500/30 bg-red-500/[0.03] hover:border-red-500/50",
    warning: "border-orange-500/30 bg-orange-500/[0.03] hover:border-orange-500/50",
    moderate: "border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-500/50",
    safe: "border-emerald-500/30 bg-emerald-500/[0.03] hover:border-emerald-500/50",
    intel: "border-cyan-500/30 bg-cyan-500/[0.03] hover:border-cyan-500/50"
  };

  const iconStyles = {
    default: "text-secondary bg-white/[0.04] border border-white/10",
    critical: "text-red-400 bg-red-500/10 border border-red-500/30",
    warning: "text-orange-400 bg-orange-500/10 border border-orange-500/30",
    moderate: "text-amber-400 bg-amber-500/10 border border-amber-500/30",
    safe: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30",
    intel: "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
  };

  return (
    <div
      className={`liquid-glass p-3 sm:p-3.5 rounded-xl border transition-all duration-200 hover:translate-y-[-1px] ${
        variantBorder[variant] || variantBorder.default
      } flex flex-col justify-between gap-1.5 ${className}`}
    >
      {/* Top row: Label & Mini Icon */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted font-medium truncate">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center shrink-0 transition-transform ${
              iconStyles[variant] || iconStyles.default
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Middle: Value (Full Width, No Truncation) */}
      <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white leading-none my-0.5">
        {value}
      </div>

      {/* Bottom: Sublabel or Trend */}
      {(sublabel || trend) && (
        <div className="text-[10px] text-secondary font-mono flex items-center gap-1.5 truncate">
          <span className="truncate">{sublabel}</span>
          {trend && <span className="text-emerald-400 font-semibold shrink-0">{trend}</span>}
        </div>
      )}
    </div>
  );
};

export { StatCard };
