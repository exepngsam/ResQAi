import {
  Users,
  AlertOctagon,
  LifeBuoy,
  Shield,
  Activity,
  Home,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";
import { DisasterMap } from "../components/map/DisasterMap";
const DashboardPage = ({
  summary,
  onOpenMissionApproval,
  onNavigate
}) => {
  const pendingMission = summary.active_missions.find((m) => m.status === "PENDING_APPROVAL");
  return <div className="space-y-6">{
    /* Human-in-the-Loop Urgent Recommendation Callout */
  }{pendingMission && <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-command-panel to-command-card border-2 border-red-500/80 shadow-2xl shadow-red-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"><div className="flex items-start gap-3"><div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-lg"><AlertOctagon className="w-5 h-5" /></div><div><div className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-2"><span>ACTION REQUIRED: HUMAN-IN-THE-LOOP APPROVAL</span><span className="px-1.5 py-0.2 rounded bg-red-900/80 text-[10px] text-white">PRIORITY 1</span></div><div className="text-sm font-semibold text-white mt-0.5">
                AI Recommendation: Dispatch {pendingMission.team_name} to Zone 7
              </div><div className="text-xs text-slate-300 font-mono mt-1">
                Reason: {pendingMission.reason}</div></div></div><button
    type="button"
    onClick={() => onOpenMissionApproval(pendingMission)}
    className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer whitespace-nowrap"
  >
            REVIEW & AUTHORIZE
            <ArrowRight className="w-4 h-4" /></button></div>}{
    /* Primary KPI Grid (Section 9) */
  }<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3"><StatCard
    label="Affected Pop."
    value={summary.total_affected_population.toLocaleString()}
    sublabel="Mahanadi basin"
    icon={Users}
    variant="critical"
  /><StatCard
    label="Critical Zones"
    value={`0${summary.critical_zones_count}`}
    sublabel="High hazard"
    icon={AlertOctagon}
    variant="critical"
  /><StatCard
    label="Possible Victims"
    value={summary.detected_victims_count}
    sublabel="Awaiting evac"
    icon={LifeBuoy}
    variant="warning"
  /><StatCard
    label="Response Teams"
    value={summary.active_rescue_teams_count}
    sublabel="NDRF & ODRAF"
    icon={Shield}
    variant="safe"
  /><StatCard
    label="Active Missions"
    value={summary.active_missions_count}
    sublabel="Operations live"
    icon={Activity}
    variant="intel"
  /><StatCard
    label="Avail. Shelters"
    value={summary.available_shelters_count}
    sublabel="Cyclone bunkers"
    icon={Home}
    variant="safe"
  /><StatCard
    label="Blocked Roads"
    value={summary.blocked_roads_count}
    sublabel="Impassable"
    icon={AlertTriangle}
    variant="warning"
  /></div>{
    /* Main Grid: GIS Map Centerpiece + Tactical Incident Feed */
  }<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* GIS Situational Map (2 Columns) */
  }<div className="lg:col-span-2 bg-command-panel border border-command-border rounded-xl p-4 flex flex-col shadow-xl"><div className="flex items-center justify-between pb-3 border-b border-command-border mb-3"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" /><h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Live Situational GIS Map
              </h2></div><button
    type="button"
    onClick={() => onNavigate("map")}
    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
  >
              FULLSCREEN MAP <ArrowRight className="w-3.5 h-3.5" /></button></div><div className="h-[460px] w-full"><DisasterMap
    zones={summary.zones}
    incidents={summary.recent_incidents}
    activeRoute={[
      [20.28, 86.2],
      [20.24, 86.28],
      [20.22, 86.34],
      [20.2, 86.39],
      [20.19, 86.43]
    ]}
  /></div></div>{
    /* Right Column: Live Alerts & Incident Triage Board */
  }<div className="space-y-4">{
    /* Emergency Alerts Feed */
  }<div className="bg-command-panel border border-command-border rounded-xl p-4 shadow-xl"><div className="flex items-center justify-between pb-2 border-b border-command-border mb-3"><div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Live Alert Broadcasts
              </div><span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40">
                REALTIME
              </span></div><div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">{summary.recent_alerts.map((alt) => <div
    key={alt.id}
    className="p-2.5 rounded-lg bg-command-bg border border-command-border hover:border-slate-600 transition-colors"
  ><div className="flex items-center justify-between"><Badge level={alt.type} size="sm" /><span className="text-[10px] font-mono text-slate-500">{alt.timestamp}</span></div><div className="text-xs font-semibold text-slate-200 mt-1.5">{alt.title}</div><div className="text-[11px] text-slate-400 font-mono mt-0.5 leading-snug">{alt.message}</div></div>)}</div></div>{
    /* Critical Incidents Board */
  }<div className="bg-command-panel border border-command-border rounded-xl p-4 shadow-xl"><div className="flex items-center justify-between pb-2 border-b border-command-border mb-3"><div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Priority Incidents Triage
              </div><button
    type="button"
    onClick={() => onNavigate("incidents")}
    className="text-xs font-mono text-slate-400 hover:text-white"
  >
                VIEW ALL
              </button></div><div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">{summary.recent_incidents.map((inc) => <div
    key={inc.id}
    className="p-2.5 rounded-lg bg-command-bg border border-command-border"
  ><div className="flex items-center justify-between"><Badge level={inc.priority} size="sm" /><span className="text-[10px] font-mono text-amber-400">{inc.zone_name}</span></div><div className="text-xs font-semibold text-slate-200 mt-1">{inc.title}</div><div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center justify-between"><span>Possible victims: {inc.possible_victims}</span><span className="text-cyan-400 uppercase font-bold">{inc.status}</span></div></div>)}</div></div></div></div></div>;
};
export {
  DashboardPage
};
