import { useState } from "react";
import {
  AlertCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Users,
  MapPin,
  Shield,
  ArrowRight,
  Radio,
  Eye
} from "lucide-react";
import { CommandHeader } from "../components/common/CommandHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { IncidentDrawer } from "../components/common/IncidentDrawer";

const IncidentsPage = ({
  incidents = [],
  timelineEvents = [],
  onOpenApproval
}) => {
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("urgency");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Filter
  const filtered = incidents.filter((inc) => {
    let matchPriority = true;
    if (priorityFilter === "CRITICAL") matchPriority = inc.priority === "P1";
    else if (priorityFilter === "HIGH") matchPriority = inc.priority === "P2";
    else if (priorityFilter === "MEDIUM") matchPriority = inc.priority === "P3";
    else if (priorityFilter === "RESOLVED") matchPriority = inc.status === "RESOLVED";

    const matchSearch =
      (inc.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.zone_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.id || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchPriority && matchSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "urgency") {
      const order = { P1: 4, P2: 3, P3: 2, P4: 1 };
      return (order[b.priority] || 0) - (order[a.priority] || 0);
    }
    if (sortBy === "people") {
      return (b.possible_victims || 0) - (a.possible_victims || 0);
    }
    if (sortBy === "location") {
      return (a.zone_name || "").localeCompare(b.zone_name || "");
    }
    return 0;
  });

  return (
    <div className="space-y-6 font-sans">
      <CommandHeader
        title="Incident Triage Console"
        description="Real-time multi-source emergency incident queues with explainable heuristic risk scoring and tactical authorization."
        badge="LIVE INCIDENTS"
        lastUpdated="Just now"
      />

      {/* Filter and Control Bar */}
      <div className="liquid-glass rounded-xl p-3 md:p-4 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search incident ID, sector, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white placeholder-muted focus:outline-none focus:border-white/30 font-mono"
          />
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white/[0.02] border border-white/[0.06] rounded-lg text-xs font-mono">
          {[
            { id: "ALL", label: "All" },
            { id: "CRITICAL", label: "Critical" },
            { id: "HIGH", label: "High" },
            { id: "MEDIUM", label: "Medium" },
            { id: "RESOLVED", label: "Resolved" }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPriorityFilter(item.id)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                priorityFilter === item.id
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-secondary hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs font-mono text-secondary">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/[0.04] border border-white/10 text-white rounded-md px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value="urgency" className="bg-[#09090b]">Urgency (P1 → P4)</option>
            <option value="people" className="bg-[#09090b]">Affected People</option>
            <option value="location" className="bg-[#09090b]">Location</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Incident Queue + Live Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents List (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          {sorted.length === 0 ? (
            <div className="liquid-glass rounded-xl p-8 border border-white/[0.08] text-center text-secondary font-mono text-xs">
              No incidents matching the active filter criteria.
            </div>
          ) : (
            sorted.map((inc) => (
              <div
                key={inc.id}
                className="liquid-glass rounded-xl p-4 md:p-5 border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex flex-col justify-between gap-3 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge level={inc.priority} size="sm" />
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {inc.id}
                      </span>
                      <span className="text-secondary">•</span>
                      <span className="text-xs font-mono text-secondary flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted" />
                        {inc.zone_name}
                      </span>
                      <span className="text-[10px] font-mono text-muted">
                        [{inc.reported_at || "8 min ago"}]
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-white mt-1.5 group-hover:text-emerald-400 transition-colors">
                      {inc.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white border border-white/10 font-bold uppercase shrink-0">
                    {inc.status}
                  </span>
                </div>

                {/* Description Quote */}
                <p className="text-xs text-secondary font-mono leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                  {inc.description}
                </p>

                {/* Logistics Bar & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06] text-xs font-mono">
                  <div className="flex items-center gap-4 text-muted">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-secondary" />
                      <span>Possible victims: <strong className="text-white">{inc.possible_victims}</strong></span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <span>Water depth: <strong className="text-white">{inc.water_level_m}m</strong></span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-[11px] text-muted">
                      Source: Drone + Citizen
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => setSelectedIncident(inc)}
                      icon={Eye}
                      iconPosition="left"
                      className="font-medium"
                    >
                      REVIEW DOSSIER
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Timeline (1 Col) */}
        <div className="liquid-glass rounded-xl p-4 md:p-5 border border-white/[0.08] flex flex-col h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
            <span className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>Live Disaster Timeline</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              STREAMING
            </span>
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-[580px] pr-1">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative pl-5 border-l border-white/10 pb-2">
                <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-[#050505]" />
                <div className="text-[10px] font-mono text-muted font-bold">{evt.time}</div>
                <div className="text-xs text-white font-mono mt-0.5 leading-snug">
                  {evt.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Detail Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onApproveMission={(inc) => {
          if (onOpenApproval) onOpenApproval(inc);
          setSelectedIncident(null);
        }}
      />
    </div>
  );
};

export { IncidentsPage };
