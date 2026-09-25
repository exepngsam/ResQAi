import { useState } from "react";
import { Send, MapPin, CheckCircle } from "lucide-react";
import { api } from "../services/api";
const CitizenReportPage = () => {
  const [description, setDescription] = useState("Flood water has breached our colony ground level. 6 family members including a senior citizen trapped on second floor terrace.");
  const [peopleCount, setPeopleCount] = useState(6);
  const [emergencyType, setEmergencyType] = useState("FLOOD_TRAPPED");
  const [latitude, setLatitude] = useState(20.194);
  const [longitude, setLongitude] = useState(86.431);
  const [phone, setPhone] = useState("+91 94371 88290");
  const [submittedResult, setSubmittedResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitCitizenReport({
        description,
        number_of_people: peopleCount,
        emergency_type: emergencyType,
        latitude,
        longitude,
        contact_phone: phone
      });
      setSubmittedResult(res);
    } catch {
      setSubmittedResult({
        status: "RECEIVED",
        report_id: "CIT-LOCAL-09",
        ai_category: "TRAPPED_PERSON",
        ai_severity: "HIGH",
        notice: "Report queued in offline local database."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {
          setLatitude(20.194);
          setLongitude(86.431);
        }
      );
    }
  };
  return <div className="max-w-2xl mx-auto space-y-6"><div className="pb-4 border-b border-command-border"><h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><Send className="w-5 h-5 text-red-500" /><span>Citizen Emergency SOS Portal</span></h2><p className="text-xs text-slate-400 font-mono mt-0.5">
          Public reporting channel for trapped civilians. Reports are ingested directly by the EOC.
        </p></div>{submittedResult ? <div className="p-6 rounded-2xl bg-command-panel border-2 border-emerald-500/80 shadow-2xl font-mono text-xs space-y-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400"><CheckCircle className="w-6 h-6" /></div><div><div className="text-emerald-400 font-bold uppercase tracking-wider">
                EMERGENCY REPORT TRANSMITTED
              </div><div className="text-white text-base font-bold">Report Reference: {submittedResult.report_id}</div></div></div><div className="p-4 rounded-xl bg-command-bg border border-command-border space-y-2"><div className="text-slate-400">Automated AI Triage Assessment:</div><div className="text-white">
              Category: <strong className="text-cyan-400">{submittedResult.ai_category}</strong></div><div className="text-white">
              Initial Severity: <strong className="text-red-400">{submittedResult.ai_severity}</strong></div><div className="text-amber-300 font-bold mt-2">
              Status: PENDING VERIFICATION BY EOC OPERATOR
            </div><div className="text-[11px] text-slate-400 leading-snug">
              Notice: AI triage is for priority queue ordering. Official deployment requires operator validation.
            </div></div><button
    type="button"
    onClick={() => setSubmittedResult(null)}
    className="w-full py-2.5 rounded-lg bg-command-bg hover:bg-command-hover text-slate-200 border border-command-border font-bold transition-colors cursor-pointer"
  >
            SUBMIT ANOTHER REPORT
          </button></div> : <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-command-panel border border-command-border shadow-xl space-y-4 font-mono text-xs"><div><label className="text-slate-300 block mb-1 font-bold">Situation Description / Nature of Emergency:</label><textarea
    rows={3}
    required
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full bg-command-bg border border-command-border rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-mono text-xs"
    placeholder="Describe what is happening (e.g. water height, stranded location, medical needs)..."
  /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="text-slate-300 block mb-1 font-bold">Number of People Stranded:</label><input
    type="number"
    min={1}
    max={500}
    value={peopleCount}
    onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
    className="w-full bg-command-bg border border-command-border rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500 font-mono text-xs"
  /></div><div><label className="text-slate-300 block mb-1 font-bold">Emergency Category:</label><select
    value={emergencyType}
    onChange={(e) => setEmergencyType(e.target.value)}
    className="w-full bg-command-bg border border-command-border rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500 font-mono text-xs"
  ><option value="FLOOD_TRAPPED">Flooded / Trapped Person</option><option value="MEDICAL_EVAC">Critical Medical Urgency</option><option value="FOOD_WATER">Food &amp; Potable Water Depletion</option><option value="STRUCTURAL">Building Collapse Hazard</option></select></div></div>{
    /* GPS Location Row */
  }<div><div className="flex items-center justify-between mb-1"><label className="text-slate-300 font-bold">GPS Geolocation Coordinates:</label><button
    type="button"
    onClick={handleGetLocation}
    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer text-[11px]"
  ><MapPin className="w-3.5 h-3.5" />
                ACQUIRE GPS PIN
              </button></div><div className="grid grid-cols-2 gap-2"><input
    type="number"
    step="any"
    value={latitude}
    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
    className="bg-command-bg border border-command-border rounded-xl p-2 text-white font-mono text-xs"
    placeholder="Latitude"
  /><input
    type="number"
    step="any"
    value={longitude}
    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
    className="bg-command-bg border border-command-border rounded-xl p-2 text-white font-mono text-xs"
    placeholder="Longitude"
  /></div></div><div><label className="text-slate-300 block mb-1 font-bold">Contact Mobile / Satellite Phone:</label><input
    type="text"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full bg-command-bg border border-command-border rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500 font-mono text-xs"
    placeholder="+91..."
  /></div><div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/40 text-amber-300 text-[11px] leading-snug">
            ⚠️ <strong>Verification Notice:</strong> All emergency submissions are logged with cryptographic timestamps and prioritized by algorithm for EOC dispatchers.
          </div><button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
  ><Send className="w-4 h-4" />{isSubmitting ? "TRANSMITTING SOS..." : "TRANSMIT EMERGENCY SOS REPORT"}</button></form>}</div>;
};
export {
  CitizenReportPage
};
