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
  Radio,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2
} from "lucide-react";

const Sidebar = ({
  currentTab,
  onTabChange,
  pendingMissionsCount = 1,
  criticalIncidentsCount = 2,
  offlineQueueCount = 7,
  collapsed = false,
  onToggleCollapse,
  focusMode = false,
  onToggleFocusMode
}) => {
  const navItems = [
    { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
    {
      id: "map",
      label: "Tactical GIS Map",
      icon: MapIcon,
      badge: "LIVE",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "incidents",
      label: "Incident Triage",
      icon: AlertOctagon,
      badge: criticalIncidentsCount > 0 ? `${criticalIncidentsCount} CRIT` : undefined,
      badgeColor: "bg-red-500/15 text-red-400 border-red-500/30"
    },
    {
      id: "missions",
      label: "Missions & HITL",
      icon: Crosshair,
      badge: pendingMissionsCount > 0 ? `${pendingMissionsCount} SIGN` : undefined,
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold"
    },
    { id: "resources", label: "Fleet & Resources", icon: Truck },
    { id: "analytics", label: "Analytics & Trends", icon: BarChart3 },
    {
      id: "copilot",
      label: "ResQAI Copilot",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
    },
    { id: "reports", label: "Situation Reports", icon: FileText },
    { id: "simulation", label: "Disaster Simulation", icon: PlayCircle },
    { id: "citizen-report", label: "Citizen SOS Intake", icon: Send },
    { id: "mobile-response", label: "Responder Mobile HUD", icon: Smartphone }
  ];

  return (
    <aside
      className={`bg-[#060608] border-r border-white/[0.08] flex flex-col justify-between select-none h-full z-30 shrink-0 font-sans transition-all duration-[400ms] ${
        collapsed ? "w-18" : "w-64"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Top Header & Navigation Group */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Section Header */}
        <div className="pt-4 pb-2 px-3">
          <div className="flex items-center justify-between px-2 pb-2.5 border-b border-white/[0.06]">
            {!collapsed ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-400 font-semibold">
                    OPERATIONAL SECTORS
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  {onToggleFocusMode && (
                    <button
                      type="button"
                      onClick={onToggleFocusMode}
                      title={focusMode ? "Exit Focus Mode" : "Focus Mode (Ctrl+Shift+F)"}
                      className={`p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer ${
                        focusMode ? "text-cyan-400 bg-cyan-950/40" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onToggleCollapse && (
                    <button
                      type="button"
                      onClick={onToggleCollapse}
                      title="Collapse Sidebar"
                      className="p-1 rounded-md hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      <PanelLeftClose className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center py-0.5">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Expand Sidebar"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`relative group w-full flex items-center ${
                  collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                } rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white/[0.08] text-white font-medium border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.5)]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                {/* Active Glowing Left Accent Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-white via-white/90 to-white/50 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate tracking-tight font-sans text-[13px]">
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border tracking-wider shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot indicator */}
                {collapsed && item.badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute right-1.5 top-1.5 shadow-[0_0_4px_rgba(248,113,113,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Telemetry & Diagnostics Dock */}
      <div className="p-3 border-t border-white/[0.08] bg-[#050505]/90 space-y-2">
        {!collapsed ? (
          <>
            {/* Offline Sync Telemetry Card */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="tracking-wider">OFFLINE SYNC</span>
              </div>
              <span className="font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-[10px]">
                {offlineQueueCount} QUEUED
              </span>
            </div>

            {/* System Diagnostics Link */}
            <button
              type="button"
              onClick={() => onTabChange("settings")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                currentTab === "settings"
                  ? "bg-white/[0.08] text-white border border-white/15"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Diagnostics</span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                HEALTHY
              </span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              type="button"
              onClick={() => onTabChange("settings")}
              title="System Diagnostics & Telemetry"
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                currentTab === "settings"
                  ? "bg-white/[0.08] text-white border border-white/15"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
