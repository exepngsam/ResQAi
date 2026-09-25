import { useState } from "react";
import {
  X,
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  Shield,
  Navigation,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2
} from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";

const IncidentDrawer = ({
  incident,
  isOpen,
  onClose,
  onApproveMission,
  onRejectMission,
  onNavigateToMap
}) => {
  const [showRiskBreakdown, setShowRiskBreakdown] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);

  if (!isOpen || !incident) return null;

  const riskScore = incident.risk_score || 87;

  // Contributing factors calculation
  const factors = incident.contributing_factors || [
    { name: "Population exposure", value: "+32", factor: 32 },
    { name: "Flood inundation intensity", value: "+21", factor: 21 },
    { name: "Access road blockage", value: "+18", factor: 18 },
    { name: "Medical transport distance", value: "+10", factor: 10 },
    { name: "Critical infrastructure damage", value: "+6", factor: 6 }
  ];

  // Multi-source correlation evidence with quality rating
  const evidenceSources = [
    { source: "Aerial Recon Drone (4K)", observation: `${incident.affected_count || 14} civilians spotted on rooftop`, quality: "HIGH", time: "4 min ago" },
    { source: "Citizen Emergency SOS", observation: "3 verified geo-located civilian distress calls", quality: "HIGH", time: "6 min ago" },
    { source: "IoT Delta River Gauge", observation: "Water surge +1.8m above critical embankment", quality: "HIGH", time: "2 min ago" },
    { source: "Synthetic Aperture Radar", observation: "Satellite pass confirms 62% sector inundation", quality: "MEDIUM", time: "14 min ago" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#08080a] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slide-in-right">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white tracking-wider">
                    {incident.id || "INC-2841"}
                  </span>
                  <Badge level={incident.priority || "P1"} size="sm" />
                </div>
                <div className="text-[11px] text-secondary font-mono mt-0.5">
                  OPERATIONAL INCIDENT DOSSIER
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 overflow-y-auto space-y-5 text-xs text-secondary flex-1 font-sans">
            {/* Title & Core Meta */}
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {incident.title || "Possible Trapped Civilians on Submerged Rooftop"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  {incident.location || "Zone 7, Kendrapara Delta"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  {incident.affected_count || 14} possible victims
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  {incident.reported_at || "8 min ago"}
                </span>
              </div>
            </div>

            {/* Explainable Risk Score Card (XAI) */}
            <div className="liquid-glass rounded-xl p-4 border border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-muted tracking-wider">
                    EXPLAINABLE RISK EVALUATION (XAI)
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-red-400">
                      {riskScore}
                    </span>
                    <span className="text-xs font-mono text-muted">/ 100</span>
                    <span className="text-xs font-bold text-red-400 ml-1">
                      {riskScore >= 75 ? "CRITICAL HAZARD" : "HIGH HAZARD"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRiskBreakdown(!showRiskBreakdown)}
                  className="flex items-center gap-1 text-[11px] text-secondary hover:text-white transition-colors"
                >
                  <span>{showRiskBreakdown ? "Hide Formula" : "View Breakdown"}</span>
                  {showRiskBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showRiskBreakdown && (
                <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-1.5 font-mono text-[11px]">
                  {factors.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between text-secondary">
                      <span>{f.name}</span>
                      <span className="font-bold text-red-400">{f.value || `+${f.factor}`}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-muted pt-1">
                    Formula: 0.30·Pop + 0.25·Flood + 0.20·Road + 0.15·Density + 0.10·Hospital
                  </div>
                </div>
              )}
            </div>

            {/* Multi-Source Evidence Correlation */}
            <div className="liquid-glass rounded-xl p-4 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[10px] font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MULTI-SOURCE EVIDENCE CORRELATION</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  HIGH CONFIDENCE
                </span>
              </div>

              <div className="space-y-2">
                {evidenceSources.map((ev, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold text-white">{ev.source}</div>
                      <div className="text-[10px] text-secondary mt-0.5">{ev.observation}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-white">
                        {ev.quality} QUALITY
                      </span>
                      <div className="text-[9px] text-muted mt-1">{ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Logistics (Nearest Team, Hospital, Route) */}
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-muted flex items-center gap-1 text-[10px]">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>NEAREST FLOOD UNIT</span>
                </div>
                <div className="font-bold text-white mt-1">SQUAD RESCUE-04</div>
                <div className="text-[10px] text-secondary mt-0.5">3.2 km • 11 min ETA</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-muted flex items-center gap-1 text-[10px]">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span>TRAUMA CENTER</span>
                </div>
                <div className="font-bold text-white mt-1">SCB Medical College</div>
                <div className="text-[10px] text-secondary mt-0.5">34 beds pre-staged</div>
              </div>
            </div>

            {/* Suggested Dynamic Transit Route */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-muted uppercase">SUGGESTED TRANSIT CORRIDOR</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">
                  Canal Corridor R-18 (Watercraft Navigable)
                </div>
                <div className="text-[10px] text-secondary mt-0.5">
                  Avoids submerged highway H-02 (Water depth 1.8m)
                </div>
              </div>
              {onNavigateToMap && (
                <button
                  type="button"
                  onClick={() => onNavigateToMap(incident)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white font-mono text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-secondary" />
                  <span>View Route</span>
                </button>
              )}
            </div>

            {/* AI Recommendation Card */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI OPERATIONAL RECOMMENDATION</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-medium">
                "Deploy Squad RESCUE-04 via Canal R-18 for priority rooftop civilian extraction. Coordinate 3 trauma beds at Kendrapara Sub-Hospital."
              </p>
              <div className="text-[10px] text-muted font-mono flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Complies with NDMA Flood SOP Section 4.2 (Rapid Water Ingress Protocol)</span>
              </div>
            </div>
          </div>

          {/* Footer Action Authorization Buttons (HITL Guarantee) */}
          <div className="p-4 border-t border-white/[0.08] bg-[#050505] flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onRejectMission ? onRejectMission(incident.id, "Tactical override by commander") : onClose()}
              className="flex-1"
            >
              REJECT / DEFER
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => onApproveMission ? onApproveMission(incident) : onClose()}
              icon={CheckCircle2}
              iconPosition="left"
              className="flex-1 font-bold"
            >
              APPROVE RESCUE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { IncidentDrawer };
