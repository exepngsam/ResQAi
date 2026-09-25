import { useState } from "react";
import { ShieldAlert, CheckCircle, XCircle, UserCheck } from "lucide-react";
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
  if (!isOpen) return null;
  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(mission.id, officerName);
    setIsSubmitting(false);
    onClose();
  };
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a commander rejection reason.");
      return;
    }
    setIsSubmitting(true);
    await onReject(mission.id, rejectReason);
    setIsSubmitting(false);
    onClose();
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"><div className="bg-command-panel border-2 border-red-500/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl shadow-red-950/50 text-slate-100 animate-in fade-in zoom-in-95 duration-200">{
    /* Header */
  }<div className="flex items-center gap-3 border-b border-command-border pb-4"><div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500 flex items-center justify-center text-red-400"><ShieldAlert className="w-6 h-6 animate-pulse" /></div><div><div className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
              Human-in-the-Loop Authorization Required
            </div><h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Mission Dispatch: {mission.id}</h3></div></div>{
    /* AI Recommendation Summary */
  }<div className="mt-4 p-4 rounded-xl bg-command-bg border border-command-border"><div className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
            AI Operational Recommendation:
          </div><div className="text-base font-semibold text-white">
            Deploy <span className="text-cyan-400">{mission.team_name}</span> to{" "}<span className="text-red-400">{mission.zone_id}</span></div><div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 font-mono space-y-1.5"><div className="font-bold text-amber-400">Explainable Rationale:</div><div>• {mission.reason}</div><div>• Target Coordinates: [{mission.destination.join(", ")}]</div><div>• Estimated Travel Time: ~{mission.estimated_eta_min} min via Route {mission.recommended_route_id}</div></div></div>{
    /* Officer Signature Input */
  }{!showRejectInput ? <div className="mt-4 space-y-1.5 font-mono text-xs"><label className="text-slate-400 flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-emerald-400" />
              Authorizing Officer Name / Credentials:
            </label><input
    type="text"
    value={officerName}
    onChange={(e) => setOfficerName(e.target.value)}
    className="w-full bg-command-bg border border-command-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono text-xs"
  /></div> : <div className="mt-4 space-y-1.5 font-mono text-xs"><label className="text-red-400 font-bold">Reason for Rejection / Alternative Tactic:</label><textarea
    rows={2}
    value={rejectReason}
    onChange={(e) => setRejectReason(e.target.value)}
    placeholder="e.g., Prioritizing adjacent embankment repair; reallocating aerial unit..."
    className="w-full bg-command-bg border border-red-500/80 rounded-lg p-2.5 text-white focus:outline-none font-mono text-xs"
  /></div>}{
    /* Action Buttons */
  }<div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-command-border"><button
    type="button"
    onClick={onClose}
    className="px-4 py-2 rounded-lg bg-command-bg hover:bg-command-hover text-slate-400 text-xs font-mono transition-colors"
  >
            CANCEL
          </button>{!showRejectInput ? <><button
    type="button"
    onClick={() => setShowRejectInput(true)}
    className="px-4 py-2 rounded-lg border border-red-500/50 hover:bg-red-950/40 text-red-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
  ><XCircle className="w-4 h-4" />
                REJECT
              </button><button
    type="button"
    disabled={isSubmitting}
    onClick={handleApprove}
    className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
  ><CheckCircle className="w-4 h-4" />{isSubmitting ? "AUTHORIZING..." : "APPROVE MISSION"}</button></> : <button
    type="button"
    disabled={isSubmitting}
    onClick={handleReject}
    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
  >
              CONFIRM REJECTION
            </button>}</div></div></div>;
};
export {
  ApprovalModal
};
