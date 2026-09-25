import { useState } from "react";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";
const SimulationBar = ({
  running,
  step,
  maxSteps,
  speed,
  onStart,
  onPause,
  onReset
}) => {
  const [selectedSpeed, setSelectedSpeed] = useState(speed || 1);
  const handleSpeedChange = (newSpeed) => {
    setSelectedSpeed(newSpeed);
    if (running) {
      onStart(newSpeed);
    }
  };
  return <div className="bg-command-panel border border-command-border rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">{
    /* Scenario Info */
  }<div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400"><Activity className="w-4 h-4 animate-spin" /></div><div><div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2"><span>ODISHA FLOOD DEMO SIMULATION</span><span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
              STEP {step} OF {maxSteps}</span></div><div className="text-[11px] text-slate-400 font-mono">{step === 0 && "Scenario initialized at baseline flood stage."}{step === 1 && "Upstream reservoir gates opened: surge flow entering delta."}{step === 2 && "Inundation expanding across coastal lowlands."}{step === 3 && "Access Road R-17 washed out; culvert scouring verified."}{step === 4 && "14 possible victims detected; autonomous reroute computed."}{step === 5 && "EOC authorizes Mission MIS-801: rescue boats en route."}{step === 6 && "Extraction underway: 10 victims secured aboard life rafts."}{step >= 7 && "Mission completed: All 14 civilians evacuated to safety."}</div></div></div>{
    /* Control Buttons */
  }<div className="flex items-center gap-2 font-mono text-xs">{
    /* Speed selectors */
  }<div className="flex items-center bg-command-bg border border-command-border rounded-lg p-0.5 mr-2">{[1, 2, 5].map((s) => <button
    key={s}
    type="button"
    onClick={() => handleSpeedChange(s)}
    className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${selectedSpeed === s ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white"}`}
  >
              ×{s}</button>)}</div>{
    /* Start / Pause / Reset */
  }{!running ? <button
    type="button"
    onClick={() => onStart(selectedSpeed)}
    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
  ><Play className="w-3.5 h-3.5 fill-current" />
            START SIMULATION
          </button> : <button
    type="button"
    onClick={onPause}
    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer"
  ><Pause className="w-3.5 h-3.5 fill-current" />
            PAUSE
          </button>}<button
    type="button"
    onClick={onReset}
    className="px-3 py-2 rounded-lg bg-command-bg hover:bg-command-hover text-slate-300 border border-command-border flex items-center gap-1.5 transition-colors cursor-pointer"
  ><RotateCcw className="w-3.5 h-3.5" />
          RESET
        </button></div></div>;
};
export {
  SimulationBar
};
