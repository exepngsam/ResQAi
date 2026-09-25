import { useState, useEffect } from "react";
import {
  Layers,
  Eye,
  EyeOff,
  Navigation,
  AlertOctagon,
  Key,
  Crosshair,
  Search,
  Compass,
  Building2,
  Home,
  Shield,
  Activity,
  Maximize2
} from "lucide-react";
import { DisasterMap } from "../components/map/DisasterMap";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { CommandHeader } from "../components/common/CommandHeader";
import { MapApiKeyModal } from "../components/map/MapApiKeyModal";
import {
  getMapConfig,
  getTileLayerDefinition,
  subscribeMapConfig
} from "../utils/mapConfig";

const MapPage = ({
  zones = [],
  roads = [],
  hospitals = [],
  shelters = [],
  rescueTeams = [],
  incidents = []
}) => {
  const [selectedZone, setSelectedZone] = useState(zones[6] || zones[0] || null);
  const [mapConfig, setMapConfig] = useState(getMapConfig());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [layers, setLayers] = useState({
    zones: true,
    roads: true,
    hospitals: true,
    shelters: true,
    teams: true,
    victims: true,
    routes: true,
    sensors: true
  });

  useEffect(() => {
    const unsub = subscribeMapConfig((cfg) => setMapConfig(cfg));
    return () => unsub();
  }, []);

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeRouteCoordinates = [
    [20.28, 86.2],
    [20.24, 86.28],
    [20.22, 86.34],
    [20.2, 86.39],
    [20.19, 86.43]
  ];

  const tileDef = getTileLayerDefinition(mapConfig);

  // Quick Action Handlers
  const handleCenterCriticalZone = () => {
    const crit = zones.find((z) => z.risk_level === "CRITICAL" || z.risk_score >= 75) || zones[0];
    if (crit) setSelectedZone(crit);
  };

  const handleFitIncidents = () => {
    if (zones[6]) setSelectedZone(zones[6]);
  };

  return (
    <div className="space-y-4 font-sans h-full flex flex-col">
      <CommandHeader
        title="Tactical GIS Operations Map"
        description="Multi-source GIS situational visualization fusing Sentinel-1 SAR imagery, flood inundation polygons, drone telemetry, and watercraft corridors."
        badge="GEOSPATIAL LIVE"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCenterCriticalZone}
              icon={Crosshair}
              iconPosition="left"
            >
              Center Critical Zone
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsApiKeyModalOpen(true)}
              icon={Key}
              iconPosition="left"
            >
              Tile Engines
            </Button>
          </div>
        }
      />

      <div className="relative flex-1 min-h-[560px] w-full flex flex-col lg:flex-row gap-4">
        {/* Map Viewport Area */}
        <div className="flex-1 h-full min-h-[480px] relative rounded-xl overflow-hidden border border-white/[0.08] liquid-glass">
          <DisasterMap
            zones={zones}
            roads={roads}
            hospitals={hospitals}
            shelters={shelters}
            rescueTeams={rescueTeams}
            incidents={incidents}
            activeRoute={layers.routes ? activeRouteCoordinates : void 0}
            onSelectZone={(z) => setSelectedZone(z)}
            layers={layers}
            mapConfig={mapConfig}
            showOverlayControls={false}
            showLegend={false}
          />

          {/* Floating Top Left Controls */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 max-w-xs select-none">
            {/* Map Search Pill */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search sector or coordinates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-8 pr-3 py-1.5 rounded-lg bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-xs text-white placeholder-muted focus:outline-none focus:border-white/30 font-mono shadow-xl"
              />
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-secondary">
              <button
                type="button"
                onClick={handleFitIncidents}
                className="px-2 py-1 rounded hover:bg-white/[0.05] hover:text-white transition-colors"
              >
                Fit Incidents
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleCenterCriticalZone}
                className="px-2 py-1 rounded hover:bg-white/[0.05] hover:text-red-400 text-red-400/90 font-bold transition-colors"
              >
                Critical Zone 07
              </button>
            </div>

            {/* Layer Toggles Panel */}
            <div className="bg-[#08080a]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl">
              <div className="text-[11px] font-mono font-bold uppercase text-white flex items-center justify-between pb-2 border-b border-white/[0.06] mb-2">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-secondary" />
                  <span>Layer Controls</span>
                </span>
                <span className="text-[9px] text-muted">LEAFLET HUD</span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                {[
                  { key: "zones", label: "Flood Hazard Polygons" },
                  { key: "roads", label: "Road Network (Open/Cutoff)" },
                  { key: "victims", label: "Incident & Victim Pins" },
                  { key: "teams", label: "Rescue Boat Squads" },
                  { key: "hospitals", label: "Trauma Hospitals" },
                  { key: "shelters", label: "Cyclone Shelters" },
                  { key: "routes", label: "Navigable Canal Routes" },
                  { key: "sensors", label: "River Telemetry Gauges" }
                ].map((layer) => {
                  const active = layers[layer.key];
                  return (
                    <button
                      key={layer.key}
                      type="button"
                      onClick={() => toggleLayer(layer.key)}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left cursor-pointer ${
                        active
                          ? "bg-white/[0.04] text-white"
                          : "text-muted hover:text-secondary"
                      }`}
                    >
                      <span className="truncate">{layer.label}</span>
                      {active ? (
                        <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-muted shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Floating Bottom Left Map Legend */}
          <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 p-2 px-3 rounded-lg bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono select-none">
            <span className="text-muted uppercase font-bold">LEGEND:</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/80" /> Critical Zone
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80" /> High Inundation
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80" /> Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Canal R-18
            </span>
          </div>
        </div>

        {/* Right Telemetry Sidebar: Zone Detail Inspection */}
        <div className="w-full lg:w-96 bg-[#08080a] border border-white/[0.08] rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-xl overflow-y-auto">
          {selectedZone ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                    Sector Telemetry Dossier
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {selectedZone.name}
                  </h3>
                </div>
                <Badge level={selectedZone.risk_level} size="md" />
              </div>

              {/* Risk Score */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between font-mono">
                <div>
                  <div className="text-[10px] text-muted uppercase">DECISION-SUPPORT RISK</div>
                  <div className="text-xs text-secondary mt-0.5">XAI Multi-Factor Model</div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-400">
                    {selectedZone.risk_score}
                  </span>
                  <span className="text-xs text-muted"> / 100</span>
                </div>
              </div>

              {/* Physical Telemetry Grid */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Flood Inundation Depth:</span>
                  <span className="text-white font-bold">{selectedZone.flood_depth_m} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Coverage Extent:</span>
                  <span className="text-white font-bold">{selectedZone.flood_coverage_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Stranded Civilians:</span>
                  <span className="text-red-400 font-bold">{selectedZone.possible_victims} individuals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Blocked Access Roads:</span>
                  <span className="text-amber-400 font-bold">{selectedZone.blocked_access_roads} corridors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Distance to Hospital:</span>
                  <span className="text-white font-bold">{selectedZone.closest_hospital_km} km</span>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <div className="text-[11px] uppercase font-bold text-white font-mono mb-2">
                  Contributing Factors:
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedZone.contributing_factors.map((factor, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-secondary text-[11px]"
                    >
                      • {factor}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactical Guidance Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs text-white">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tactical Watercraft Guidance:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-secondary font-mono">
                  Deploy motorized Zodiac boats via Canal Corridor R-18. Avoid washed-out Highway H-02 scoured culvert.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted font-mono text-xs py-12">
              <AlertOctagon className="w-8 h-8 mb-2 text-secondary" />
              <span>Click any sector on the map to inspect live telemetry</span>
            </div>
          )}

          {/* Active Engine Footer */}
          <div className="pt-3 border-t border-white/[0.08] text-[10px] font-mono text-secondary flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-muted">TILES: </span>
              <span className="text-white font-semibold">{tileDef.providerName}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            >
              <Key className="w-3 h-3 text-secondary" />
              <span>Keys</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map API Key Modal */}
      <MapApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onConfigChanged={(cfg) => setMapConfig(cfg)}
      />
    </div>
  );
};

export { MapPage };
