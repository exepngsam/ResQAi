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
    <aside
      className={`bg-[#08080a] border-r border-white/[0.08] flex flex-col justify-between select-none h-full z-30 shrink-0 font-sans transition-all duration-[450ms] ${
        collapsed ? "w-18" : "w-64"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Top Header & Collapse Toggle */}
      <div className="py-3 px-2.5 space-y-1">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-white/[0.06] mb-1">
          {!collapsed ? (
            <>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span>SECTORS</span>
              </div>

              <div className="flex items-center gap-1">
                {onToggleFocusMode && (
                  <button
                    type="button"
                    onClick={onToggleFocusMode}
                    title="Toggle Focus Mode (Ctrl+Shift+F)"
                    className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-muted hover:text-white ${
                      focusMode ? "text-cyan-400" : ""
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
                    className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-muted hover:text-white"
                  >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center py-1">
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-muted hover:text-white"
              >
                <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
              } rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-secondary hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-black" : item.highlight ? "text-amber-400" : "text-muted"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 absolute right-1.5 top-1.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Diagnostics */}
      <div className={`p-2.5 border-t border-white/[0.08] bg-[#050505]/80 space-y-2 ${collapsed ? "text-center" : ""}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-secondary">
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>SYNC:</span>
              </div>
              <span className="font-bold text-amber-400">{offlineQueueCount} EVT</span>
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
              <Settings className="w-3.5 h-3.5 text-muted" />
              <span>Diagnostics</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange("settings")}
            title="System Diagnostics & Settings"
            className={`w-full p-2.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              currentTab === "settings"
                ? "bg-white text-black font-semibold"
                : "text-muted hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

export { Sidebar };
