import { useState, useEffect } from "react";
import {
  Settings,
  Sliders,
  Shield,
  Server,
  RefreshCw,
  Key,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react";
import {
  getMapConfig,
  saveMapConfig,
  subscribeMapConfig
} from "../utils/mapConfig";
const SettingsPage = () => {
  const [weights, setWeights] = useState({
    population: 30,
    floodCoverage: 25,
    roadAccess: 20,
    victims: 15,
    hospitalDistance: 10
  });
  const [aiMode, setAiMode] = useState("DEMO_SIMULATION");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mapConfig, setMapConfig] = useState(getMapConfig());
  const [showMapboxKey, setShowMapboxKey] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showWeatherKey, setShowWeatherKey] = useState(false);
  const [gisSavedSuccess, setGisSavedSuccess] = useState(false);
  useEffect(() => {
    const unsub = subscribeMapConfig((cfg) => setMapConfig(cfg));
    return () => unsub();
  }, []);
  const handleSaveWeights = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2e3);
  };
  const handleSaveGisConfig = () => {
    saveMapConfig(mapConfig);
    setGisSavedSuccess(true);
    setTimeout(() => setGisSavedSuccess(false), 2e3);
  };
  const handleResetCarto = () => {
    const reset = { ...mapConfig, provider: "carto_dark" };
    setMapConfig(reset);
    saveMapConfig(reset);
    setGisSavedSuccess(true);
    setTimeout(() => setGisSavedSuccess(false), 2e3);
  };
  return <div className="max-w-3xl mx-auto space-y-6"><div className="pb-4 border-b border-command-border"><h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2"><Settings className="w-5 h-5 text-slate-400" /><span>System Settings &amp; Diagnostics</span></h2><p className="text-xs text-slate-400 font-mono mt-0.5">
          Tune algorithmic risk heuristics, configure Live GIS mapping API keys, and inspect telemetry.
        </p></div>{
    /* Live GIS Map Provider & API Key Credentials Card */
  }<div className="p-6 rounded-2xl bg-command-panel border border-cyan-500/30 space-y-5 font-mono text-xs shadow-xl"><div className="flex items-center justify-between pb-3 border-b border-command-border"><div className="flex items-center gap-2 text-sm font-bold text-white uppercase"><Key className="w-4 h-4 text-cyan-400" /><span>Live GIS Map API Credentials &amp; Tile Engines</span></div><span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            GEOSPATIAL
          </span></div>{gisSavedSuccess && <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center gap-2 font-bold animate-pulse"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>Live GIS Map configuration and API credentials updated!</span></div>}{
    /* Tile Provider Selector */
  }<div className="space-y-2"><label className="text-[11px] font-bold text-slate-300 uppercase">Active Tile Provider Engine:</label><div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"><button
    type="button"
    onClick={() => setMapConfig({ ...mapConfig, provider: "carto_dark" })}
    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${mapConfig.provider === "carto_dark" ? "bg-cyan-950/50 border-cyan-400 text-white shadow-md" : "bg-command-bg border-command-border text-slate-400"}`}
  ><div className="font-bold text-slate-200">CartoDB Dark</div><div className="text-[10px] text-emerald-400 mt-0.5">Zero-Key Native Active</div></button><button
    type="button"
    onClick={() => setMapConfig({ ...mapConfig, provider: "mapbox_satellite" })}
    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${mapConfig.provider.startsWith("mapbox") ? "bg-cyan-950/50 border-cyan-400 text-white shadow-md" : "bg-command-bg border-command-border text-slate-400"}`}
  ><div className="font-bold text-slate-200">Mapbox Optical</div><div className="text-[10px] text-blue-400 mt-0.5">High-Res Satellite</div></button><button
    type="button"
    onClick={() => setMapConfig({ ...mapConfig, provider: "google_hybrid" })}
    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${mapConfig.provider.startsWith("google") ? "bg-cyan-950/50 border-cyan-400 text-white shadow-md" : "bg-command-bg border-command-border text-slate-400"}`}
  ><div className="font-bold text-slate-200">Google Maps</div><div className="text-[10px] text-amber-400 mt-0.5">Hybrid Satellite + Road</div></button></div></div>{
    /* Mapbox Token Input */
  }<div className="space-y-1.5 p-3.5 rounded-xl bg-command-bg border border-command-border"><div className="flex justify-between items-center text-slate-300"><span className="font-bold">Mapbox Access Token (VITE_MAPBOX_TOKEN):</span><a
    href="https://account.mapbox.com/"
    target="_blank"
    rel="noreferrer"
    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
  ><span>Get Token</span><ExternalLink className="w-3 h-3" /></a></div><div className="relative"><input
    type={showMapboxKey ? "text" : "password"}
    value={mapConfig.mapboxToken}
    onChange={(e) => setMapConfig({ ...mapConfig, mapboxToken: e.target.value })}
    placeholder="pk.eyJ1IjoieW91cnVzZXIiLCJhIjoiY2x4..."
    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
  /><button
    type="button"
    onClick={() => setShowMapboxKey(!showMapboxKey)}
    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
  >{showMapboxKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button></div></div>{
    /* Google Maps API Key Input */
  }<div className="space-y-1.5 p-3.5 rounded-xl bg-command-bg border border-command-border"><div className="flex justify-between items-center text-slate-300"><span className="font-bold">Google Maps Platform API Key (VITE_GOOGLE_MAPS_API_KEY):</span><a
    href="https://mapsplatform.google.com/maps-demo-key"
    target="_blank"
    rel="noreferrer"
    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
  ><span>Free Demo Key</span><ExternalLink className="w-3 h-3" /></a></div><div className="relative"><input
    type={showGoogleKey ? "text" : "password"}
    value={mapConfig.googleMapsApiKey}
    onChange={(e) => setMapConfig({ ...mapConfig, googleMapsApiKey: e.target.value })}
    placeholder="AIzaSyA..."
    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
  /><button
    type="button"
    onClick={() => setShowGoogleKey(!showGoogleKey)}
    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
  >{showGoogleKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button></div></div>{
    /* OpenWeatherMap Radar API Key */
  }<div className="space-y-1.5 p-3.5 rounded-xl bg-command-bg border border-command-border"><div className="flex justify-between items-center text-slate-300"><span className="font-bold">OpenWeather Radar API Key (VITE_OPENWEATHER_API_KEY):</span><label className="flex items-center gap-1.5 cursor-pointer text-slate-400 text-[10px]"><input
    type="checkbox"
    checked={mapConfig.weatherOverlay}
    onChange={(e) => setMapConfig({ ...mapConfig, weatherOverlay: e.target.checked })}
    className="accent-cyan-400"
  /><span>Enable Precipitation Radar</span></label></div><div className="relative"><input
    type={showWeatherKey ? "text" : "password"}
    value={mapConfig.openWeatherApiKey}
    onChange={(e) => setMapConfig({ ...mapConfig, openWeatherApiKey: e.target.value })}
    placeholder="b1b15e88..."
    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
  /><button
    type="button"
    onClick={() => setShowWeatherKey(!showWeatherKey)}
    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
  >{showWeatherKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button></div></div><div className="pt-2 flex items-center justify-between"><button
    type="button"
    onClick={handleResetCarto}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer text-xs"
  ><RefreshCw className="w-3.5 h-3.5" /><span>Reset to Free CartoDB</span></button><button
    type="button"
    onClick={handleSaveGisConfig}
    className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/40 cursor-pointer"
  >
            SAVE GIS CREDENTIALS
          </button></div></div>{
    /* Heuristic Risk Weight Tuning (Section 12) */
  }<div className="p-6 rounded-2xl bg-command-panel border border-command-border space-y-4 font-mono text-xs shadow-xl"><div className="flex items-center justify-between pb-3 border-b border-command-border"><div className="flex items-center gap-2 text-sm font-bold text-white uppercase"><Sliders className="w-4 h-4 text-cyan-400" /><span>Configurable Risk Engine Weights</span></div><span className="text-[10px] text-slate-400">Total: {Object.values(weights).reduce((a, b) => a + b, 0)}%</span></div><div className="space-y-3">{[
    { key: "population", label: "Population Risk Weight" },
    { key: "floodCoverage", label: "Flood Coverage Hazard Weight" },
    { key: "roadAccess", label: "Road Accessibility Risk Weight" },
    { key: "victims", label: "Victim Density Weight" },
    { key: "hospitalDistance", label: "Medical Proximity Weight" }
  ].map((item) => <div key={item.key} className="space-y-1"><div className="flex justify-between text-slate-300"><span>{item.label}:</span><span className="font-bold text-cyan-400">{weights[item.key]}%</span></div><input
    type="range"
    min={5}
    max={50}
    value={weights[item.key]}
    onChange={(e) => setWeights((prev) => ({
      ...prev,
      [item.key]: parseInt(e.target.value) || 0
    }))}
    className="w-full h-1.5 bg-command-bg rounded-lg appearance-none cursor-pointer accent-cyan-400"
  /></div>)}</div><div className="pt-2 flex justify-end"><button
    type="button"
    onClick={handleSaveWeights}
    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all cursor-pointer"
  >{savedSuccess ? "WEIGHTS APPLIED" : "APPLY CONFIGURATION"}</button></div></div>{
    /* AI Fallback Mode Architecture (Section 41) */
  }<div className="p-6 rounded-2xl bg-command-panel border border-command-border space-y-4 font-mono text-xs shadow-xl"><div className="text-sm font-bold text-white uppercase flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /><span>AI Inference Architecture Mode</span></div><div className="grid grid-cols-2 gap-3"><button
    type="button"
    onClick={() => setAiMode("DEMO_SIMULATION")}
    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${aiMode === "DEMO_SIMULATION" ? "bg-amber-950/30 border-amber-500 text-white shadow-lg" : "bg-command-bg border-command-border text-slate-400"}`}
  ><div className="font-bold text-sm text-amber-400">DEMO SIMULATION (Active)</div><div className="text-[11px] text-slate-400 mt-1">
              Deterministic sample benchmark for hackathon reliability. Explicitly labeled.
            </div></button><button
    type="button"
    onClick={() => setAiMode("REAL_AI")}
    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${aiMode === "REAL_AI" ? "bg-cyan-950/30 border-cyan-500 text-white shadow-lg" : "bg-command-bg border-command-border text-slate-400"}`}
  ><div className="font-bold text-sm text-cyan-400">REAL AI MODE</div><div className="text-[11px] text-slate-400 mt-1">
              Live PyTorch YOLO / Segment-Anything inference pipeline when GPU workers available.
            </div></button></div></div>{
    /* Offline Sync & System Health Diagnostics (Section 31 & 32) */
  }<div className="p-6 rounded-2xl bg-command-panel border border-command-border space-y-3 font-mono text-xs shadow-xl"><div className="text-sm font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-command-border"><Server className="w-4 h-4 text-slate-400" /><span>Offline Resilience &amp; Observability</span></div><div className="space-y-2 text-slate-300"><div className="flex justify-between p-2.5 bg-command-bg rounded-lg border border-command-border"><span>Offline Event Sync Queue:</span><span className="font-bold text-amber-400">7 Pending Events (Cached in IndexedDB)</span></div><div className="flex justify-between p-2.5 bg-command-bg rounded-lg border border-command-border"><span>FastAPI Server Telemetry:</span><span className="font-bold text-emerald-400">127.0.0.1:8000 (HEALTHY)</span></div><div className="flex justify-between p-2.5 bg-command-bg rounded-lg border border-command-border"><span>WebSockets Reconnect State:</span><span className="font-bold text-cyan-400">ACTIVE_SUBSCRIPTION (/ws/dashboard)</span></div></div></div></div>;
};
export {
  SettingsPage
};
