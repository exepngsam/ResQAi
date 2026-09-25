import { useState, useEffect } from "react";
import {
  PlayCircle,
  ArrowRight,
  Sparkles,
  History,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Play,
  Pause,
  Shuffle,
  ShieldAlert,
  Compass,
  Radio
} from "lucide-react";
import { SimulationBar } from "../components/simulation/SimulationBar";
import { CommandHeader } from "../components/common/CommandHeader";
import { GlassCard } from "../components/common/GlassCard";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4";

const SimulationPage = ({
  running,
  step,
  maxSteps = 7,
  speed = 1,
  onStart,
  onPause,
  onReset,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState("SCENARIO"); // SCENARIO, WHAT_IF, REPLAY
  const [whatIfSelectedScenario, setWhatIfSelectedScenario] = useState("R17_BLOCKED");
  const [replayPlaying, setReplayPlaying] = useState(false);
  const [replayTimeOffset, setReplayTimeOffset] = useState(0); // 0 to 100%

  // Simulation Timeline events as specified in Section 28
  const timelineEvents = [
    { time: "12:40", step: 1, text: "Mahanadi basin flood detected at delta gauge telemetry (+1.8m above danger mark)", severity: "LOW", icon: Radio },
    { time: "12:41", step: 2, text: "Zone 4 (Cuttack Outer Sector) elevated to HIGH risk classification", severity: "HIGH", icon: AlertTriangle },
    { time: "12:42", step: 3, text: "Road R-17 washed out; secondary canal waterway corridor R-18 activated", severity: "CRITICAL", icon: AlertTriangle },
    { time: "12:43", step: 4, text: "14 possible civilians detected stranded on Erasama school rooftop (Drone verified)", severity: "CRITICAL", icon: ShieldAlert },
    { time: "12:44", step: 5, text: "AI Decision Engine recommends RESCUE-04 deployment (Pending Commander Authorization)", severity: "HIGH", icon: Sparkles },
    { time: "12:45", step: 6, text: "Incident Commander authorizes Mission MIS-801; mission transitions to EN ROUTE", severity: "LOW", icon: CheckCircle2 },
    { time: "12:46", step: 7, text: "Zodiac boat crew arrives on scene; extraction completed with zero casualties", severity: "LOW", icon: CheckCircle2 }
  ];

  const demoScenes = [
    {
      step: 1,
      title: "Scene 1 & 2: Early Warning & Inundation Surge",
      desc: "Mahanadi river gauge telemetry spikes above danger mark. Flood waters rapidly expand across low-lying delta sectors.",
      action: "Click START FLOOD SIMULATION to initiate deterministic scenario.",
      tabLink: "dashboard"
    },
    {
      step: 2,
      title: "Scene 3: AI Vision & Damage Assessment",
      desc: "Drone feeds and satellite SAR detect rising water levels and building inundation.",
      action: "Risk engine classifies Zone 7 as CRITICAL (Risk Score: 93/100).",
      tabLink: "map"
    },
    {
      step: 3,
      title: "Scene 4: Road Washout & Access Impediment",
      desc: "Road R-17 scoured by swift current. Standard wheeled ambulance access is blocked.",
      action: "GIS map updates corridor status to BLOCKED.",
      tabLink: "map"
    },
    {
      step: 4,
      title: "Scene 5: 14 Trapped Victims Detected & Route Optimization",
      desc: "Drone passes verify 14 individuals waving orange cloth from a school rooftop.",
      action: "Route Optimizer computes Canal Waterway Corridor R-18 (ETA 11 min).",
      tabLink: "incidents"
    },
    {
      step: 5,
      title: "Scene 6 & 7: AI Recommendation & Human-in-the-Loop Approval",
      desc: "System recommends dispatching RESCUE-04. Commander reviews explainable rationale and clicks APPROVE.",
      action: "Mission enters ACTIVE DISPATCH state only after human authorization.",
      tabLink: "missions"
    },
    {
      step: 6,
      title: "Scene 8: Live Mission Tracking & Field Rescue",
      desc: "NDRF 03 Bn motorized boats navigate canal corridor R-18 and extract stranded victims.",
      action: "Victim count drops as civilians are boarded into life rafts.",
      tabLink: "mobile-response"
    },
    {
      step: 7,
      title: "Scene 9: Incident Resolution & Situation Report",
      desc: "All 14 victims relocated safely to Erasama Relief Bunker. Zero casualties recorded.",
      action: "AI compiles comprehensive Situation Report with citations.",
      tabLink: "reports"
    }
  ];

  return (
    <div className="space-y-6">
      <CommandHeader
        title="Disaster Simulation & Tactical Replay"
        description="Run deterministic disaster scenarios, evaluate What-If stress-tests, and scrub through historic timeline events."
        badgeText={running ? "SIMULATING LIVE" : "ENGINE READY"}
        badgeVariant={running ? "CRITICAL" : "LOW"}
      />

      {/* Cinematic Simulation Hero Banner with Background Video (Section 6 & 27) */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[220px] flex items-center p-6 md:p-8">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-45 brightness-75"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            CAT-4 SUPER CYCLONE & INUNDATION SCENARIO
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Deterministic Disaster Intelligence Engine
          </h2>
          <p className="text-xs md:text-sm text-command-secondary leading-relaxed font-sans">
            Validate end-to-end tactical operations under synthetic stress. All state mutations propagate across GIS telemetry, live incident priority queues, and field responder routing in real-time.
          </p>
        </div>
      </div>

      {/* Simulation Controls Bar */}
      <SimulationBar
        running={running}
        step={step}
        maxSteps={maxSteps}
        speed={speed}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />

      {/* Mode Sub-navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex bg-surface-elevated/80 border border-white/10 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab("SCENARIO")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "SCENARIO"
                ? "bg-white text-black shadow-md shadow-white/10"
                : "text-command-secondary hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            DEMO SCENARIO (7 SCENES)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("WHAT_IF")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "WHAT_IF"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                : "text-command-secondary hover:text-white"
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            WHAT-IF SIMULATION
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("REPLAY")}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "REPLAY"
                ? "bg-amber-400 text-black shadow-md shadow-amber-400/20"
                : "text-command-secondary hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            EVENT REPLAY SCRUBBER
          </button>
        </div>

        <Badge variant="SIMULATION" text="SYNTHETIC TELEMETRY" />
      </div>

      {/* SUB-VIEW 1: DEMO SCENARIOS & EVENT TIMELINE (Sections 27 & 28) */}
      {activeSubTab === "SCENARIO" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Step-by-Step Scenes */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
                  <PlayCircle className="w-4 h-4 text-amber-400" />
                  <span>3-Minute SIH Evaluation Workflow</span>
                </div>
                <span className="text-[10px] font-mono text-command-muted">
                  STEP-BY-STEP DETERMINISTIC SEQUENCE
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                {demoScenes.map((scene) => {
                  const isCurrent = step === scene.step;
                  const isCompleted = step > scene.step;

                  return (
                    <div
                      key={scene.step}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-950/20"
                          : isCompleted
                          ? "bg-surface-elevated/40 border-emerald-500/40 text-command-secondary"
                          : "bg-surface-elevated/20 border-white/[0.06] text-command-muted opacity-70"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCurrent
                                ? "bg-amber-400 text-black animate-pulse shadow-md shadow-amber-400/30"
                                : isCompleted
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                                : "bg-white/[0.06] text-command-muted"
                            }`}
                          >
                            {isCompleted ? "✓" : scene.step}
                          </span>
                          <div>
                            <div className={`font-bold text-sm ${isCurrent ? "text-amber-400" : isCompleted ? "text-white" : "text-command-secondary"}`}>
                              {scene.title}
                            </div>
                            <div className="text-command-secondary mt-1 text-xs font-sans">
                              {scene.desc}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onNavigate(scene.tabLink)}
                          className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-white/10 text-cyan-300 border border-white/10 flex items-center gap-1.5 text-[11px] font-bold transition-all shrink-0 self-end sm:self-center"
                        >
                          OPEN PAGE <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="mt-2.5 pl-10 text-[11px] text-command-muted border-t border-white/[0.04] pt-2">
                        <strong className="text-white font-mono">Action Expected:</strong> {scene.action}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Right Col: Live Chronological Simulation Event Timeline (Section 28) */}
          <div className="space-y-4">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Simulation Event Timeline</span>
                </div>
                <Badge variant="SIMULATION" text="SECTION 28" />
              </div>

              <p className="text-[11px] text-command-muted mt-2 mb-4 font-sans">
                Dynamic state stream emitted through WebSockets as the synthetic flood progresses.
              </p>

              <div className="space-y-3 font-mono text-xs relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[1px] before:bg-white/10">
                {timelineEvents.map((ev, idx) => {
                  const isVisible = step >= ev.step;
                  const Icon = ev.icon;

                  return (
                    <div
                      key={idx}
                      className={`relative pl-7 transition-all duration-500 ${
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-25 translate-x-1"
                      }`}
                    >
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${
                        isVisible
                          ? ev.severity === "CRITICAL"
                            ? "bg-red-950 border-red-500 text-red-400 shadow-md shadow-red-950"
                            : ev.severity === "HIGH"
                            ? "bg-amber-950 border-amber-500 text-amber-400"
                            : "bg-surface-elevated border-white/20 text-emerald-400"
                          : "bg-surface-base border-white/10 text-command-muted"
                      }`}>
                        <Icon className="w-3 h-3" />
                      </div>

                      <div className="bg-surface-elevated/40 border border-white/[0.06] rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-cyan-400 font-bold text-[11px]">{ev.time}</span>
                          <Badge variant={ev.severity} text={ev.severity} />
                        </div>
                        <p className="text-white text-xs mt-1 font-sans leading-relaxed">
                          {ev.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: WHAT-IF SIMULATION (Section 32) */}
      {activeSubTab === "WHAT_IF" && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-cyan-400" />
                  <span>Advanced What-If Contingency Simulator</span>
                </h3>
                <p className="text-xs text-command-secondary mt-1 font-sans">
                  Evaluate tactical impacts before incidents occur. Stress-test road impassability, bridge closures, and asset loss against mission ETAs and casualty risks.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PROJECTION ONLY — NOT LIVE DISPATCH
              </span>
            </div>

            {/* Scenario Choosers */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "R17_BLOCKED", title: "Scenario A: Road R-17 Scoured & Submerged", desc: "Standard wheeled ambulance route severed. Water velocity 2.4 m/s." },
                { id: "BRIDGE_COLLAPSE", title: "Scenario B: Luna River Bridge Out", desc: "Cuttack-Kendrapara transit severed. Heavy truck reroute mandatory." },
                { id: "HOSPITAL_FLOOD", title: "Scenario C: Cuttack Hospital Basement Flooded", desc: "Oxygen generators offline. 28 elderly patients require aero-evacuation." }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setWhatIfSelectedScenario(s.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    whatIfSelectedScenario === s.id
                      ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg shadow-cyan-950/30"
                      : "bg-surface-elevated/40 border-white/[0.06] text-command-muted hover:text-white"
                  }`}
                >
                  <div className="font-bold text-xs font-mono">{s.title}</div>
                  <div className="text-[11px] text-command-secondary mt-1 font-sans">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Comparison Cards: CURRENT PLAN vs SIMULATED PLAN (Section 32) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Plan */}
              <div className="p-5 rounded-2xl bg-surface-elevated/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    CURRENT OPERATIONAL BASELINE
                  </span>
                  <Badge variant="LOW" text="ACTIVE PLAN" />
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-command-secondary">
                    <span>Primary Routing Vector:</span>
                    <strong className="text-white">State Highway SH-12</strong>
                  </div>
                  <div className="flex justify-between text-command-secondary">
                    <span>Estimated Response ETA:</span>
                    <strong className="text-emerald-400">18 minutes</strong>
                  </div>
                  <div className="flex justify-between text-command-secondary">
                    <span>Asset Assigned:</span>
                    <strong className="text-white">Wheeled Ambulance AMB-04</strong>
                  </div>
                  <div className="flex justify-between text-command-secondary">
                    <span>Route Safety Index:</span>
                    <strong className="text-amber-400">Moderate (54%)</strong>
                  </div>
                </div>
              </div>

              {/* Simulated Plan */}
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                  <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    SIMULATED AI CONTINGENCY PLAN
                  </span>
                  <Badge variant="CRITICAL" text="WHAT-IF REROUTE" />
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-command-secondary">
                    <span>Alternative Routing Vector:</span>
                    <strong className="text-cyan-300">Canal Waterway Corridor R-18</strong>
                  </div>
                  <div className="flex justify-between text-command-secondary">
                    <span>Projected Response ETA:</span>
                    <strong className="text-cyan-300">11 minutes (-7 min)</strong>
                  </div>
                  <div className="flex justify-between text-command-secondary">
                    <span>Re-Allocated Asset:</span>
                    <strong className="text-white">Motorized Zodiac RESCUE-04</strong>
                  </div>
                  <div className="flex justify-between text-command-secondary">
                    <span>Victim Survival Probability:</span>
                    <strong className="text-emerald-400">96.4% (+42.4%)</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-200/90 font-sans mt-3">
                  <strong>Strategic Insight:</strong> Switching from terrestrial ambulance to motorized shallow-draft inflatable boats avoids the road scour entirely and shortens extraction time by 38%.
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* SUB-VIEW 3: EVENT REPLAY SCRUBBER (Section 31) */}
      {activeSubTab === "REPLAY" && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <span>Incident Timeline Replay & Reconstruction</span>
                </h3>
                <p className="text-xs text-command-secondary mt-1 font-sans">
                  Scrub backward and forward through the disaster chronology for post-incident review and accountability.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-command-muted">EPOCH:</span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-surface-elevated px-2 py-1 rounded border border-white/10">
                  T+{Math.round(replayTimeOffset * 0.6)} MIN ({12 + Math.floor(replayTimeOffset / 60)}:{String(replayTimeOffset % 60).padStart(2, "0")})
                </span>
              </div>
            </div>

            {/* Scrubber Controls (Section 31) */}
            <div className="mt-6 p-4 rounded-xl bg-surface-elevated/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-command-muted">
                <span>12:40 (SURGE DETECTED)</span>
                <span>12:43 (CIVILIANS TRAPPED)</span>
                <span>12:46 (MISSION RESOLVED)</span>
              </div>

              {/* Slider Scrubber */}
              <input
                type="range"
                min={0}
                max={100}
                value={replayTimeOffset}
                onChange={(e) => setReplayTimeOffset(Number(e.target.value))}
                className="w-full h-2 bg-surface-base rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              {/* Playback Step Buttons: 10s, 1m, 10m */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setReplayTimeOffset((prev) => Math.max(0, prev - 10))}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-white/10 text-command-secondary border border-white/10 transition-colors"
                  >
                    -10 sec
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplayTimeOffset((prev) => Math.max(0, prev - 30))}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-white/10 text-command-secondary border border-white/10 transition-colors"
                  >
                    -1 min
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplayTimeOffset((prev) => Math.max(0, prev - 60))}
                    className="px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-white/10 text-command-secondary border border-white/10 transition-colors"
                  >
                    -10 min
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={replayPlaying ? Pause : Play}
                    onClick={() => setReplayPlaying(!replayPlaying)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold border-none"
                  >
                    {replayPlaying ? "PAUSE REPLAY" : "PLAY TIMELINE"}
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => setReplayTimeOffset(0)}
                  >
                    RESET
                  </Button>
                </div>
              </div>
            </div>

            {/* Map State Reconstruction Preview */}
            <div className="mt-4 p-4 rounded-xl bg-surface-base border border-white/[0.06] text-xs font-mono text-command-secondary flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>GIS Inundation Overlay At Scrubber Time:</span>
              </span>
              <span className="text-white font-bold">
                {replayTimeOffset < 30 ? "Stage 1 (1.8m) - Upstream Delta" : replayTimeOffset < 70 ? "Stage 2 (2.4m) - Lowlands Submerged" : "Stage 3 (3.1m) - Severe Coastal Inundation"}
              </span>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export { SimulationPage };
