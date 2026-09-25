import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

const Badge = ({ level = "INFO", size = "sm", className = "" }) => {
  const norm = String(level).toUpperCase();
  let styles = "bg-white/[0.04] text-secondary border-white/10";
  let Icon = Info;
  let dotColor = "bg-slate-400";

  if (norm === "CRITICAL" || norm === "P1") {
    styles = "bg-red-500/10 text-red-400 border-red-500/30";
    Icon = AlertCircle;
    dotColor = "bg-red-500";
  } else if (norm === "HIGH" || norm === "P2") {
    styles = "bg-orange-500/10 text-orange-400 border-orange-500/30";
    Icon = AlertTriangle;
    dotColor = "bg-orange-500";
  } else if (norm === "MODERATE" || norm === "P3") {
    styles = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    Icon = AlertTriangle;
    dotColor = "bg-amber-400";
  } else if (norm === "LOW" || norm === "SAFE" || norm === "P4") {
    styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    Icon = CheckCircle;
    dotColor = "bg-emerald-400";
  }

  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md border tracking-wider ${styles} ${padding} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <Icon className="w-3 h-3 shrink-0" />
      <span>{level}</span>
    </span>
  );
};

export { Badge };
