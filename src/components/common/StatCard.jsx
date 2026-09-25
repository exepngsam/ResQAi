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
    critical: "border-red-500/30 bg-red-500/[0.03]",
    warning: "border-orange-500/30 bg-orange-500/[0.03]",
    moderate: "border-amber-500/30 bg-amber-500/[0.03]",
    safe: "border-emerald-500/30 bg-emerald-500/[0.03]",
    intel: "border-white/20 bg-white/[0.02]"
  };

  const iconStyles = {
    default: "text-secondary bg-white/[0.04] border border-white/10",
    critical: "text-red-400 bg-red-500/10 border border-red-500/20",
    warning: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
    moderate: "text-amber-400 bg-amber-500/10 border border-amber-500/20",
    safe: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    intel: "text-white bg-white/10 border border-white/20"
  };

  return (
    <div
      className={`liquid-glass p-3.5 md:p-4 rounded-xl border transition-all duration-300 hover:translate-y-[-1px] ${
        variantBorder[variant] || variantBorder.default
      } flex items-center justify-between gap-3 ${className}`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-muted font-medium truncate">
          {label}
        </div>
        <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white mt-0.5 truncate">
          {value}
        </div>
        {(sublabel || trend) && (
          <div className="text-[10px] md:text-[11px] text-secondary font-mono mt-0.5 flex items-center gap-1.5 truncate">
            {sublabel}
            {trend && <span className="text-emerald-400 font-semibold">{trend}</span>}
          </div>
        )}
      </div>

      {Icon && (
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
            iconStyles[variant] || iconStyles.default
          }`}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      )}
    </div>
  );
};

export { StatCard };
