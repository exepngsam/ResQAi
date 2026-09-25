import React from 'react';
import { Crosshair, CheckCircle, XCircle, Clock, MapPin, ShieldAlert, Navigation } from 'lucide-react';
import { Mission } from '../types';
import { Badge } from '../components/common/Badge';

interface MissionsPageProps {
  missions: Mission[];
  onOpenApproval: (mission: Mission) => void;
  onRejectMission: (missionId: string, reason: string) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({
  missions,
  onOpenApproval,
  onRejectMission,
}) => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-command-border">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-cyan-400" />
          <span>Missions &amp; Response Orchestration</span>
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          AI decision-support recommendations with mandatory commander approval before deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission) => {
          const isPending = mission.status === 'PENDING_APPROVAL';

          return (
            <div
              key={mission.id}
              className={`p-5 rounded-xl bg-command-panel border transition-all shadow-xl flex flex-col justify-between ${
                isPending ? 'border-red-500/80 bg-red-950/10' : 'border-command-border'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-command-border">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{mission.id}</span>
                    <Badge level={mission.priority} size="sm" />
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isPending
                        ? 'bg-red-950 text-red-400 border border-red-500/50 animate-pulse'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                    }`}
                  >
                    {mission.status}
                  </span>
                </div>

                {/* Mission Details */}
                <div className="mt-3 space-y-2 font-mono text-xs">
                  <div className="text-sm font-bold text-white">{mission.incident_title}</div>
                  <div className="p-2.5 rounded bg-command-bg border border-command-border space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned Response Unit:</span>
                      <span className="font-bold text-cyan-400">{mission.team_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Destination Corridor:</span>
                      <span className="font-bold text-white">{mission.zone_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Travel ETA:</span>
                      <span className="font-bold text-amber-400">{mission.estimated_eta_min} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Navigable Vector:</span>
                      <span className="font-bold text-slate-200">Route {mission.recommended_route_id}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <strong className="text-slate-400">Decision Rationale:</strong> {mission.reason}
                  </div>

                  {mission.approved_by && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Authorized By: {mission.approved_by} [{mission.approved_at}]
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-command-border flex items-center justify-end gap-2">
                {isPending ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onRejectMission(mission.id, 'Commander tactical adjustment')}
                      className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-950/30 text-xs font-mono transition-colors cursor-pointer"
                    >
                      REJECT
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenApproval(mission)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      AUTHORIZE DISPATCH
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    Telemetric Mission Active
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
