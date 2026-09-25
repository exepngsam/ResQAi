import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'critical' | 'warning' | 'safe' | 'intel';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon: Icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-command-border text-slate-100 hover:border-slate-500',
    critical: 'border-red-500/40 bg-red-950/20 text-red-400 shadow-red-950/20',
    warning: 'border-amber-500/40 bg-amber-950/20 text-amber-400 shadow-amber-950/20',
    safe: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400 shadow-emerald-950/20',
    intel: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400 shadow-cyan-950/20',
  };

  const iconColors = {
    default: 'text-slate-400 bg-slate-800/60',
    critical: 'text-red-400 bg-red-900/40',
    warning: 'text-amber-400 bg-amber-900/40',
    safe: 'text-emerald-400 bg-emerald-900/40',
    intel: 'text-cyan-400 bg-cyan-900/40',
  };

  return (
    <div
      className={`p-4 rounded-xl bg-command-card border transition-all duration-200 shadow-lg ${variantStyles[variant]} flex items-center justify-between`}
    >
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
          {label}
        </div>
        <div className="text-2xl font-mono font-bold mt-1 tracking-tight text-white">
          {value}
        </div>
        {sublabel && (
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {sublabel}
          </div>
        )}
      </div>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconColors[variant]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
