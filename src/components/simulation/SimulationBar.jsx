import { useState } from "react";
import { Play, Pause, RotateCcw, Activity, FastForward, Sliders } from "lucide-react";
import { Button } from "../common/Button";

const SimulationBar = ({
  running,
  step,
  maxSteps,
  speed = 1,
  onStart,
  onPause,
  onReset
}) => {
  const [selectedSpeed, setSelectedSpeed] = useState(speed);

  const handleSpeedChange = (newSpeed) => {
    setSelectedSpeed(newSpeed);
    if (running) {
      onStart(newSpeed);
    }
  };

  const stepDescriptions = [
    "Baseline: Telemetry stream monitoring delta river levels.",
    "Upstream surge: Naraj barrage release detected (+1.8m above danger).",
    "Inundation spreads: Coastal lowlands submerged across Kendrapara.",
    "Access severed: Road R-17 washed out, cutting off heavy vehicles.",
    "Detection: 14 civilians identified stranded on school rooftop.",
    "AI Recommendation: RESCUE-04 boat crew proposed via Canal R-18.",
    "Commander Authorization: Mission approved, Zodiacs en route.",
    "Resolution: All 14 civilians extracted safely to Erasama Bunker."
  ];

  return (
    <div className="liquid-glass rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Scenario Info */}
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
            running
              ? "bg-red-950/60 border-red-500/50 text-red-400 shadow-lg shadow-red-950/50 animate-pulse"
              : "bg-surface-elevated border-white/10 text-command-muted"
          }`}>
            <Activity className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                ODISHA FLOOD SIMULATION ENGINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-white/10 text-command-secondary">
                STEP {step} OF {maxSteps}
              </span>
              {running && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  SIMULATING LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-command-secondary mt-1 max-w-xl line-clamp-1 font-sans">
              {stepDescriptions[step] || stepDescriptions[0]}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          {/* Speed Selectors */}
          <div className="flex items-center bg-surface-elevated/60 border border-white/10 rounded-xl p-1">
            <span className="text-[10px] font-mono text-command-muted px-2 uppercase flex items-center gap-1">
              <FastForward className="w-3 h-3" />
              Rate:
            </span>
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedSpeed === s
                    ? "bg-white text-black shadow-md shadow-white/10"
                    : "text-command-muted hover:text-white"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          {!running ? (
            <Button
              variant="primary"
              size="md"
              icon={Play}
              onClick={() => onStart(selectedSpeed)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-900/40 border-none"
            >
              START FLOOD SIMULATION
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              icon={Pause}
              onClick={onPause}
              className="bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
            >
              PAUSE
            </Button>
          )}

          <Button
            variant="glass"
            size="md"
            icon={RotateCcw}
            onClick={onReset}
            className="text-command-secondary hover:text-white"
          >
            RESET
          </Button>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-3">
        <div className="flex-1 bg-surface-elevated rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(5, (step / maxSteps) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-command-muted shrink-0">
          {Math.round((step / maxSteps) * 100)}% COMPLETE
        </span>
      </div>
    </div>
  );
};

export { SimulationBar };
