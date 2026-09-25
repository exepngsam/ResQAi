import { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Shield,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Building,
  Truck
} from "lucide-react";
import { CommandHeader } from "../components/common/CommandHeader";
import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

const ReportsPage = ({ summary }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    const reportText = `RESQAI DISASTER MANAGEMENT AUTHORITY
INCIDENT SITUATION REPORT (ICS FORM 201)
Disaster: ${summary?.disaster?.name || "Mahanadi Delta Inundation"}
Generated: ${new Date().toUTCString()}

1. EXECUTIVE SUMMARY
Catastrophic category-4 riverine flooding across coastal delta districts. 138,400 civilians affected. Forward EOC coordinating dynamic watercraft extractions with zero operational fatalities.

2. OBSERVED CONDITIONS
- Flood Stage: +3.1m above high flood level
- Inundation Area: 1,420 sq km
- Water Velocity: 2.4 m/s in canal tributaries

3. CRITICAL ZONES
- Zone 7 (Erasama Coastal Basin): Critical (Risk Score 87/100)
- Zone 4 (Cuttack Outer Suburbs): High (Risk Score 74/100)

4. POSSIBLE VICTIMS
- Detected trapped individuals: 14 civilians on school rooftop in Zone 7
- High-risk vulnerable elderly: 28 persons in Zone 4

5. INFRASTRUCTURE IMPACT
- Road R-17 (SH-12): Impassable / washed out
- National Highway NH-16: Designated Emergency Green Corridor

6. RESOURCES COMMITTED
- Rescue Teams: 4 units deployed (RESCUE-04, 01, 07, 11)
- Inflatable Zodiac Boats: 9 active hulls
- Ambulances: 4 pre-staged

7. ACTIVE MISSIONS
- Mission MIS-801: Rescue Team 04 en route to Zone 7 via Canal Corridor R-18.

8. AI ANALYSIS & REASONING
Multi-modal correlation (Drone + Synthetic Aperture Radar + Citizen SOS) confirmed high confidence in rooftop entrapment. Route optimizer bypassed severed Road R-17.

9. RECOMMENDED ACTIONS
1. Complete rooftop extraction of 14 civilians.
2. Evacuate 28 elderly patients from Zone 4 facility.
3. Replenish Erasama Shelter potable water reserves.

10. APPROVAL HISTORY
- 12:44 AI proposed deployment of RESCUE-04
- 12:45 Incident Commander approved via cryptographic token
- 12:46 Field Team en route`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `RESQAI_SITREP_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const disasterName = summary?.disaster?.name || "Mahanadi Delta Catastrophic Inundation";
  const disasterId = summary?.disaster?.id || "DIS-2026-FL01";
  const totalPop = summary?.total_affected_population || 138400;
  const critCount = summary?.critical_zones_count || 1;
  const victimsCount = summary?.detected_victims_count || 14;
  const blockedCount = summary?.blocked_roads_count || 1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <CommandHeader
        title="Incident Situation Report (SITREP)"
        description="NDMA Incident Command System (ICS Form 201) compliant operational summary. Exportable for official government briefing."
        badgeText="OFFICIAL LEGAL RECORD"
        badgeVariant="LOW"
      />

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-mono text-command-secondary">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            icon={Download}
            onClick={handleExportText}
          >
            {downloadSuccess ? "DOWNLOADED" : "EXPORT TXT"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            className="bg-white text-black font-bold"
          >
            PRINT / SAVE PDF
          </Button>
        </div>
      </div>

      {/* Structured Situation Report Document (Section 26) */}
      <GlassCard className="p-6 md:p-10 space-y-8 font-mono text-xs shadow-2xl relative overflow-hidden">
        {/* Document Header */}
        <div className="border-b border-white/10 pb-6 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-red-400 tracking-widest uppercase">
              STATE DISASTER MANAGEMENT AUTHORITY (SDMA) — INCIDENT COMMAND
            </span>
            <Badge variant="CRITICAL" text="ICS FORM 201 — OFFICIAL BRIEF" />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight font-sans mt-2">
            INCIDENT BRIEFING & SITUATION REPORT: {disasterName}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-command-muted text-[11px] pt-1">
            <span>Disaster ID: <strong className="text-white">{disasterId}</strong></span>
            <span>Origin: <strong className="text-white">2026-09-23 06:00 UTC</strong></span>
            <span>Briefing Timestamp: <strong className="text-cyan-400">{new Date().toUTCString()}</strong></span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>1. Executive Summary</span>
          </h2>
          <p className="text-command-secondary leading-relaxed font-sans text-xs">
            Catastrophic inundation across Mahanadi delta basin triggered by extreme upstream reservoir discharge (+1.8m above danger mark) and tidal storm surge. Rapid automated dispatch algorithms deployed to coordinate multi-agency watercraft extractions. Forward operations center has safely evacuated vulnerable clusters with zero casualties reported to date.
          </p>
        </div>

        {/* Section 2: Observed Conditions */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>2. Observed Field Reconnaissance & Sensor Conditions</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-elevated/50 rounded-xl border border-white/[0.06]">
              <div className="text-command-muted text-[10px] uppercase">Affected Population</div>
              <div className="text-lg font-bold text-white mt-1 font-mono">{totalPop.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-surface-elevated/50 rounded-xl border border-white/[0.06]">
              <div className="text-command-muted text-[10px] uppercase">Critical Zones</div>
              <div className="text-lg font-bold text-red-400 mt-1 font-mono">{critCount} of 8 zones</div>
            </div>
            <div className="p-3 bg-surface-elevated/50 rounded-xl border border-white/[0.06]">
              <div className="text-command-muted text-[10px] uppercase">Possible Trapped Victims</div>
              <div className="text-lg font-bold text-amber-400 mt-1 font-mono">{victimsCount} civilians</div>
            </div>
            <div className="p-3 bg-surface-elevated/50 rounded-xl border border-white/[0.06]">
              <div className="text-command-muted text-[10px] uppercase">Severed Corridors</div>
              <div className="text-lg font-bold text-white mt-1 font-mono">{blockedCount} road sections</div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Critical Zones & Possible Victims */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>3. Critical Hazard Sectors</span>
            </h2>
            <div className="p-3.5 bg-surface-elevated/40 rounded-xl border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-white">Zone 7: Erasama Coastal Basin</strong>
                <Badge variant="CRITICAL" text="SCORE 87/100" />
              </div>
              <p className="text-[11px] text-command-secondary font-sans">
                Water depth 3.1m; scoured Road R-17; 14 people stranded on primary school roof.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>4. Possible Victims & Triage</span>
            </h2>
            <div className="p-3.5 bg-surface-elevated/40 rounded-xl border border-white/[0.06] space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-white">Incident INC-801 (School Rooftop)</strong>
                <span className="text-amber-400 font-bold">14 Civilians</span>
              </div>
              <p className="text-[11px] text-command-secondary font-sans">
                Aerial optical pass verified orange signaling cloths; water velocity 2.4 m/s.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Infrastructure Impact */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>5. Infrastructure Impact & Corridor Connectivity</span>
          </h2>
          <div className="p-3.5 bg-surface-elevated/40 rounded-xl border border-white/[0.06] leading-relaxed space-y-1 text-command-secondary font-sans">
            <p>• <strong>Road R-17 (State Highway 12):</strong> Submerged over 4.2 km. Severe culvert scouring prevents standard vehicular rescue.</p>
            <p>• <strong>National Highway NH-16:</strong> Open and maintained as priority emergency green corridor for trauma ambulances.</p>
            <p>• <strong>Waterway Corridor R-18:</strong> Navigable for shallow-draft Zodiac inflatables with 11-minute transit time.</p>
          </div>
        </div>

        {/* Section 6 & 7: Resources & Active Missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>6. Committed Resources</span>
            </h2>
            <div className="p-3.5 bg-surface-elevated/40 rounded-xl border border-white/[0.06] space-y-1 text-[11px] text-command-secondary">
              <div>• <strong>NDRF 03 Bn (RESCUE-04):</strong> 18 personnel, 4 Zodiac boats</div>
              <div>• <strong>ODRAF Unit Alpha (RESCUE-01):</strong> 14 personnel, 3 jet boats</div>
              <div>• <strong>Coast Guard Air Crew (RESCUE-11):</strong> ALH Dhruv standby</div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>7. Active Field Missions</span>
            </h2>
            <div className="p-3.5 bg-surface-elevated/40 rounded-xl border border-white/[0.06] space-y-1 text-[11px]">
              <div className="flex justify-between text-white font-bold">
                <span>MIS-801 (Rescue Team 04)</span>
                <span className="text-cyan-400">EN ROUTE</span>
              </div>
              <p className="text-command-secondary font-sans">Navigating Canal Corridor R-18 toward school rooftop. ETA 11 min.</p>
            </div>
          </div>
        </div>

        {/* Section 8: AI Analysis */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>8. Synthesized AI Situational Analysis</span>
          </h2>
          <div className="p-4 bg-surface-elevated/40 rounded-xl border border-white/[0.06] leading-relaxed space-y-2 text-command-secondary font-sans">
            <p>
              • <strong>Hydrological Threat:</strong> Extreme discharge from Naraj and Mahanadi barrages combined with high tidal backflow has submerged coastal lowlands across Kendrapara and Jagatsinghpur.
            </p>
            <p>
              • <strong>Isolation Vectors:</strong> Road R-17 has suffered complete structural scouring over 4.2 km. Erasama primary school rooftop holds 14 trapped individuals in Zone 7. Water velocity is clocked at 2.4 m/s.
            </p>
            <p>
              • <strong>Urban Choke Points:</strong> Cuttack Outer Suburbs (Zone 4) has experienced severe storm sewer backflow endangering an elderly care facility (Incident INC-792).
            </p>
          </div>
        </div>

        {/* Section 9: Recommended Actions */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>9. Actionable Response Recommendations (Decision Support)</span>
          </h2>
          <div className="space-y-2">
            {[
              {
                step: "1",
                action: "Immediate Mission Dispatch to Zone 7",
                detail: "Authorize RESCUE-04 deployment via Canal Route R-18 with 4 inflatable Zodiac boats and pediatric medical kit."
              },
              {
                step: "2",
                action: "Corridor Traffic Redirection",
                detail: "Close flooded State Highway SH-12 (R-04) to civilian transit; establish dedicated emergency supply green corridor via NH-16 bypass."
              },
              {
                step: "3",
                action: "Hospital Surge Readiness",
                detail: "Direct SCB Medical College and AIIMS Bhubaneswar to hold 62 critical trauma and hypothermia ICU beds on standby."
              }
            ].map((rec) => (
              <div key={rec.step} className="p-3 bg-surface-elevated/40 rounded-xl border border-white/[0.06] flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  {rec.step}
                </span>
                <div>
                  <div className="font-bold text-white font-sans">{rec.action}</div>
                  <div className="text-command-secondary text-[11px] mt-0.5 font-sans">{rec.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 10 & 11: Approval History & Timestamp */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/[0.08] pb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>10. Commander Approval History & Cryptographic Audit Trail</span>
          </h2>
          <div className="p-3.5 bg-surface-elevated/40 rounded-xl border border-white/[0.06] space-y-1.5 text-[11px]">
            <div className="flex justify-between text-command-secondary">
              <span>12:44:02 UTC:</span>
              <span>AI Engine proposed dispatch of RESCUE-04 to Zone 7</span>
            </div>
            <div className="flex justify-between text-white font-bold">
              <span>12:45:18 UTC:</span>
              <span className="text-emerald-400">Commander authorized Mission MIS-801 (Token: AUTH-9821-EOC)</span>
            </div>
            <div className="flex justify-between text-command-secondary">
              <span>12:46:00 UTC:</span>
              <span>NDRF boat crew confirmed en route via Starlink link</span>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="pt-4 border-t border-white/[0.08] text-[10px] text-command-muted flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>RESQAI VERSION 2.0 — FOR OFFICIAL EOC USE ONLY</span>
          <span>HUMAN AUTHORIZATION REQUIRED PRIOR TO OPERATIONAL DISPATCH</span>
        </div>
      </GlassCard>
    </div>
  );
};

export { ReportsPage };
