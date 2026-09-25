import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Activity,
  Clock,
  Bell,
  Menu,
  X,
  User,
  Radio,
  Map,
  AlertTriangle,
  Send,
  Boxes,
  BarChart3,
  Bot,
  Play
} from "lucide-react";

const Navbar = ({
  disaster,
  activeSimulationStep = 0,
  simulationRunning = false,
  currentTab = "dashboard",
  onTabChange,
  onOpenAlerts,
  unreadAlertsCount = 3,
  onOpenIntro
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navItems = [
    { id: "dashboard", label: "Command Center" },
    { id: "map", label: "Live Map" },
    { id: "incidents", label: "Incidents" },
    { id: "missions", label: "Missions" },
    { id: "resources", label: "Resources" },
    { id: "analytics", label: "Analytics" }
  ];

  return (
    <>
      <header className="h-16 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] px-4 md:px-8 flex items-center justify-between select-none z-40 sticky top-0 font-sans">
        {/* LEFT: RESQAI Logo + System Online */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => onTabChange && onTabChange("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-600/90 border border-red-500/80 flex items-center justify-center text-white shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tighter text-base text-white">
                RESQ<span className="text-red-500">AI</span>
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* CENTER: Primary Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-lg">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange && onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-secondary hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Status, Alerts, Time, Commander */}
        <div className="flex items-center gap-3">
          {/* Simulation Active pill if running */}
          {simulationRunning && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>SIMULATION ACTIVE ({activeSimulationStep}/7)</span>
            </div>
          )}

          {/* Live Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE</span>
          </div>

          {/* Real-time Clock Toggle Button */}
          <button
            type="button"
            onClick={toggleTimeMode}
            title={`Real-time Clock: ${timeData.date} • Click to toggle (Local 24h / Local 12h / UTC)`}
            className="hidden sm:flex items-center gap-2 text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none font-mono"
          >
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span className="font-bold tracking-wider text-xs">{timeData.time}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-white uppercase font-semibold">
              {timeData.tz}
            </span>
          </button>

          {/* Alerts Center Trigger */}
          <button
            type="button"
            onClick={onOpenAlerts}
            title="Live Alert Center"
            className="relative p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-secondary hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-mono font-bold flex items-center justify-center border border-[#050505] animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Commander Profile Trigger */}
          <button
            type="button"
            onClick={() => onTabChange && onTabChange("settings")}
            title="Commander Settings & Profile"
            className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-secondary hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white">
              <User className="w-3 h-3" />
            </div>
            <span className="hidden md:inline font-medium">CMD. SHARMA</span>
          </button>

          {/* Mobile Hamburger with Animated Menu -> X Transition (Requirement #11) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white transition-transform duration-500 cursor-pointer"
          >
            <div className={`transition-all duration-500 transform ${mobileMenuOpen ? "rotate-180 scale-90" : "rotate-0 scale-100"}`}>
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-30 bg-[#08080a] border-b border-white/10 p-4 shadow-2xl space-y-2 animate-fade-in font-sans">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.06]">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (onTabChange) onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-xs font-medium text-left transition-all ${
                  currentTab === item.id
                    ? "bg-white text-black font-bold"
                    : "bg-white/[0.02] text-secondary hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted">
            <span>CLOCK: {timeData.time} ({timeData.tz})</span>
            <button
              type="button"
              onClick={() => {
                if (onOpenIntro) onOpenIntro();
                setMobileMenuOpen(false);
              }}
              className="text-white hover:underline"
            >
              Replay Intro
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export { Navbar };
