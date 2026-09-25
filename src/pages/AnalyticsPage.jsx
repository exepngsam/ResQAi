import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  PieChart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Users
} from "lucide-react";
import { CommandHeader } from "../components/common/CommandHeader";
import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";

const AnalyticsPage = ({ summary }) => {
  // Section 25 Metrics & Trends
  const progressionData = [
    { time: "06:00", stage: "0.8m", pop: "24K", pct: 25 },
    { time: "08:00", stage: "1.4m", pop: "52K", pct: 45 },
    { time: "10:00", stage: "2.1m", pop: "89K", pct: 68 },
    { time: "12:00", stage: "2.9m", pop: "126K", pct: 90 },
    { time: "14:00", stage: "3.1m", pop: "138K", pct: 100 }
  ];

  const zoneSeverity = [
    { zone: "Zone 7 (Erasama)", level: "CRITICAL", score: 87, victims: 14, color: "bg-red-500", textColor: "text-red-400" },
    { zone: "Zone 4 (Cuttack)", level: "HIGH", score: 74, victims: 28, color: "bg-orange-500", textColor: "text-orange-400" },
    { zone: "Zone 3 (Marsaghai)", level: "HIGH", score: 62, victims: 55, color: "bg-amber-500", textColor: "text-amber-400" },
    { zone: "Zone 1 (Kendrapara)", level: "HIGH", score: 58, victims: 42, color: "bg-yellow-500", textColor: "text-yellow-400" },
    { zone: "Zone 2 (Pattamundai)", level: "MODERATE", score: 45, victims: 18, color: "bg-emerald-500", textColor: "text-emerald-400" }
  ];

  return (
    <div className="space-y-6">
      <CommandHeader
        title="Disaster Intelligence Analytics & Telemetry"
        description="Real-time operational response times, mission success rates, resource utilization, and hazard severity trends."
        badgeText="TELEMETRY ACTIVE"
        badgeVariant="LOW"
      />

      {/* Primary KPI Row (Section 25) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <GlassCard className="p-4 space-y-1">
          <div className="text-command-muted uppercase text-[11px] flex items-center justify-between">
            <span>Avg Response Time</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-sans mt-1">14.2 min</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>Target: &lt; 20 min</span>
            <span className="font-bold">(Exceeded)</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="text-command-muted uppercase text-[11px] flex items-center justify-between">
            <span>Mission Completion</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-sans mt-1">94.2%</div>
          <div className="text-[11px] text-command-secondary">
            16 of 17 missions successful
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="text-command-muted uppercase text-[11px] flex items-center justify-between">
            <span>Resource Utilization</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-sans mt-1">78.5%</div>
          <div className="text-[11px] text-command-secondary">
            4 watercraft units deployed
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-1">
          <div className="text-command-muted uppercase text-[11px] flex items-center justify-between">
            <span>Evacuated Civilians</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-sans mt-1">842</div>
          <div className="text-[11px] text-emerald-400">
            Zero operational fatalities
          </div>
        </GlassCard>
      </div>

      {/* Progression Bar Visualizer: Flood Stage & Affected Population Progression */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Hydrological Surge & Population Inundation Timeline
            </h3>
          </div>
          <span className="text-[10px] font-mono text-command-muted">
            MAHANADI DELTA SENSOR LOGS
          </span>
        </div>

        {/* Clean animated bar chart */}
        <div className="h-56 flex items-end gap-6 sm:gap-12 px-4 pb-3 border-b border-white/[0.08] mt-6">
          {progressionData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-mono text-cyan-300 font-bold">{item.stage}</span>
              <div
                style={{ height: `${item.pct}%` }}
                className="w-full max-w-[48px] bg-gradient-to-t from-cyan-950 via-cyan-800 to-cyan-400 rounded-t-lg transition-all duration-700 shadow-lg shadow-cyan-950/60"
              />
              <span className="text-xs font-mono text-white font-bold mt-1">{item.time}</span>
              <span className="text-[10px] font-mono text-command-muted">{item.pop}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Critical Zone Breakdown & Operations Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Zone Severity Breakdown */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white">
              <PieChart className="w-4 h-4 text-amber-400" />
              <span>Zone Severity & Risk Ranking</span>
            </div>
            <Badge variant="SIMULATION" text="RANKED" />
          </div>

          <div className="space-y-3 font-mono">
            {zoneSeverity.map((z, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white font-bold">{z.zone}</span>
                  <span className={z.textColor}>{z.level} (Score {z.score})</span>
                </div>
                <div className="w-full bg-surface-base rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${z.color} rounded-full`} style={{ width: `${z.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Operational Health & Communications */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Relief Operations Infrastructure Health</span>
            </div>
            <Badge variant="LOW" text="NOMINAL" />
          </div>

          <div className="space-y-2.5 text-command-secondary text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-surface-elevated/40 border border-white/[0.04]">
              <span>Watercraft Extraction Efficiency:</span>
              <strong className="text-emerald-400">96.4%</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-elevated/40 border border-white/[0.04]">
              <span>Air-Sea Rescue Winch Readiness:</span>
              <strong className="text-emerald-400">100% (ALH Dhruv Standby)</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-elevated/40 border border-white/[0.04]">
              <span>Satellite SAR Telemetry:</span>
              <strong className="text-cyan-400">Updated 14m ago</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-elevated/40 border border-white/[0.04]">
              <span>Emergency VSAT Bandwidth:</span>
              <strong className="text-white">18ms via Starlink Mesh</strong>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export { AnalyticsPage };
