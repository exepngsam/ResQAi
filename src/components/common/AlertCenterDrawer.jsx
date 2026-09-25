import { useState } from "react";
import {
  X,
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCheck,
  ExternalLink,
  Clock,
  ShieldAlert
} from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";

const AlertCenterDrawer = ({
  isOpen,
  onClose,
  onSelectAlert
}) => {
  const [alerts, setAlerts] = useState([
    {
      id: "ALT-901",
      level: "CRITICAL",
      title: "14 Possible Civilians Detected on Submerged Rooftop",
      location: "Zone 7, Erasama Delta",
      time: "2 min ago",
      read: false,
      targetTab: "incidents"
    },
    {
      id: "ALT-902",
      level: "CRITICAL",
      title: "Access Road R-17 Cut Off by Scoured Culvert",
      location: "Kendrapara Highway Section 4",
      time: "5 min ago",
      read: false,
      targetTab: "map"
    },
    {
      id: "ALT-903",
      level: "WARNING",
      title: "IoT River Gauge Exceeded Danger Mark (+1.8m)",
      location: "Mahanadi Delta Station 03",
      time: "8 min ago",
      read: false,
      targetTab: "analytics"
    },
    {
      id: "ALT-904",
      level: "INFO",
      title: "SCB Medical College Pre-Staged 34 Trauma Beds",
      location: "Cuttack Central Medical",
      time: "12 min ago",
      read: true,
      targetTab: "resources"
    },
    {
      id: "ALT-905",
      level: "INFO",
      title: "Squad RESCUE-04 Arrived at Zone 7 Evacuation Point",
      location: "Canal Route R-18",
      time: "18 min ago",
      read: true,
      targetTab: "missions"
    }
  ]);

  if (!isOpen) return null;

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleMarkAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const handleAlertClick = (alert) => {
    // mark as read
    setAlerts(alerts.map((a) => (a.id === alert.id ? { ...a, read: true } : a)));
    if (onSelectAlert) {
      onSelectAlert(alert);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none font-sans">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#08080a] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slide-in-right">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Live Operational Alerts
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted font-mono mt-0.5">
                  REAL-TIME DISASTER INTELLIGENCE FEED
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alert List */}
          <div className="p-5 overflow-y-auto space-y-3 flex-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-mono text-muted uppercase">
                Showing {alerts.length} Incident Signals
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-secondary hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {alerts.map((alt) => (
              <div
                key={alt.id}
                onClick={() => handleAlertClick(alt)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  !alt.read
                    ? "bg-white/[0.03] border-white/20 hover:border-white/40 shadow-sm"
                    : "bg-white/[0.01] border-white/[0.06] hover:border-white/15 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge level={alt.level} size="sm" />
                    <span className="font-mono text-[10px] text-muted">{alt.id}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 text-secondary" />
                    {alt.time}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white leading-snug">
                  {alt.title}
                </div>

                <div className="flex items-center justify-between text-[11px] text-secondary font-mono mt-2 pt-2 border-t border-white/[0.05]">
                  <span>{alt.location}</span>
                  <span className="text-white hover:underline flex items-center gap-1 text-[10px]">
                    Inspect <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#050505] flex items-center justify-between">
            <div className="text-[10px] font-mono text-muted">
              Auto-polled via WebSockets • Active
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AlertCenterDrawer };
