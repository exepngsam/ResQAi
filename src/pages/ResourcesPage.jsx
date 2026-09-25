import { useState } from "react";
import { Truck } from "lucide-react";
const ResourcesPage = ({
  rescueTeams = [],
  shelters = [],
  hospitals = []
}) => {
  const [activeTab, setActiveTab] = useState("TEAMS");
  return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-command-border"><div><h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><Truck className="w-5 h-5 text-emerald-400" /><span>Resource &amp; Fleet Inventory Management</span></h2><p className="text-xs text-slate-400 font-mono mt-0.5">
            Active telemetry tracking for motorized boats, ambulances, evacuation shelters, and trauma centers.
          </p></div><div className="flex bg-command-bg border border-command-border rounded-lg p-0.5 text-xs font-mono">{["TEAMS", "SHELTERS", "HOSPITALS"].map((tab) => <button
    key={tab}
    type="button"
    onClick={() => setActiveTab(tab)}
    className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${activeTab === tab ? "bg-command-active text-white" : "text-slate-400 hover:text-white"}`}
  >{tab}</button>)}</div></div>{activeTab === "TEAMS" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">{rescueTeams.map((t) => <div
    key={t.id}
    className="p-4 rounded-xl bg-command-panel border border-command-border space-y-2 shadow-lg"
  ><div className="flex items-center justify-between"><span className="font-bold text-white text-sm">{t.name}</span><span
    className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === "AVAILABLE" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/50" : "bg-amber-950 text-amber-400 border border-amber-500/50"}`}
  >{t.status}</span></div><div className="text-cyan-400 font-semibold">{t.capability}</div><div className="text-slate-400">
                Responders: <strong className="text-white">{t.personnel_count}</strong> | Boats:{" "}<strong className="text-white">{t.boats_assigned}</strong></div><div className="text-slate-400 text-[11px]">
                Equipment: {t.equipment.join(" \u2022 ")}</div></div>)}</div>}{activeTab === "SHELTERS" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">{shelters.map((s) => <div key={s.id} className="p-4 rounded-xl bg-command-panel border border-command-border space-y-2 shadow-lg"><div className="flex items-center justify-between"><span className="font-bold text-white text-sm">{s.name}</span><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/50">{s.status}</span></div><div className="text-slate-300">
                Capacity: <strong className="text-white">{s.occupancy}</strong> / {s.capacity} (
                {Math.round(s.occupancy / s.capacity * 100)}%)
              </div><div className="text-slate-400">
                Potable Water Reserves: <strong className="text-cyan-400">{s.water_supply_days} days</strong></div><div className="text-slate-400">
                Medical Team: <strong className="text-emerald-400">Present On Site</strong></div></div>)}</div>}{activeTab === "HOSPITALS" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">{hospitals.map((h) => <div key={h.id} className="p-4 rounded-xl bg-command-panel border border-command-border space-y-2 shadow-lg"><div className="flex items-center justify-between"><span className="font-bold text-white text-sm">{h.name}</span><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/50">{h.trauma_level}</span></div><div className="text-slate-400">{h.location_name}</div><div className="text-slate-300">
                Available Inpatient Beds: <strong className="text-emerald-400">{h.available_beds}</strong> / {h.total_beds}</div><div className="text-slate-300">
                ICU Surge Capacity: <strong className="text-amber-400">{h.icu_available} beds available</strong></div></div>)}</div>}</div>;
};
export {
  ResourcesPage
};
