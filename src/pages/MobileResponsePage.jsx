import { useState } from "react";
import { Smartphone, Check, MapPin, Navigation, Clock, ShieldCheck } from "lucide-react";
const MobileResponsePage = ({ missions }) => {
  const activeMission = missions.find((m) => m.status === "APPROVED" || m.status === "IN_TRANSIT") || missions[0];
  const [responderStatus, setResponderStatus] = useState(activeMission?.status || "IN_TRANSIT");
  return <div className="max-w-md mx-auto space-y-4">{
    /* Mobile Frame Header */
  }<div className="p-3 bg-command-panel border border-command-border rounded-xl flex items-center justify-between text-xs font-mono"><div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-cyan-400" /><span className="font-bold text-white">RESPONDER HUD</span></div><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px]">
          GPS LOCKED
        </span></div>{activeMission ? <div className="p-5 rounded-2xl bg-command-panel border border-command-border shadow-2xl space-y-4 font-mono text-xs">{
    /* Status Badge */
  }<div className="flex items-center justify-between"><span className="text-red-400 font-bold uppercase tracking-wider">{activeMission.priority} IMMEDIATE DISPATCH
            </span><span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40">{responderStatus}</span></div><div><h3 className="text-base font-bold text-white tracking-tight">{activeMission.incident_title}</h3><div className="text-slate-400 text-xs mt-1">Zone: {activeMission.zone_id}</div></div>{
    /* Telemetry Card */
  }<div className="p-3.5 rounded-xl bg-command-bg border border-command-border space-y-2"><div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-1.5 text-slate-400"><MapPin className="w-3.5 h-3.5 text-red-400" />
                Target Coordinates:
              </span><span className="font-bold text-white">[{activeMission.destination.join(", ")}]</span></div><div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-1.5 text-slate-400"><Navigation className="w-3.5 h-3.5 text-cyan-400" />
                Navigational Vector:
              </span><span className="font-bold text-cyan-300">Canal Corridor R-18</span></div><div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5 text-amber-400" />
                Remaining ETA:
              </span><span className="font-bold text-amber-400">~{activeMission.estimated_eta_min} min</span></div></div><div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">{activeMission.reason}</div>{
    /* Tactical Action Buttons for Responder (Section 26) */
  }<div className="pt-2 grid grid-cols-2 gap-2"><button
    type="button"
    onClick={() => setResponderStatus("ACCEPTED / EN ROUTE")}
    className="py-2.5 rounded-xl bg-command-bg hover:bg-command-hover text-white border border-command-border font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
  ><Check className="w-4 h-4 text-emerald-400" />
              ACCEPT
            </button><button
    type="button"
    onClick={() => setResponderStatus("ARRIVED ON SCENE")}
    className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
  ><MapPin className="w-4 h-4" />
              ARRIVED
            </button><button
    type="button"
    onClick={() => setResponderStatus("RESCUE RESOLVED")}
    className="col-span-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 transition-colors cursor-pointer"
  ><ShieldCheck className="w-4 h-4" />
              RESOLVED / EVACUATION COMPLETE
            </button></div></div> : <div className="p-8 text-center text-slate-500 font-mono text-xs">No active responder missions assigned.</div>}</div>;
};
export {
  MobileResponsePage
};
