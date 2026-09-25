import { PlayCircle, ArrowRight } from "lucide-react";
import { SimulationBar } from "../components/simulation/SimulationBar";
const SimulationPage = ({
  running,
  step,
  maxSteps,
  speed,
  onStart,
  onPause,
  onReset,
  onNavigate
}) => {
  const demoScenes = [
    {
      step: 1,
      title: "Scene 1 & 2: Early Warning & Inundation Surge",
      desc: "Mahanadi river gauge telemetry spikes above danger mark. Flood waters rapidly expand across low-lying delta sectors.",
      action: "Click START SIMULATION to initiate deterministic scenario.",
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
      desc: "System recommends dispatching RESCUE-04. Commander opens approval dialog to review reasoning and click APPROVE.",
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
  return <div className="space-y-6">{
    /* Simulation Controls Header */
  }<SimulationBar
    running={running}
    step={step}
    maxSteps={maxSteps}
    speed={speed}
    onStart={onStart}
    onPause={onPause}
    onReset={onReset}
  /><div className="p-6 rounded-2xl bg-command-panel border border-command-border shadow-xl"><h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><PlayCircle className="w-5 h-5 text-amber-400" /><span>3-Minute SIH Demo Orchestrator (Deterministic Script)</span></h3><p className="text-xs text-slate-400 font-mono mt-1">
          Follow the step-by-step workflow below to showcase the end-to-end intelligence pipeline to hackathon judges.
        </p>{
    /* Step-by-Step Scenes */
  }<div className="mt-6 space-y-3 font-mono text-xs">{demoScenes.map((scene) => {
    const isCurrent = step === scene.step;
    const isCompleted = step > scene.step;
    return <div
      key={scene.step}
      className={`p-4 rounded-xl border transition-all ${isCurrent ? "bg-amber-950/20 border-amber-500/80 shadow-lg shadow-amber-950/20" : isCompleted ? "bg-command-bg/40 border-emerald-500/40 text-slate-300" : "bg-command-bg border-command-border text-slate-500"}`}
    ><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div className="flex items-center gap-3"><span
      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${isCurrent ? "bg-amber-500 text-black animate-pulse" : isCompleted ? "bg-emerald-950 text-emerald-400 border border-emerald-500" : "bg-slate-800 text-slate-400"}`}
    >{isCompleted ? "\u2713" : scene.step}</span><div><div className={`font-bold text-sm ${isCurrent ? "text-amber-400" : isCompleted ? "text-white" : "text-slate-400"}`}>{scene.title}</div><div className="text-slate-300 mt-0.5 text-xs">{scene.desc}</div></div></div><div className="flex items-center gap-2 self-end sm:self-center"><button
      type="button"
      onClick={() => onNavigate(scene.tabLink)}
      className="px-3 py-1.5 rounded-lg bg-command-panel hover:bg-command-hover text-cyan-400 border border-command-border flex items-center gap-1.5 text-[11px] font-bold transition-colors cursor-pointer"
    >
                      VIEW PAGE <ArrowRight className="w-3 h-3" /></button></div></div><div className="mt-2 pl-10 text-[11px] text-slate-400"><strong className="text-slate-300">Action:</strong> {scene.action}</div></div>;
  })}</div></div></div>;
};
export {
  SimulationPage
};
