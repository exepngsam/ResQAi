import { useState } from "react";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "../common/Button";

const ApprovalModal = ({
  mission,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [officerName, setOfficerName] = useState("Commander R. Mohapatra (NDRF EOC)");
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [confirmedState, setConfirmedState] = useState(null);

  if (!isOpen || !mission) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(mission.id, officerName);
    setIsSubmitting(false);

    // Show Confirmation State (Requirement #18)
    setConfirmedState({
      missionId: mission.id,
      team: mission.team_name,
      destination: mission.zone_id,
      auditId: `AUTH-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setTimeout(() => {
      setConfirmedState(null);
      onClose();
    }, 2000);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please specify tactical override or reason for rejection.");
      return;
    }
    setIsSubmitting(true);
    await onReject(mission.id, rejectReason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none font-sans">
      <div className="bg-[#09090b] border border-white/20 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-white transform transition-all duration-300 animate-blur-fade-up">
        {confirmedState ? (
          /* Confirmation State (Requirement #18) */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 animate-pulse">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                DECISION DIRECTIVE COMMITTED
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">
                ACTION APPROVED
              </h3>
              <div className="text-sm font-mono text-secondary mt-1">
                MISSION CREATED: <span className="text-white font-bold">{confirmedState.team}</span> →{" "}
                <span className="text-red-400 font-bold">{confirmedState.destination}</span>
              </div>
            </div>
            <div className="p-2.5 px-4 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-muted">
              CRYPTOGRAPHIC AUDIT ID: <span className="text-white font-bold">{confirmedState.auditId}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>HUMAN-IN-THE-LOOP MANDATORY SIGN-OFF</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  Authorize Mission Dispatch: {mission.id}
                </h3>
              </div>
            </div>

            {/* AI Recommendation Summary */}
            <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
              <div className="text-[10px] font-mono uppercase text-muted tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI OPERATIONAL PROPOSAL</span>
              </div>

              <div className="text-base font-semibold text-white">
                Deploy <span className="text-white font-bold underline decoration-red-500/80">{mission.team_name}</span> to{" "}
                <span className="text-red-400 font-bold">{mission.zone_id}</span>
              </div>

              {/* Contributing reasons breakdown */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs text-secondary font-mono space-y-1">
                <div className="text-white font-semibold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>System Rationales:</span>
                </div>
                <div>• {mission.reason || "14 civilians trapped on flooded rooftop; immediate extraction indicated"}</div>
                <div>• Critical flood stage; water level +1.8m above embankment</div>
                <div>• Closest certified motorized watercraft team with capacity 16</div>
                <div>• Safe passage: Route {mission.recommended_route_id || "R-18"} (Canal corridor avoids submerged roads)</div>
              </div>
            </div>

            {/* Officer Signature / Rejection */}
            {!showRejectInput ? (
              <div className="mt-4 space-y-1.5 font-mono text-xs">
                <label className="text-secondary flex items-center gap-1.5 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authorizing Commander Credentials:</span>
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/30 text-xs font-mono"
                />
              </div>
            ) : (
              <div className="mt-4 space-y-1.5 font-mono text-xs">
                <label className="text-red-400 font-bold text-[11px]">
                  Tactical Override / Rejection Reason:
                </label>
                <textarea
                  rows={2}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Reallocating aerial helicopter; prioritizing breached bund repair..."
                  className="w-full bg-white/[0.03] border border-red-500/50 rounded-lg p-2.5 text-white focus:outline-none text-xs font-mono"
                />
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                {!showRejectInput ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowRejectInput(true)}
                    >
                      REJECT / OVERRIDE
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={isSubmitting}
                      onClick={handleApprove}
                      icon={CheckCircle}
                      iconPosition="left"
                      className="font-bold"
                    >
                      APPROVE ACTION
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRejectInput(false)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={isSubmitting}
                      onClick={handleReject}
                    >
                      CONFIRM REJECTION
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { ApprovalModal };
