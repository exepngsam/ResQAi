import { useState } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { Badge } from "../components/common/Badge";
const IncidentsPage = ({
  incidents,
  timelineEvents,
  onSelectIncident
}) => {
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredIncidents = incidents.filter((inc) => {
    const matchPriority = priorityFilter === "ALL" || inc.priority === priorityFilter;
    const matchSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || inc.zone_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPriority && matchSearch;
  });
  return <div className="space-y-6">{
    /* Header & Filter Controls */
  }<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-command-border"><div><h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><span>Incident Triage &amp; Prioritization Board</span></h2><p className="text-xs text-slate-400 font-mono mt-0.5">
            P1 (Immediate) • P2 (Urgent) • P3 (Planned) • P4 (Monitor)
          </p></div><div className="flex items-center gap-2">{
    /* Priority filter pills */
  }<div className="flex bg-command-bg border border-command-border rounded-lg p-0.5 text-xs font-mono">{["ALL", "P1", "P2", "P3"].map((p) => <button
    key={p}
    type="button"
    onClick={() => setPriorityFilter(p)}
    className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${priorityFilter === p ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"}`}
  >{p}</button>)}</div></div></div>{
    /* Main Grid: Incidents List + Live Event Timeline (Section 24) */
  }<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{
    /* Incident Cards (2 Cols) */
  }<div className="lg:col-span-2 space-y-3">{filteredIncidents.map((inc) => <div
    key={inc.id}
    className="p-5 rounded-xl bg-command-panel border border-command-border hover:border-slate-500 transition-all shadow-lg flex flex-col justify-between gap-3"
  ><div className="flex items-start justify-between gap-2"><div><div className="flex items-center gap-2"><Badge level={inc.priority} size="sm" /><span className="text-xs font-mono font-bold text-amber-400">{inc.zone_name}</span><span className="text-[10px] font-mono text-slate-500">[{inc.reported_at}]</span></div><h3 className="text-sm font-bold text-white mt-1.5">{inc.title}</h3></div><span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold uppercase">{inc.status}</span></div><p className="text-xs text-slate-300 font-mono leading-relaxed bg-command-bg p-3 rounded-lg border border-slate-800/80">{inc.description}</p><div className="flex flex-wrap items-center justify-between text-xs font-mono pt-2 border-t border-command-border"><div className="flex items-center gap-4 text-slate-400"><span>Victims: <strong className="text-red-400">{inc.possible_victims}</strong></span><span>Water Stage: <strong className="text-white">{inc.water_level_m}m</strong></span></div>{inc.recommended_action && <div className="text-cyan-400 flex items-center gap-1 font-semibold text-[11px]">{inc.recommended_action}</div>}</div></div>)}</div>{
    /* Real-time Event Timeline (/incidents timeline) */
  }<div className="bg-command-panel border border-command-border rounded-xl p-4 shadow-xl flex flex-col"><div className="flex items-center justify-between pb-3 border-b border-command-border mb-3 font-mono"><span className="text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /><span>Live Disaster Timeline</span></span><span className="text-[10px] text-emerald-400 font-bold animate-pulse">STREAMING</span></div><div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">{timelineEvents.map((evt, idx) => <div key={idx} className="relative pl-5 border-l-2 border-slate-700 pb-2"><span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-cyan-400" /><div className="text-[10px] font-mono text-slate-400 font-bold">{evt.time}</div><div className="text-xs text-slate-200 font-mono mt-0.5 leading-snug">{evt.event}</div></div>)}</div></div></div></div>;
};
export {
  IncidentsPage
};
