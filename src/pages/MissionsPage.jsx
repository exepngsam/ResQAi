import { useState } from "react";
import {
  Crosshair,
  CheckCircle,
  Navigation,
  Clock,
  Shield,
  ArrowRight,
  Filter,
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { CommandHeader } from "../components/common/CommandHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

const MissionsPage = ({
  missions = [],
  onOpenApproval,
  onRejectMission
}) => {
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredMissions = missions.filter((m) => {
    if (statusFilter === "ALL") return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      <CommandHeader
        title="Mission Control &amp; Tasking"
        description="Operational rescue mission deployment tracking with mandatory human-in-the-loop commander sign-off."
        badge="DISPATCH ACTIVE"
      />

      {/* Filter Tabs */}
      <div className="liquid-glass rounded-xl p-3 border border-white/[0.08] flex items-center justify-between gap-3 overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {["ALL", "PENDING_APPROVAL", "APPROVED", "EN_ROUTE", "RESOLVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-secondary hover:text-white"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="text-muted text-[11px] hidden sm:block">
          Total Tasks: {missions.length}
        </div>
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isPending = mission.status === "PENDING_APPROVAL";

          return (
            <div
              key={mission.id}
              className={`p-5 rounded-xl liquid-glass border transition-all duration-300 flex flex-col justify-between gap-4 ${
                isPending
                  ? "border-red-500/40 bg-red-500/[0.02] shadow-lg shadow-red-950/20"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {mission.id}
                    </span>
                    <Badge level={mission.priority || "P1"} size="sm" />
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isPending
                        ? "bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {mission.status.replace("_", " ")}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3.5 space-y-2.5 font-mono text-xs">
                  <div className="text-sm font-bold text-white font-sans">
                    {mission.incident_title || "Rescue extraction mission"}
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted">Assigned Team:</span>
                      <span className="font-bold text-white">{mission.team_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Target Sector:</span>
                      <span className="font-bold text-red-400">{mission.zone_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Estimated ETA:</span>
                      <span className="font-bold text-white">~{mission.estimated_eta_min} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Navigable Route:</span>
                      <span className="text-secondary font-medium">Route {mission.recommended_route_id || "R-18"}</span>
                    </div>
                  </div>

                  <div className="text-xs text-secondary bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04] leading-relaxed">
                    <strong className="text-muted">Rationale:</strong> {mission.reason}
                  </div>

                  {mission.approved_by && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium pt-1">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Authorized By: {mission.approved_by} [{mission.approved_at || "12:45"}]</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2.5">
                {isPending ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onRejectMission(mission.id, "Commander manual override")}
                    >
                      REJECT
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenApproval(mission)}
                      icon={CheckCircle}
                      iconPosition="left"
                      className="font-bold"
                    >
                      AUTHORIZE DISPATCH
                    </Button>
                  </>
                ) : (
                  <span className="text-xs font-mono text-muted flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Telemetry Active • Unit En Route</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { MissionsPage };
