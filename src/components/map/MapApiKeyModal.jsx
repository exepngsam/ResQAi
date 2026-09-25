import { useState } from "react";
import {
  Key,
  X,
  CheckCircle2,
  ExternalLink,
  Layers,
  CloudRain,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import {
  getMapConfig,
  saveMapConfig
} from "../../utils/mapConfig";
const MapApiKeyModal = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const [config, setConfig] = useState(getMapConfig());
  const [showMapboxKey, setShowMapboxKey] = useState(false);
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showWeatherKey, setShowWeatherKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  if (!isOpen) return null;
  const handleSelectProvider = (prov) => {
    setConfig((prev) => ({ ...prev, provider: prov }));
  };
  const handleSave = () => {
    const updated = saveMapConfig(config);
    if (onConfigChanged) onConfigChanged(updated);
    setStatusMessage("GIS Map Engine configuration and API keys saved successfully!");
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 1200);
  };
  const handleResetDefault = () => {
    const resetConfig = {
      ...config,
      provider: "carto_dark"
    };
    setConfig(resetConfig);
    const updated = saveMapConfig(resetConfig);
    if (onConfigChanged) onConfigChanged(updated);
    setStatusMessage("Switched back to CartoDB Dark Matter (Zero-Key Active).");
    setTimeout(() => {
      setStatusMessage(null);
    }, 1500);
  };
  return <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono"><div className="relative w-full max-w-2xl bg-command-panel border border-command-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">{
    /* Header */
  }<div className="p-5 border-b border-command-border bg-command-bg/80 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50"><Key className="w-5 h-5" /></div><div><div className="flex items-center gap-2"><h3 className="text-base font-bold text-white tracking-wide">
                  Live GIS Map API Keys &amp; Tile Engines
                </h3><span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  GEOSPATIAL
                </span></div><p className="text-xs text-slate-400 mt-0.5">
                Configure Mapbox, Google Maps, or OpenWeather radar keys for high-resolution satellite layers.
              </p></div></div><button
    type="button"
    onClick={onClose}
    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-command-hover transition-colors cursor-pointer"
  ><X className="w-5 h-5" /></button></div>{
    /* Content Body */
  }<div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">{
    /* Status Alert if any */
  }{statusMessage && <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center gap-2 font-bold animate-pulse"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /><span>{statusMessage}</span></div>}{
    /* Provider Selection Grid */
  }<div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-cyan-400" /><span>Select Active Tile Provider</span></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">{
    /* Option 1: CartoDB Dark (Free) */
  }<button
    type="button"
    onClick={() => handleSelectProvider("carto_dark")}
    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${config.provider === "carto_dark" ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50" : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"}`}
  ><div className="flex items-center justify-between"><span className="font-bold text-slate-100">CartoDB Dark</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/50">
                    ZERO-KEY
                  </span></div><div className="text-[10px] text-slate-400 mt-1">
                  Tactical EOC dark theme. Fully functional offline/local with no API key needed.
                </div></button>{
    /* Option 2: Mapbox */
  }<button
    type="button"
    onClick={() => handleSelectProvider("mapbox_satellite")}
    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${config.provider.startsWith("mapbox") ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50" : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"}`}
  ><div className="flex items-center justify-between"><span className="font-bold text-slate-100">Mapbox Optical</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/50">
                    SATELLITE
                  </span></div><div className="text-[10px] text-slate-400 mt-1">
                  High-res Maxar satellite photography &amp; dark tactical vectors.
                </div></button>{
    /* Option 3: Google Maps */
  }<button
    type="button"
    onClick={() => handleSelectProvider("google_hybrid")}
    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${config.provider.startsWith("google") ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50" : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"}`}
  ><div className="flex items-center justify-between"><span className="font-bold text-slate-100">Google Maps</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/50">
                    HYBRID
                  </span></div><div className="text-[10px] text-slate-400 mt-1">
                  Google Hybrid Satellite + Road network with official Google credentials.
                </div></button></div></div>{
    /* Section: Mapbox Access Token Input */
  }<div className="p-4 rounded-xl bg-command-bg border border-command-border space-y-3"><div className="flex items-center justify-between"><div className="font-bold text-white flex items-center gap-2"><span>Mapbox Public Access Token</span>{config.mapboxToken ? <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Token Configured
                  </span> : <span className="text-[10px] text-slate-500 font-normal">Optional</span>}</div><a
    href="https://account.mapbox.com/"
    target="_blank"
    rel="noreferrer"
    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
  ><span>Get Token</span><ExternalLink className="w-3 h-3" /></a></div><div className="relative"><input
    type={showMapboxKey ? "text" : "password"}
    placeholder="pk.eyJ1IjoieW91cnVzZXIiLCJhIjoiY2x4..."
    value={config.mapboxToken}
    onChange={(e) => setConfig({ ...config, mapboxToken: e.target.value })}
    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
  /><button
    type="button"
    onClick={() => setShowMapboxKey(!showMapboxKey)}
    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
  >{showMapboxKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button></div>{config.provider.startsWith("mapbox") && <div className="flex gap-4 pt-1 text-[11px]"><label className="flex items-center gap-1.5 cursor-pointer text-slate-300"><input
    type="radio"
    name="mapboxVariant"
    checked={config.provider === "mapbox_satellite"}
    onChange={() => handleSelectProvider("mapbox_satellite")}
    className="accent-cyan-400"
  /><span>High-Res Satellite Streets</span></label><label className="flex items-center gap-1.5 cursor-pointer text-slate-300"><input
    type="radio"
    name="mapboxVariant"
    checked={config.provider === "mapbox_dark"}
    onChange={() => handleSelectProvider("mapbox_dark")}
    className="accent-cyan-400"
  /><span>Mapbox Dark Tactical Vector</span></label></div>}</div>{
    /* Section: Google Maps API Key Input */
  }<div className="p-4 rounded-xl bg-command-bg border border-command-border space-y-3"><div className="flex items-center justify-between"><div className="font-bold text-white flex items-center gap-2"><span>Google Maps Platform API Key</span>{config.googleMapsApiKey ? <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Key Configured
                  </span> : <span className="text-[10px] text-slate-500 font-normal">Optional</span>}</div><a
    href="https://mapsplatform.google.com/maps-demo-key"
    target="_blank"
    rel="noreferrer"
    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
  ><span>Free Demo Key Quickstart</span><ExternalLink className="w-3 h-3" /></a></div><div className="relative"><input
    type={showGoogleKey ? "text" : "password"}
    placeholder="AIzaSyA..."
    value={config.googleMapsApiKey}
    onChange={(e) => setConfig({ ...config, googleMapsApiKey: e.target.value })}
    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
  /><button
    type="button"
    onClick={() => setShowGoogleKey(!showGoogleKey)}
    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
  >{showGoogleKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button></div>{config.provider.startsWith("google") && <div className="flex gap-4 pt-1 text-[11px]"><label className="flex items-center gap-1.5 cursor-pointer text-slate-300"><input
    type="radio"
    name="googleVariant"
    checked={config.provider === "google_hybrid"}
    onChange={() => handleSelectProvider("google_hybrid")}
    className="accent-cyan-400"
  /><span>Google Hybrid Satellite</span></label><label className="flex items-center gap-1.5 cursor-pointer text-slate-300"><input
    type="radio"
    name="googleVariant"
    checked={config.provider === "google_roadmap"}
    onChange={() => handleSelectProvider("google_roadmap")}
    className="accent-cyan-400"
  /><span>Google Standard Road Network</span></label></div>}</div>{
    /* Section: OpenWeather Radar Layer Overlay */
  }<div className="p-4 rounded-xl bg-command-bg border border-command-border space-y-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-cyan-400" /><span className="font-bold text-white">Precipitation Radar Layer Overlay</span></div><label className="relative inline-flex items-center cursor-pointer"><input
    type="checkbox"
    checked={config.weatherOverlay}
    onChange={(e) => setConfig({ ...config, weatherOverlay: e.target.checked })}
    className="sr-only peer"
  /><div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600" /></label></div>{config.weatherOverlay && <div className="relative pt-1"><input
    type={showWeatherKey ? "text" : "password"}
    placeholder="OpenWeatherMap API Key (e.g. b1b15e88...)"
    value={config.openWeatherApiKey}
    onChange={(e) => setConfig({ ...config, openWeatherApiKey: e.target.value })}
    className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
  /><button
    type="button"
    onClick={() => setShowWeatherKey(!showWeatherKey)}
    className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-200"
  >{showWeatherKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button></div>}</div></div>{
    /* Footer Actions */
  }<div className="p-4 border-t border-command-border bg-command-bg/90 flex items-center justify-between"><button
    type="button"
    onClick={handleResetDefault}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer text-xs"
  ><RefreshCw className="w-3.5 h-3.5" /><span>Reset to Free Default (CartoDB)</span></button><div className="flex items-center gap-3"><button
    type="button"
    onClick={onClose}
    className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
  >
              Cancel
            </button><button
    type="button"
    onClick={handleSave}
    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/40 cursor-pointer text-xs"
  ><ShieldCheck className="w-4 h-4" /><span>Save &amp; Switch Tiles</span></button></div></div></div></div>;
};
export {
  MapApiKeyModal
};
