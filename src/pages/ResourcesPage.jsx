import { useState } from "react";
import {
  Truck,
  Users,
  Ambulance,
  LifeBuoy,
  Flame,
  Package,
  Home,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { CommandHeader } from "../components/common/CommandHeader";
import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

const ResourcesPage = ({
  rescueTeams = [],
  shelters = [],
  hospitals = [],
  ambulances = []
}) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Section 33: Resource Forecast Data (Projected Shortages)
  const resourceForecast = [
    {
      name: "Emergency Medical Kits",
      unit: "kits",
      current: 240,
      projected: 310,
      shortage: 70,
      status: "DEFICIT",
      riskLevel: "CRITICAL",
      reason: "Surge in pediatric water-borne contamination and lacerations in Zone 7."
    },
    {
      name: "Motorized Zodiac Life Rafts",
      unit: "crafts",
      current: 45,
      projected: 58,
      shortage: 13,
      status: "DEFICIT",
      riskLevel: "HIGH",
      reason: "Canal waterway extraction requires 12 additional shallow-draft hulls."
    },
    {
      name: "Potable Water Bladders (1000L)",
      unit: "bladders",
      current: 185,
      projected: 240,
      shortage: 55,
      status: "DEFICIT",
      riskLevel: "HIGH",
      reason: "Erasama municipal well salinization due to storm surge backflow."
    },
    {
      name: "Amphibious All-Terrain Trucks",
      unit: "trucks",
      current: 16,
      projected: 18,
      shortage: 2,
      status: "MODERATE",
      riskLevel: "MODERATE",
      reason: "Heavy logistics transport on partially scoured rural road beds."
    },
    {
      name: "Diesel Generator Power Units",
      unit: "units",
      current: 34,
      projected: 32,
      shortage: 0,
      status: "SURPLUS",
      riskLevel: "LOW",
      reason: "Current grid backup sufficient across primary triage shelters."
    }
  ];

  // Default fallback resources if empty
  const defaultTeams = rescueTeams.length > 0 ? rescueTeams : [
    {
      id: "RESCUE-04",
      name: "NDRF 03 Bn Flood Specialist Unit",
      type: "TEAMS",
      category: "Boats & Swift Water",
      location: "Kendrapara Forward Staging Area",
      coordinates: [20.28, 86.20],
      personnel_count: 18,
      boats_assigned: 4,
      status: "AVAILABLE",
      assignment: "Standby for Zone 7 Deployment",
      availability: "Immediate (100%)",
      equipment: ["4x Zodiac Inflatables", "OBM Motors", "Pediatric Trauma Kits"]
    },
    {
      id: "RESCUE-01",
      name: "ODRAF Rapid Disaster Unit Alpha",
      type: "TEAMS",
      category: "Swift Water Extraction",
      location: "Cuttack Outer Embankment",
      coordinates: [20.47, 85.90],
      personnel_count: 14,
      boats_assigned: 3,
      status: "ASSIGNED",
      assignment: "Active at Elderly Care Facility (INC-792)",
      availability: "Occupied (ETA 45m)",
      equipment: ["Jet Defiance Boats", "Winch Haulers"]
    },
    {
      id: "RESCUE-07",
      name: "Fire & Riverine Dewatering Unit",
      type: "FIRE_UNITS",
      category: "Dewatering & Flood Barrier",
      location: "Marsaghai Estuary Sector",
      coordinates: [20.50, 86.41],
      personnel_count: 12,
      boats_assigned: 2,
      status: "AVAILABLE",
      assignment: "Pumping station standby",
      availability: "Immediate (100%)",
      equipment: ["Submersible High-Flow Pumps", "Hydraulic Cutters"]
    },
    {
      id: "RESCUE-11",
      name: "Indian Coast Guard Coastal Air Crew",
      type: "TEAMS",
      category: "Air-Sea Winch Rescue",
      location: "Paradip Naval Air Base",
      coordinates: [20.30, 86.63],
      personnel_count: 8,
      boats_assigned: 0,
      status: "AVAILABLE",
      assignment: "Aero-medical evacuation standby",
      availability: "Immediate (15m airborne)",
      equipment: ["ALH Dhruv Helicopter", "Rescue Basket Winch"]
    }
  ];

  const defaultAmbulances = ambulances.length > 0 ? ambulances : [
    { id: "AMB-01", name: "Advanced Cardiac Care AMB-01", type: "AMBULANCES", location: "SCB Medical College", status: "AVAILABLE", assignment: "Hospital standby", availability: "Immediate" },
    { id: "AMB-02", name: "High-Clearance 4x4 AMB-02", type: "AMBULANCES", location: "Cuttack North Corridor", status: "ASSIGNED", assignment: "Transporting elderlies from Zone 4", availability: "ETA 25m" },
    { id: "AMB-03", name: "Trauma Transit Unit AMB-03", type: "AMBULANCES", location: "Jagatsinghpur HQ", status: "AVAILABLE", assignment: "Forward pre-staged", availability: "Immediate" },
    { id: "AMB-04", name: "Rural All-Terrain AMB-04", type: "AMBULANCES", location: "Kendrapara Civil Hospital", status: "AVAILABLE", assignment: "Standby for SH-12 bypass", availability: "Immediate" }
  ];

  const defaultShelters = shelters.length > 0 ? shelters : [
    {
      id: "SHELTER-01",
      name: "Erasama Cyclone & Flood Bunker",
      type: "SHELTERS",
      location: "Zone 7 Coastal Ridge",
      capacity: 900,
      occupancy: 760,
      status: "NEAR_CAPACITY",
      assignment: "Receiving evacuees from school rooftop",
      availability: "140 beds remaining",
      water_days: 3
    },
    {
      id: "SHELTER-02",
      name: "Jagatsinghpur Relief Complex",
      type: "SHELTERS",
      location: "Town Center High Ground",
      capacity: 1200,
      occupancy: 850,
      status: "AVAILABLE",
      assignment: "Open for general relief intake",
      availability: "350 beds remaining",
      water_days: 4
    }
  ];

  // Combine items for unified filtering
  const allResources = [
    ...defaultTeams.map(t => ({ ...t, kind: t.type || "TEAMS" })),
    ...defaultAmbulances.map(a => ({ ...a, kind: "AMBULANCES" })),
    ...defaultShelters.map(s => ({ ...s, kind: "SHELTERS" }))
  ];

  const filteredResources = allResources.filter(item => {
    const matchesFilter =
      activeFilter === "ALL" ||
      item.kind === activeFilter ||
      (activeFilter === "BOATS" && item.boats_assigned > 0);

    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <CommandHeader
        title="Tactical Resource & Fleet Command"
        description="Monitor deployment status, locations, assignments, and projected supply shortages across the disaster theater."
        badgeText="FLEET SYNCHRONIZED"
        badgeVariant="LOW"
      />

      {/* Section 33: Resource Shortage Projection Card */}
      <GlassCard className="p-6 border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Predictive Resource Shortage Forecast
              </h2>
            </div>
            <p className="text-xs text-command-secondary mt-1 font-sans">
              Algorithmic projection based on flood expansion rate, displaced civilian velocity, and triage intake trends.
            </p>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
            PROJECTION ONLY — NOT A GUARANTEED DEFICIT
          </span>
        </div>

        {/* Shortage Metrics Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {resourceForecast.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2 transition-all ${
                item.shortage > 0
                  ? "bg-red-950/20 border-red-500/40 shadow-lg shadow-red-950/20"
                  : "bg-surface-elevated/40 border-white/[0.06] text-command-secondary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs truncate">{item.name}</span>
                <Badge variant={item.riskLevel} text={item.status} />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-command-secondary text-[11px]">
                  Current: <strong className="text-white">{item.current}</strong> {item.unit}
                </div>
                <div className="text-command-secondary text-[11px]">
                  Projected: <strong className="text-white">{item.projected}</strong>
                </div>
              </div>

              {item.shortage > 0 ? (
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs pt-1 border-t border-red-500/20">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Projected Shortage: -{item.shortage} {item.unit}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs pt-1 border-t border-white/[0.06]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Adequate Reserve Buffer</span>
                </div>
              )}

              <p className="text-[10px] text-command-muted font-sans leading-snug pt-1">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Filter and Search Bar (Section 24) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex bg-surface-elevated/80 border border-white/10 rounded-xl p-1 gap-1 overflow-x-auto">
          {[
            { id: "ALL", label: "ALL FLEET" },
            { id: "TEAMS", label: "RESCUE TEAMS" },
            { id: "AMBULANCES", label: "AMBULANCES" },
            { id: "BOATS", label: "BOATS & CRAFTS" },
            { id: "FIRE_UNITS", label: "FIRE UNITS" },
            { id: "SHELTERS", label: "SHELTERS" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                activeFilter === tab.id
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "text-command-secondary hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-command-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name or sector..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-elevated border border-white/10 text-xs font-mono text-white placeholder-command-muted focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Resource Inventory Grid (Section 24) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {filteredResources.map((res) => (
          <GlassCard key={res.id} className="p-4 space-y-3">
            {/* Card Top */}
            <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-2.5">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase">{res.id}</span>
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{res.name}</h3>
              </div>
              <Badge
                variant={res.status === "AVAILABLE" ? "LOW" : res.status === "ASSIGNED" ? "HIGH" : "MODERATE"}
                text={res.status}
              />
            </div>

            {/* Location & Coordinates */}
            <div className="space-y-1.5 text-command-secondary">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-white truncate">{res.location}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-command-muted">
                <span>Current Assignment:</span>
                <strong className="text-white truncate max-w-[160px]">{res.assignment}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-command-muted">
                <span>Field Availability:</span>
                <strong className="text-emerald-400">{res.availability}</strong>
              </div>
            </div>

            {/* Equipment or Capacity Pills */}
            {res.equipment && (
              <div className="pt-2 border-t border-white/[0.04] text-[10px] text-command-muted">
                Equipment: <span className="text-command-secondary">{res.equipment.join(" • ")}</span>
              </div>
            )}

            {res.capacity && (
              <div className="pt-2 border-t border-white/[0.04] text-[11px] flex items-center justify-between">
                <span className="text-command-muted">Beds Occupied:</span>
                <span className="text-white font-bold">{res.occupancy} / {res.capacity} ({Math.round((res.occupancy / res.capacity) * 100)}%)</span>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export { ResourcesPage };
