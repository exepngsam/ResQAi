import React from 'react';
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
  WifiOff
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  pendingMissionsCount?: number;
  criticalIncidentsCount?: number;
  offlineQueueCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  pendingMissionsCount = 1,
  criticalIncidentsCount = 2,
  offlineQueueCount = 7,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    {
      id: 'map',
      label: 'Live GIS Map',
      icon: MapIcon,
      badge: 'GIS / KEY',
      badgeColor: 'bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-[9px] font-mono font-bold'
    },
    {
      id: 'incidents',
      label: 'Incidents & Triage',
      icon: AlertOctagon,
      badge: criticalIncidentsCount > 0 ? `${criticalIncidentsCount}` : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'missions',
      label: 'Missions & Approvals',
      icon: Crosshair,
      badge: pendingMissionsCount > 0 ? `${pendingMissionsCount} HITL` : undefined,
      badgeColor: 'bg-amber-500 text-black font-bold'
    },
    { id: 'resources', label: 'Resources & Fleet', icon: Truck },
    { id: 'analytics', label: 'Progression Analytics', icon: BarChart3 },
    { id: 'copilot', label: 'DisasterIQ Copilot', icon: Bot, highlight: true },
    { id: 'reports', label: 'Situation Reports', icon: FileText },
    { id: 'simulation', label: 'Simulation Engine', icon: PlayCircle },
    { id: 'citizen-report', label: 'Citizen Reporting', icon: Send },
    { id: 'mobile-response', label: 'Responder Mobile', icon: Smartphone },
  ];

  return (
    <aside className="w-64 bg-command-panel border-r border-command-border flex flex-col justify-between select-none h-full z-30">
      {/* Navigation Links */}
      <div className="py-4 px-3 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-2">
          Operational Command
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-command-active text-white border-l-2 border-red-500 shadow-md shadow-red-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-command-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'} ${item.highlight ? 'text-cyan-400' : ''}`} />
                <span className={item.highlight ? 'text-cyan-300 font-semibold' : ''}>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status & Diagnostics */}
      <div className="p-3 border-t border-command-border bg-command-bg/50">
        {/* Offline sync queue banner */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/80 border border-slate-700/50 text-[11px] font-mono text-slate-300 mb-2">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>SYNC QUEUE:</span>
          </div>
          <span className="font-bold text-amber-400">{offlineQueueCount} EVENTS</span>
        </div>

        <button
          type="button"
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-command-active text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-command-hover'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>System Diagnostics</span>
        </button>
      </div>
    </aside>
  );
};
