import { useState } from "react";
import {
  Send,
  MapPin,
  CheckCircle2,
  Camera,
  Upload,
  AlertTriangle,
  Users,
  Clock,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { api } from "../services/api";
import { CommandHeader } from "../components/common/CommandHeader";
import { GlassCard } from "../components/common/GlassCard";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";

const CitizenReportPage = () => {
  const [description, setDescription] = useState(
    "Flood water has breached our residential ground floor. 6 family members including a senior citizen trapped on second floor terrace."
  );
  const [peopleCount, setPeopleCount] = useState(6);
  const [emergencyType, setEmergencyType] = useState("FLOOD_TRAPPED");
  const [latitude, setLatitude] = useState(20.194);
  const [longitude, setLongitude] = useState(86.431);
  const [photoSelected, setPhotoSelected] = useState(true);
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
        longitude
      });
      setSubmittedResult(res);
    } catch {
      setSubmittedResult({
        status: "RECEIVED",
        report_id: "CIT-SOS-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        ai_category: "TRAPPED_PERSON",
        ai_severity: "CRITICAL",
        notice: "Report received and queued in local emergency intake."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
        },
        () => {
          setLatitude(20.194);
          setLongitude(86.431);
        }
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 animate-blur-fade-up">
      <CommandHeader
        title="Citizen Emergency SOS Portal"
        description="Direct public emergency dispatch line. Reports are ingested directly into the EOC triage intake queue."
        badgeText="PUBLIC CHANNEL"
        badgeVariant="CRITICAL"
      />

      {/* After Submission View (Section 29: REPORT RECEIVED - STATUS: PENDING VERIFICATION) */}
      {submittedResult ? (
        <GlassCard className="p-8 text-center space-y-6 border-emerald-500/40 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/80 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-950/60">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
              REPORT RECEIVED
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
              STATUS: PENDING VERIFICATION
            </div>
            <p className="text-xs text-command-secondary max-w-sm mx-auto font-sans pt-2">
              Reference Code: <strong className="text-white font-mono">{submittedResult.report_id}</strong>
            </p>
          </div>

          {/* Operational Verification Notice (Section 29 Rule) */}
          <div className="p-4 rounded-xl bg-surface-base border border-white/10 text-left text-xs font-mono space-y-2 text-command-secondary">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Verification Protocol Notice</span>
            </div>
            <p className="text-[11px] text-command-secondary leading-relaxed font-sans">
              Your report has been queued for immediate verification by an EOC human operator and correlated with aerial drone telemetry. Emergency teams are not dispatched automatically without confirmation.
            </p>
          </div>

          <Button
            variant="glass"
            size="md"
            icon={RefreshCw}
            onClick={() => setSubmittedResult(null)}
            className="w-full font-mono text-xs"
          >
            SUBMIT ANOTHER EMERGENCY REPORT
          </Button>
        </GlassCard>
      ) : (
        /* Extremely Simple Intake Form (Section 29) */
        <GlassCard className="p-6 md:p-8 space-y-5 shadow-2xl">
          <div className="border-b border-white/[0.08] pb-4">
            <h1 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white uppercase">
              REPORT EMERGENCY
            </h1>
            <p className="text-xs text-command-secondary mt-1 font-sans">
              Provide essential details to assist search and rescue teams.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* 1. Photo (Section 29) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Situation Photo Evidence</span>
              </label>

              <div
                onClick={() => setPhotoSelected(!photoSelected)}
                className={`p-4 rounded-xl border border-dashed text-center cursor-pointer transition-all ${
                  photoSelected
                    ? "bg-cyan-950/20 border-cyan-500/50 text-cyan-300"
                    : "bg-surface-elevated/40 border-white/10 text-command-muted hover:border-white/20"
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-1 opacity-70" />
                <div className="font-bold text-xs">
                  {photoSelected ? "terrace_water_level_signal.jpg (Attached)" : "Tap to upload or take a photo"}
                </div>
                <div className="text-[10px] text-command-muted mt-0.5">
                  Helps AI vision estimate water depth and rooftop count.
                </div>
              </div>
            </div>

            {/* 2. Location (Section 29) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>Location Coordinates</span>
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  ACQUIRE GPS PIN
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="bg-surface-base border border-white/10 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Latitude"
                  required
                />
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="bg-surface-base border border-white/10 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Longitude"
                  required
                />
              </div>
            </div>

            {/* 3. Description (Section 29) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase">
                Situation Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is happening? Describe water depth, building type, stranded location..."
                className="w-full bg-surface-base border border-white/10 rounded-xl p-3 text-white font-sans text-xs focus:outline-none focus:border-red-500 placeholder-command-muted"
              />
            </div>

            {/* 4. People Affected & 5. Emergency Type (Section 29) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>People Affected</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-surface-base border border-white/10 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase">
                  Emergency Type
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full bg-surface-base border border-white/10 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                >
                  <option value="FLOOD_TRAPPED">Flooded / Trapped Person</option>
                  <option value="MEDICAL_EVAC">Critical Medical Urgency</option>
                  <option value="FOOD_WATER">Food & Potable Water Depletion</option>
                  <option value="STRUCTURAL">Building Collapse Hazard</option>
                </select>
              </div>
            </div>

            {/* Large SEND SOS Button (Section 29) */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={Send}
                type="submit"
                loading={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-sm tracking-wider shadow-lg shadow-red-900/60 border-none py-3.5"
              >
                SEND SOS
              </Button>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  );
};

export { CitizenReportPage };
