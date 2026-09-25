import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface BadgeProps {
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'SAFE' | 'P1' | 'P2' | 'P3' | 'P4' | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ level, size = 'sm' }) => {
  const norm = level.toUpperCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = Info;

  if (norm === 'CRITICAL' || norm === 'P1') {
    styles = 'bg-red-950/80 text-red-300 border-red-500/80';
    Icon = AlertCircle;
  } else if (norm === 'HIGH' || norm === 'P2') {
    styles = 'bg-amber-950/80 text-amber-300 border-amber-500/80';
    Icon = AlertTriangle;
  } else if (norm === 'MODERATE' || norm === 'P3') {
    styles = 'bg-yellow-950/80 text-yellow-300 border-yellow-500/80';
    Icon = AlertTriangle;
  } else if (norm === 'LOW' || norm === 'SAFE' || norm === 'P4') {
    styles = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80';
    Icon = CheckCircle;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-semibold rounded border uppercase tracking-wider ${styles} ${padding}`}
    >
      <Icon className="w-3 h-3" />
      <span>{level}</span>
    </span>
  );
};
