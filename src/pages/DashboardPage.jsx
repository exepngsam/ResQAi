import { useState } from "react";
import {
  Users,
  AlertOctagon,
  LifeBuoy,
  Shield,
  Activity,
  Home,
  AlertTriangle,
  ArrowRight,
  Play,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  Navigation
} from "lucide-react";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { GlassCard } from "../components/common/GlassCard";
import { DisasterMap } from "../components/map/DisasterMap";
import { IncidentDrawer } from "../components/common/IncidentDrawer";

const DashboardPage = ({
  summary,
  onOpenMissionApproval,
  onNavigate
}) => {
  const [selectedIncidentForDrawer, setSelectedIncidentForDrawer] = useState(null);

  const pendingMission = summary?.active_missions?.find(
    (m) => m.status === "PENDING_APPROVAL"
  );

  return (
    <div className="space-y-6 font-sans">
      {/* =====================================================================
          12. COMMAND CENTER HERO
          ===================================================================== */}
      <div className="relative overflow-hidden rounded-2xl liquid-glass border border-white/[0.08] p-6 md:p-8 animate-blur-fade-up">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-[11px] font-mono text-secondary">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                ACTIVE EVENT
              </span>
              <span>•</span>
              <span className="text-white font-medium">FLOOD RESPONSE</span>
              <span>•</span>
              <span>ODISHA DELTA</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">LIVE HUD</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white leading-tight">
              <span className="block overflow-hidden pb-1">
                <span className="animate-line-reveal-1">TURN CHAOS</span>
              </span>
              <span className="block overflow-hidden">
                <span className="animate-line-reveal-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                  INTO ACTION.
                </span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-secondary max-w-xl font-normal leading-relaxed delay-140 animate-blur-fade-up">
              "Real-time disaster intelligence for faster, safer and more coordinated emergency response."
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 delay-200 animate-blur-fade-up">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate("map")}
                icon={ArrowRight}
                iconPosition="right"
                className="font-semibold shadow-lg shadow-white/10"
              >
                OPEN COMMAND MAP
              </Button>

              <Button
                variant="glass"
                size="md"
                onClick={() => onNavigate("simulation")}
                icon={Play}
                iconPosition="left"
                className="text-white"
              >
                RUN SIMULATION
              </Button>
            </div>
          </div>

          {/* Right: Compact Tactical Status Panel */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 font-mono delay-220 animate-blur-fade-up">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] text-muted uppercase">AFFECTED POPULATION</div>
              <div className="text-xl md:text-2xl font-bold text-white mt-1">
                {summary.total_affected_population?.toLocaleString() || "295,300"}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">8 Flood Sectors</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] text-muted uppercase">CRITICAL ZONES</div>
              <div className="text-xl md:text-2xl font-bold text-red-400 mt-1">
                0{summary.critical_zones_count || 3}
              </div>
              <div className="text-[10px] text-red-400/80 mt-0.5">Immediate Extraction</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] text-muted uppercase">ACTIVE MISSIONS</div>
              <div className="text-xl md:text-2xl font-bold text-white mt-1">
                0{summary.active_missions_count || 4}
              </div>
              <div className="text-[10px] text-secondary mt-0.5">1 Pending Sign-off</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] text-muted uppercase">AVAILABLE TEAMS</div>
              <div className="text-xl md:text-2xl font-bold text-emerald-400 mt-1">
                {summary.active_rescue_teams_count || 12}
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">NDRF / SDRF / Boats</div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          18. COMMANDER APPROVAL CALLOUT (HITL Core Requirement)
          ===================================================================== */}
      {pendingMission && (
        <div className="p-4 md:p-5 rounded-xl liquid-glass border border-red-500/40 bg-red-950/20 emergency-breathe flex flex-col md:flex-row md:items-center justify-between gap-4 animate-blur-fade-up">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
                  ACTION REQUIRED: COMMANDER AUTHORIZATION (HITL)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-mono text-[9px] font-bold">
                  PRIORITY 1
                </span>
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                AI Recommendation: Dispatch {pendingMission.team_name} to Zone 7
              </div>
              <div className="text-xs text-secondary mt-0.5 font-mono">
                Reason: {pendingMission.reason} • Corridor: Canal Route R-18 (Avoids submerged H-02)
              </div>
            </div>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={() => onOpenMissionApproval(pendingMission)}
            icon={ArrowRight}
            iconPosition="right"
            className="font-bold shrink-0"
          >
            REVIEW &amp; AUTHORIZE
          </Button>
        </div>
      )}

      {/* =====================================================================
          Primary KPI Stat Grid
          ===================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard
          label="Affected Pop."
          value={summary.total_affected_population?.toLocaleString() || "295,300"}
          sublabel="Mahanadi basin"
          icon={Users}
          variant="critical"
        />
        <StatCard
          label="Critical Zones"
          value={`0${summary.critical_zones_count || 3}`}
          sublabel="High hazard"
          icon={AlertOctagon}
          variant="critical"
        />
        <StatCard
          label="Possible Victims"
          value={summary.detected_victims_count || 14}
          sublabel="Awaiting evac"
          icon={LifeBuoy}
          variant="warning"
        />
        <StatCard
          label="Response Teams"
          value={summary.active_rescue_teams_count || 12}
          sublabel="NDRF & ODRAF"
          icon={Shield}
          variant="safe"
        />
        <StatCard
          label="Active Missions"
          value={summary.active_missions_count || 4}
          sublabel="Operations live"
          icon={Activity}
          variant="intel"
        />
        <StatCard
          label="Avail. Shelters"
          value={summary.available_shelters_count || 18}
          sublabel="Cyclone bunkers"
          icon={Home}
          variant="safe"
        />
        <StatCard
          label="Blocked Roads"
          value={summary.blocked_roads_count || 4}
          sublabel="Impassable"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* =====================================================================
          13. COMMAND CENTER MAIN WORK AREA: Map + Live Intelligence
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CENTER: Large Tactical Map (2 Columns) */}
        <div className="lg:col-span-2 liquid-glass rounded-xl p-4 flex flex-col border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Live Tactical GIS Map Centerpiece
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("map")}
              className="text-xs font-mono text-secondary hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>FULLSCREEN GIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-[480px] w-full rounded-lg overflow-hidden border border-white/[0.06]">
            <DisasterMap
              zones={summary.zones}
              incidents={summary.recent_incidents}
              roads={summary.roads || []}
              hospitals={summary.hospitals || []}
              shelters={summary.shelters || []}
              rescueTeams={summary.rescue_teams || []}
              activeRoute={[
                [20.28, 86.2],
                [20.24, 86.28],
                [20.22, 86.34],
                [20.2, 86.39],
                [20.19, 86.43]
              ]}
              onSelectIncident={(inc) => setSelectedIncidentForDrawer(inc)}
            />
          </div>
        </div>

        {/* RIGHT: Live Intelligence & Priority Incident Queue */}
        <div className="space-y-4">
          {/* Priority Incidents Board */}
          <div className="liquid-glass rounded-xl p-4 border border-white/[0.08]">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Priority Incidents Console
              </div>
              <button
                type="button"
                onClick={() => onNavigate("incidents")}
                className="text-xs font-mono text-secondary hover:text-white transition-colors"
              >
                VIEW ALL
              </button>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {summary.recent_incidents?.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncidentForDrawer(inc)}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <Badge level={inc.priority} size="sm" />
                    <span className="text-[10px] font-mono text-secondary">{inc.zone_name}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                    {inc.title}
                  </div>
                  <div className="text-[10px] font-mono text-muted mt-1 flex items-center justify-between">
                    <span>Possible victims: {inc.possible_victims}</span>
                    <span className="text-white uppercase font-bold">{inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Alert Broadcast Feed */}
          <div className="liquid-glass rounded-xl p-4 border border-white/[0.08]">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Live Alert Broadcasts
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE STREAM
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {summary.recent_alerts?.map((alt) => (
                <div
                  key={alt.id}
                  className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <Badge level={alt.type} size="sm" />
                    <span className="text-[10px] font-mono text-muted">{alt.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">{alt.title}</div>
                  <div className="text-[11px] text-secondary font-mono mt-0.5 leading-snug">
                    {alt.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          28. BOTTOM: INCIDENT TIMELINE & RECENT ACTIONS
          ===================================================================== */}
      <div className="liquid-glass rounded-xl p-4 md:p-5 border border-white/[0.08]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Disaster Chronology &amp; Incident Event Stream
            </h3>
          </div>
          <span className="text-[10px] font-mono text-muted">WebSockets Synchronized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-muted text-[10px]">12:40 TELEMETRY</div>
            <div className="text-white font-medium mt-1">Flood gauge surge +1.8m above danger mark</div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-muted text-[10px]">12:42 CUTOFF</div>
            <div className="text-white font-medium mt-1">Access Road R-17 washed out; culvert failed</div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-muted text-[10px]">12:44 RECOG</div>
            <div className="text-white font-medium mt-1">14 trapped rooftop victims detected by drone</div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="text-muted text-[10px]">12:46 HITL SIGN</div>
            <div className="text-emerald-400 font-medium mt-1">Squad RESCUE-04 authorized via Canal R-18</div>
          </div>
        </div>
      </div>

      {/* Incident Detail Drawer */}
      <IncidentDrawer
        incident={selectedIncidentForDrawer}
        isOpen={!!selectedIncidentForDrawer}
        onClose={() => setSelectedIncidentForDrawer(null)}
        onApproveMission={() => {
          if (pendingMission) onOpenMissionApproval(pendingMission);
          setSelectedIncidentForDrawer(null);
        }}
        onRejectMission={() => setSelectedIncidentForDrawer(null)}
        onNavigateToMap={() => {
          setSelectedIncidentForDrawer(null);
          onNavigate("map");
        }}
      />
    </div>
  );
};

export { DashboardPage };
