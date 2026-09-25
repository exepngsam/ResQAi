import { useState, useEffect } from "react";
import {
  Layers,
  Eye,
  EyeOff,
  Navigation,
  AlertOctagon,
  Key
} from "lucide-react";
import { DisasterMap } from "../components/map/DisasterMap";
import { Badge } from "../components/common/Badge";
import { MapApiKeyModal } from "../components/map/MapApiKeyModal";
import {
  getMapConfig,
  getTileLayerDefinition,
  subscribeMapConfig
} from "../utils/mapConfig";
const MapPage = ({
  zones,
  roads = [],
  hospitals = [],
  shelters = [],
  rescueTeams = [],
  incidents = []
}) => {
  const [selectedZone, setSelectedZone] = useState(zones[6] || null);
  const [mapConfig, setMapConfig] = useState(getMapConfig());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [layers, setLayers] = useState({
    zones: true,
    roads: true,
    hospitals: true,
    shelters: true,
    teams: true,
    victims: true,
    routes: true
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
  return <div className="relative h-[calc(100vh-8.5rem)] w-full flex flex-col lg:flex-row gap-4">{
    /* Map Viewport */
  }<div className="flex-1 h-full relative rounded-xl overflow-hidden border border-command-border"><DisasterMap
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
  />{
    /* Floating Top Bar: GIS API Key & Layer Controls */
  }<div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 max-w-xs select-none">{
    /* GIS API Key & Provider Badge / Trigger */
  }<button
    type="button"
    onClick={() => setIsApiKeyModalOpen(true)}
    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-command-panel/95 backdrop-blur-md border border-cyan-500/50 hover:border-cyan-400 text-white shadow-2xl transition-all cursor-pointer group"
  ><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-500/40 group-hover:scale-105 transition-transform"><Key className="w-3.5 h-3.5" /></div><div className="text-left font-mono"><div className="text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1"><span>GIS ENGINE &amp; API KEY</span>{mapConfig.provider !== "carto_dark" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}</div><div className="text-xs font-bold text-cyan-300 truncate max-w-[160px]">{tileDef.providerName}</div></div></div><span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 group-hover:bg-cyan-900 group-hover:text-cyan-200">
              CONFIG
            </span></button>{
    /* Layer Toggles Panel */
  }<div className="bg-command-panel/95 backdrop-blur-md border border-command-border rounded-xl p-3 shadow-2xl"><div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5 pb-2 border-b border-command-border mb-2"><Layers className="w-3.5 h-3.5 text-cyan-400" /><span>GIS Layer Toggles</span></div><div className="space-y-1.5 font-mono text-xs">{[
    { key: "zones", label: "Flood Hazard Zones" },
    { key: "roads", label: "Road Network (Open/Blocked)" },
    { key: "victims", label: "Victim Clusters & Incidents" },
    { key: "teams", label: "Rescue Teams & Boats" },
    { key: "hospitals", label: "Emergency Hospitals" },
    { key: "shelters", label: "Cyclone Shelters" },
    { key: "routes", label: "Optimized Rescue Routes" }
  ].map((layer) => {
    const active = layers[layer.key];
    return <button
      key={layer.key}
      type="button"
      onClick={() => toggleLayer(layer.key)}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left cursor-pointer ${active ? "bg-command-bg text-white" : "text-slate-500 hover:text-slate-300"}`}
    ><span>{layer.label}</span>{active ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}</button>;
  })}</div></div></div></div>{
    /* Right Telemetry Sidebar: Zone Detail Inspection & API Status */
  }<div className="w-full lg:w-96 bg-command-panel border border-command-border rounded-xl p-4 flex flex-col justify-between shadow-xl overflow-y-auto">{selectedZone ? <div><div className="flex items-center justify-between pb-3 border-b border-command-border"><div><span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Zone Telemetry Detail
                </span><h3 className="text-base font-bold text-white tracking-tight">{selectedZone.name}</h3></div><Badge level={selectedZone.risk_level} size="md" /></div><div className="mt-4 space-y-3 font-mono text-xs"><div className="p-3 rounded-lg bg-command-bg border border-command-border flex items-center justify-between"><span className="text-slate-400">Decision-Support Risk:</span><span className="text-base font-bold text-red-400">{selectedZone.risk_score} / 100</span></div><div className="p-3 rounded-lg bg-command-bg border border-command-border space-y-1.5"><div className="flex justify-between"><span className="text-slate-400">Flood Inundation Depth:</span><span className="text-white font-bold">{selectedZone.flood_depth_m} m</span></div><div className="flex justify-between"><span className="text-slate-400">Coverage Extent:</span><span className="text-white font-bold">{selectedZone.flood_coverage_pct}%</span></div><div className="flex justify-between"><span className="text-slate-400">Possible Victims:</span><span className="text-red-400 font-bold">{selectedZone.possible_victims} individuals</span></div><div className="flex justify-between"><span className="text-slate-400">Blocked Access Roads:</span><span className="text-amber-400 font-bold">{selectedZone.blocked_access_roads} corridors</span></div><div className="flex justify-between"><span className="text-slate-400">Distance to Hospital:</span><span className="text-white font-bold">{selectedZone.closest_hospital_km} km</span></div></div><div><div className="text-[11px] uppercase font-bold text-slate-400 mb-1.5">
                  Contributing Heuristic Factors:
                </div><div className="space-y-1">{selectedZone.contributing_factors.map((factor, i) => <div key={i} className="p-2 rounded bg-command-bg/70 border border-slate-800 text-slate-300">
                      • {factor}</div>)}</div></div><div className="mt-4 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 text-cyan-300"><div className="font-bold flex items-center gap-1.5 mb-1"><Navigation className="w-3.5 h-3.5" /><span>Rescue Dispatch Guidance:</span></div><div className="text-[11px] leading-relaxed text-slate-300">
                  Deploy motorized watercraft via Canal Route R-18. Avoid washed-out road R-17.
                </div></div></div></div> : <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs"><AlertOctagon className="w-8 h-8 mb-2" /><span>Click any polygon on map to inspect zone telemetry</span></div>}{
    /* Bottom GIS API Key Engine Footer */
  }<div className="pt-3 border-t border-command-border text-[10px] font-mono text-slate-400 flex items-center justify-between"><div className="truncate mr-2"><span className="text-slate-500">GIS ENGINE: </span><span className="text-cyan-400 font-bold">{tileDef.providerName}</span></div><button
    type="button"
    onClick={() => setIsApiKeyModalOpen(true)}
    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors cursor-pointer flex-shrink-0"
  ><Key className="w-3 h-3 text-cyan-400" /><span>API Keys</span></button></div></div>{
    /* GIS API Key & Provider Configuration Modal */
  }<MapApiKeyModal
    isOpen={isApiKeyModalOpen}
    onClose={() => setIsApiKeyModalOpen(false)}
    onConfigChanged={(cfg) => setMapConfig(cfg)}
  /></div>;
};
export {
  MapPage
};
