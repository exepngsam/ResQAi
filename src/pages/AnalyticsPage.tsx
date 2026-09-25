import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, ShieldCheck, PieChart } from 'lucide-react';
import { DashboardSummary } from '../types';

interface AnalyticsPageProps {
  summary: DashboardSummary;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ summary }) => {
  const progressionData = [
    { time: '06:00', stage: '0.8m', pop: '24K', crit: 1, height: '25%' },
    { time: '08:00', stage: '1.4m', pop: '52K', crit: 3, height: '45%' },
    { time: '10:00', stage: '2.1m', pop: '89K', crit: 5, height: '68%' },
    { time: '12:00', stage: '2.9m', pop: '126K', crit: 8, height: '90%' },
    { time: '14:00', stage: '3.1m', pop: '138K', crit: 8, height: '100%' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-command-border">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Operational Analytics &amp; Disaster Progression</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Real-time spatial telemetry, response velocity, and evacuation metrics.
        </p>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-command-panel border border-command-border">
          <div className="text-xs text-slate-400 uppercase">Avg. Response Time</div>
          <div className="text-2xl font-bold text-white mt-1">14.2 min</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Target: &lt; 20 min (Exceeded)</div>
        </div>
        <div className="p-4 rounded-xl bg-command-panel border border-command-border">
          <div className="text-xs text-slate-400 uppercase">Evacuated Civilians</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">842</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero operational casualties</div>
        </div>
        <div className="p-4 rounded-xl bg-command-panel border border-command-border">
          <div className="text-xs text-slate-400 uppercase">Shelter Saturation</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">58.8%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">2,510 beds remaining</div>
        </div>
        <div className="p-4 rounded-xl bg-command-panel border border-command-border">
          <div className="text-xs text-slate-400 uppercase">Corridor Availability</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">83.3%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">5 of 6 corridors clear</div>
        </div>
      </div>

      {/* Progression Bar Visualizer */}
      <div className="p-5 rounded-xl bg-command-panel border border-command-border shadow-xl">
        <div className="text-xs font-mono font-bold uppercase text-slate-300 mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Flood Stage &amp; Affected Population Progression (Mahanadi Basin)
          </span>
          <span className="text-[10px] text-slate-500 font-normal">HISTORICAL + PREDICTIVE</span>
        </div>

        <div className="h-56 flex items-end gap-6 sm:gap-12 px-4 pb-2 border-b border-command-border">
          {progressionData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-mono text-cyan-400 font-bold">{item.stage}</span>
              <div
                style={{ height: item.height }}
                className="w-full max-w-[48px] bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-t-md transition-all duration-500 shadow-lg shadow-cyan-950/50"
              />
              <span className="text-xs font-mono text-slate-300 font-bold mt-1">{item.time}</span>
              <span className="text-[10px] font-mono text-slate-400">{item.pop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Zone Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-command-panel border border-command-border">
          <div className="text-xs font-bold uppercase text-slate-300 mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            Zone Risk Level Distribution
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Critical Risk (Zone 7):</span>
                <span className="text-red-400 font-bold">12.5%</span>
              </div>
              <div className="w-full bg-command-bg rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '12.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>High Risk (Zones 1, 3, 4, 6):</span>
                <span className="text-amber-400 font-bold">50.0%</span>
              </div>
              <div className="w-full bg-command-bg rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Moderate Risk (Zones 2, 5, 8):</span>
                <span className="text-yellow-400 font-bold">37.5%</span>
              </div>
              <div className="w-full bg-command-bg rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '37.5%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-command-panel border border-command-border space-y-2.5">
          <div className="text-xs font-bold uppercase text-slate-300 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Evacuation &amp; Relief Operations Health
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Water Extraction Efficiency:</span>
            <span className="text-emerald-400 font-bold">94.2%</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Air-Sea Rescue Winch Readiness:</span>
            <span className="text-emerald-400 font-bold">100% (ALH Dhruv Standby)</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Satellite Synthetic Aperture Radar (SAR):</span>
            <span className="text-cyan-400 font-bold">Updated 18 min ago</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Telemetry Bandwidth Latency:</span>
            <span className="text-slate-400 font-bold">18ms via Starlink/ISRO VSAT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
