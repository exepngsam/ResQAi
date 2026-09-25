import {
  LayoutDashboard,
  Map as MapIcon,
  AlertOctagon,
  Crosshair,
  Truck,
  BarChart3,
  Bot,
  FileText,
  PlayCircle,
  Smartphone,
  Send,
  Settings,
  WifiOff,
  Radio
} from "lucide-react";

const Sidebar = ({
  currentTab,
  onTabChange,
  pendingMissionsCount = 1,
  criticalIncidentsCount = 2,
  offlineQueueCount = 7
}) => {
  const navItems = [
    { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
    {
      id: "map",
      label: "Tactical GIS Map",
      icon: MapIcon,
      badge: "LIVE",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
    },
    {
      id: "incidents",
      label: "Incident Triage",
      icon: AlertOctagon,
      badge: criticalIncidentsCount > 0 ? `${criticalIncidentsCount} CRIT` : void 0,
      badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30"
    },
    {
      id: "missions",
      label: "Missions & HITL",
      icon: Crosshair,
      badge: pendingMissionsCount > 0 ? `${pendingMissionsCount} SIGN` : void 0,
      badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
    },
    { id: "resources", label: "Fleet & Resources", icon: Truck },
    { id: "analytics", label: "Analytics & Trends", icon: BarChart3 },
    { id: "copilot", label: "ResQAI Copilot", icon: Bot, highlight: true },
    { id: "reports", label: "Situation Reports", icon: FileText },
    { id: "simulation", label: "Disaster Simulation", icon: PlayCircle },
    { id: "citizen-report", label: "Citizen SOS Intake", icon: Send },
    { id: "mobile-response", label: "Responder Mobile HUD", icon: Smartphone }
  ];

  return (
    <aside className="w-60 bg-[#08080a] border-r border-white/[0.08] flex flex-col justify-between select-none h-full z-30 shrink-0 font-sans">
      {/* Navigation Group */}
      <div className="py-4 px-3 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted px-3 pb-2 flex items-center justify-between">
          <span>OPERATIONAL SECTORS</span>
          <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-secondary hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-black" : item.highlight ? "text-amber-400" : "text-muted"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Diagnostics */}
      <div className="p-3 border-t border-white/[0.08] bg-[#050505]/80 space-y-2">
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-secondary">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3 h-3 text-amber-400" />
            <span>SYNC QUEUE:</span>
          </div>
          <span className="font-bold text-amber-400">{offlineQueueCount} EVENTS</span>
        </div>

        <button
          type="button"
          onClick={() => onTabChange("settings")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            currentTab === "settings"
              ? "bg-white text-black font-semibold"
              : "text-secondary hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>System Diagnostics</span>
        </button>
      </div>
    </aside>
  );
};

export { Sidebar };
