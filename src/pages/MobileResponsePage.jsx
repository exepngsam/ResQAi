import { useState } from "react";
import {
  Smartphone,
  Check,
  MapPin,
  Navigation,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Radio,
  LifeBuoy,
  Users,
  Compass,
  ArrowRight,
  ShieldAlert,
  PhoneCall
} from "lucide-react";
import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

const MobileResponsePage = ({ missions = [] }) => {
  const activeMission =
    missions.find((m) => m.status === "APPROVED" || m.status === "IN_TRANSIT" || m.status === "PENDING_APPROVAL") ||
    missions[0] || {
      id: "MIS-801",
      incident_title: "14 Possible Victims Stranded on Submerged School Rooftop",
      zone_id: "ZONE-07",
      team_id: "RESCUE-04",
      team_name: "NDRF 03 Bn Flood Specialist Unit",
      priority: "CRITICAL",
      destination: [20.19, 86.43],
      estimated_eta_min: 11,
      recommended_route_id: "Canal Waterway Corridor R-18",
      reason: "14 civilians waving orange cloth on inundated school terrace. Swift water current 2.4 m/s."
    };

  const [responderStatus, setResponderStatus] = useState("EN_ROUTE");
  const [assistanceRequested, setAssistanceRequested] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleUpdateStatus = (newStatus, msg) => {
    setResponderStatus(newStatus);
    setStatusMessage(msg);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12 animate-blur-fade-up">
      {/* Top Mobile Tactical Bar */}
      <div className="liquid-glass p-3 rounded-2xl flex items-center justify-between font-mono text-xs shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wider block">FIELD RESPONDER HUD</span>
            <span className="text-[10px] text-emerald-400">STARLINK / ISRO MESH LINKED</span>
          </div>
        </div>

        <Badge variant="LOW" text="GPS LOCKED" />
      </div>

      {/* Main Mission Card (Section 23) */}
      <GlassCard className="p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Large Mission Header */}
        <div className="border-b border-white/[0.08] pb-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-command-muted uppercase tracking-wider">
              CURRENT MISSION
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/40">
              CRITICAL
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              {activeMission.team_id || "RESCUE-04"}
            </h1>
            <span className="text-base font-bold font-mono text-cyan-400">
              {activeMission.zone_id || "ZONE-07"}
            </span>
          </div>

          <div className="text-xs text-command-secondary mt-1 font-sans">
            {activeMission.incident_title}
          </div>
        </div>

        {/* Current State Indicator */}
        <div className="p-3 rounded-xl bg-surface-elevated/70 border border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono text-command-muted uppercase">Operational Status:</span>
          <span className="text-xs font-mono font-bold text-white px-2.5 py-0.5 rounded bg-white/10 border border-white/20">
            {responderStatus}
          </span>
        </div>

        {/* Primary Telemetry Metrics (Section 23) */}
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-surface-elevated/50 border border-white/[0.08] space-y-1">
            <div className="text-[10px] text-command-muted flex items-center gap-1.5 uppercase">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Assigned Route</span>
            </div>
            <div className="text-sm font-bold text-white truncate">
              {activeMission.recommended_route_id || "Canal Corridor R-18"}
            </div>
            <div className="text-[10px] text-emerald-400">Road R-17 Scour Bypassed</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated/50 border border-white/[0.08] space-y-1">
            <div className="text-[10px] text-command-muted flex items-center gap-1.5 uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Remaining ETA</span>
            </div>
            <div className="text-sm font-bold text-amber-400">
              ~{activeMission.estimated_eta_min || 11} min
            </div>
            <div className="text-[10px] text-command-secondary">Distance: 3.2 km waterway</div>
          </div>
        </div>

        {/* Possible Civilians & Coordinates */}
        <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-white/[0.06] space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center text-command-secondary">
            <span className="flex items-center gap-1.5 text-command-muted">
              <Users className="w-3.5 h-3.5 text-red-400" />
              Possible Civilians:
            </span>
            <span className="font-bold text-red-400 text-sm">14 Persons (Stranded)</span>
          </div>

          <div className="flex justify-between items-center text-command-secondary">
            <span className="flex items-center gap-1.5 text-command-muted">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Target Location:
            </span>
            <span className="font-bold text-white">[20.194° N, 86.431° E]</span>
          </div>
        </div>

        {/* Tactical Safety Warnings (Section 23) */}
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Hazard & Safety Warnings</span>
          </div>
          <p className="text-amber-200/80 text-[11px] font-sans leading-relaxed">
            Swift water current 2.4 m/s in canal junction. High voltage power lines sagged 1.2m above flood level. Helmets & drysuits mandatory. Maintain tethered lines during extraction.
          </p>
        </div>

        {/* Primary Large Tactile Buttons (Section 23) */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="lg"
              icon={Check}
              onClick={() => handleUpdateStatus("ACCEPTED", "Mission accepted by team lead")}
              className={`w-full font-mono text-xs font-bold ${
                responderStatus === "ACCEPTED" ? "bg-white text-black border-white" : ""
              }`}
            >
              ACCEPT
            </Button>

            <Button
              variant="primary"
              size="lg"
              icon={MapPin}
              onClick={() => handleUpdateStatus("ARRIVED ON SCENE", "Inflatable boats deployed at school perimeter")}
              className={`w-full font-mono text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white border-none ${
                responderStatus === "ARRIVED ON SCENE" ? "ring-2 ring-cyan-300" : ""
              }`}
            >
              ARRIVED
            </Button>
          </div>

          <Button
            variant="glass"
            size="md"
            icon={Compass}
            onClick={() => handleUpdateStatus("EXTRACTION_IN_PROGRESS", "Victims boarding life rafts")}
            className="w-full font-mono text-xs text-command-secondary hover:text-white"
          >
            UPDATE STATUS (EXTRACTION IN PROGRESS)
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={ShieldCheck}
            onClick={() => handleUpdateStatus("RESOLVED", "All 14 civilians evacuated to Erasama Shelter")}
            className="w-full font-mono text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/60 border-none py-3.5"
          >
            RESOLVED / EVACUATION COMPLETE
          </Button>
        </div>

        {/* NEED ASSISTANCE Emergency SOS Button (Section 23) */}
        <div className="pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setAssistanceRequested(!assistanceRequested)}
            className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              assistanceRequested
                ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-900/60"
                : "bg-red-950/40 text-red-400 border border-red-500/40 hover:bg-red-900/50"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{assistanceRequested ? "ASSISTANCE REQUEST BROADCASTED TO EOC" : "NEED IMMEDIATE BACKUP / ASSISTANCE"}</span>
          </button>

          {assistanceRequested && (
            <div className="mt-2 text-center text-[10px] font-mono text-red-300">
              Distress flare beacon transmitted. Coast Guard ALH Dhruv helicopter alerted.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export { MobileResponsePage };
