import { useState, useEffect } from "react";
import { ShieldAlert, Activity, Clock } from "lucide-react";

const Navbar = ({
  disaster,
  activeSimulationStep = 0,
  simulationRunning = false
}) => {
  const [timeMode, setTimeMode] = useState(() => {
    try {
      return localStorage.getItem("disasteriq_time_mode") || "local_24";
    } catch {
      return "local_24";
    }
  });

  const [timeData, setTimeData] = useState({
    time: "",
    tz: "LOCAL",
    date: ""
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");

      let tz = "LOCAL";
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (timeZone.includes("Calcutta") || timeZone.includes("Kolkata") || timeZone === "IST") {
          tz = "IST";
        } else {
          const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(now);
          const tzPart = parts.find((p) => p.type === "timeZoneName");
          tz = tzPart?.value || timeZone || "LOCAL";
        }
      } catch {
        tz = "LOCAL";
      }

      let timeFormatted = "";
      if (timeMode === "utc") {
        timeFormatted = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
        tz = "UTC";
      } else if (timeMode === "local_12") {
        timeFormatted = now.toLocaleTimeString([], {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } else {
        // Default local_24: Real-time 24-hour matching user's system clock
        timeFormatted = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      }

      setTimeData({
        time: timeFormatted,
        tz,
        date: now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timeMode]);

  const toggleTimeMode = () => {
    const modes = ["local_24", "local_12", "utc"];
    const nextIndex = (modes.indexOf(timeMode) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    setTimeMode(nextMode);
    try {
      localStorage.setItem("disasteriq_time_mode", nextMode);
    } catch {
      // ignore
    }
  };

  return (
    <header className="h-16 bg-command-panel border-b border-command-border px-4 md:px-6 flex items-center justify-between select-none z-40 sticky top-0">
      {/* Brand & Platform Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-red-950/80 border border-red-500/80 rounded-lg flex items-center justify-center text-red-500 shadow-lg shadow-red-900/30">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-base text-white">
              DISASTER<span className="text-red-500">IQ</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-blue-400">
              AI Command Center
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
            "From disaster data to intelligent action."
          </div>
        </div>
      </div>

      {/* Center: Disaster Active Status Badge */}
      {disaster && (
        <div className="hidden lg:flex items-center gap-2 bg-command-bg/90 border border-command-border px-3 py-1 rounded-full text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-bold text-red-400">{disaster.type}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">{disaster.location.split(",")[0]}</span>
          <span className="text-slate-600">|</span>
          <span className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 text-[10px] font-bold border border-red-500/40">
            {disaster.severity}
          </span>
        </div>
      )}

      {/* Right Controls: Telemetry, Simulation Status, Time */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Simulation Indicator */}
        {simulationRunning && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span className="font-bold">SIMULATION ACTIVE (STEP {activeSimulationStep}/7)</span>
          </div>
        )}

        {/* Live Pulse Beacon */}
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wider">LIVE</span>
        </div>

        {/* Real-time Digital Clock Badge */}
        <button
          type="button"
          onClick={toggleTimeMode}
          title={`Real-time Clock: ${timeData.date} • Click to toggle (Local 24h / Local 12h / UTC)`}
          className="hidden sm:flex items-center gap-2 text-slate-200 bg-command-bg hover:bg-slate-800/80 border border-command-border hover:border-cyan-500/50 px-2.5 py-1 rounded transition-all cursor-pointer select-none group"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="font-bold tracking-wider text-slate-100">{timeData.time}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 uppercase font-semibold">
            {timeData.tz}
          </span>
        </button>
      </div>
    </header>
  );
};

export { Navbar };
