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
  const [showCartoKey, setShowCartoKey] = useState(false);
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
    setStatusMessage("Switched back to Tactical Dark (Clean Zero-Key).");
    setTimeout(() => {
      setStatusMessage(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="relative w-full max-w-2xl bg-command-panel border border-command-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-command-border bg-command-bg/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Live GIS Map API Keys &amp; Tile Engines
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  GEOSPATIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch basemaps or configure free Mapbox, CARTO, or Google Maps keys to remove watermarks.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-command-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Status Alert if any */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center gap-2 font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Provider Selection Grid */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Active Tile Provider</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {/* Option 1: Tactical Dark (Clean) */}
              <button
                type="button"
                onClick={() => handleSelectProvider("carto_dark")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  config.provider === "carto_dark"
                    ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50"
                    : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">Tactical Dark</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/50">
                    ZERO-KEY
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Clean watermark-free dark theme (Esri / Carto).
                </div>
              </button>

              {/* Option 2: Mapbox */}
              <button
                type="button"
                onClick={() => handleSelectProvider("mapbox_dark")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  config.provider.startsWith("mapbox")
                    ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50"
                    : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">Mapbox</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/50">
                    POPULAR
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  High-res Maxar satellite &amp; tactical vector dark.
                </div>
              </button>

              {/* Option 3: Esri Satellite */}
              <button
                type="button"
                onClick={() => handleSelectProvider("esri_satellite")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  config.provider === "esri_satellite"
                    ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50"
                    : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">Satellite</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/50">
                    ZERO-KEY
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Global satellite imagery without needing API keys.
                </div>
              </button>

              {/* Option 4: Google Maps */}
              <button
                type="button"
                onClick={() => handleSelectProvider("google_hybrid")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  config.provider.startsWith("google")
                    ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50"
                    : "bg-command-bg border-command-border text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">Google Maps</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/50">
                    HYBRID
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Google Hybrid Satellite + Road network.
                </div>
              </button>
            </div>
          </div>

          {/* Section: CARTO Basemap API Key */}
          <div className="p-3.5 rounded-xl bg-command-bg border border-command-border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white flex items-center gap-2">
                <span>CARTO Basemap API Key</span>
                {config.cartoApiKey ? (
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Key Set
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-normal">Optional (Removes Watermark)</span>
                )}
              </div>
              <a
                href="https://carto.com/basemaps/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Get Free CARTO Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showCartoKey ? "text" : "password"}
                placeholder="carto_..."
                value={config.cartoApiKey || ""}
                onChange={(e) => setConfig({ ...config, cartoApiKey: e.target.value })}
                className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowCartoKey(!showCartoKey)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showCartoKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Section: Mapbox Access Token Input */}
          <div className="p-3.5 rounded-xl bg-command-bg border border-command-border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white flex items-center gap-2">
                <span>Mapbox Public Access Token (50,000 Free Loads/Mo)</span>
                {config.mapboxToken ? (
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Token Configured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-normal">Recommended Free</span>
                )}
              </div>
              <a
                href="https://account.mapbox.com/auth/signup/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Get Free Mapbox Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showMapboxKey ? "text" : "password"}
                placeholder="pk.eyJ1IjoieW91cnVzZXIiLCJhIjoiY2x4..."
                value={config.mapboxToken}
                onChange={(e) => setConfig({ ...config, mapboxToken: e.target.value })}
                className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowMapboxKey(!showMapboxKey)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showMapboxKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {config.provider.startsWith("mapbox") && (
              <div className="flex gap-4 pt-1 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="mapboxVariant"
                    checked={config.provider === "mapbox_dark"}
                    onChange={() => handleSelectProvider("mapbox_dark")}
                    className="accent-cyan-400"
                  />
                  <span>Mapbox Dark Tactical</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="mapboxVariant"
                    checked={config.provider === "mapbox_satellite"}
                    onChange={() => handleSelectProvider("mapbox_satellite")}
                    className="accent-cyan-400"
                  />
                  <span>High-Res Satellite Streets</span>
                </label>
              </div>
            )}
          </div>

          {/* Section: Google Maps API Key Input */}
          <div className="p-3.5 rounded-xl bg-command-bg border border-command-border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white flex items-center gap-2">
                <span>Google Maps Platform API Key ($200 Free Monthly Credit)</span>
                {config.googleMapsApiKey ? (
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Key Configured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                )}
              </div>
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Google Cloud Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showGoogleKey ? "text" : "password"}
                placeholder="AIzaSyA..."
                value={config.googleMapsApiKey}
                onChange={(e) => setConfig({ ...config, googleMapsApiKey: e.target.value })}
                className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowGoogleKey(!showGoogleKey)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showGoogleKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Section: OpenWeather Radar Layer Overlay */}
          <div className="p-3.5 rounded-xl bg-command-bg border border-command-border space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">Precipitation Radar Layer Overlay</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.weatherOverlay}
                  onChange={(e) => setConfig({ ...config, weatherOverlay: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600" />
              </label>
            </div>
            {config.weatherOverlay && (
              <div className="relative pt-1">
                <input
                  type={showWeatherKey ? "text" : "password"}
                  placeholder="OpenWeatherMap API Key (e.g. b1b15e88...)"
                  value={config.openWeatherApiKey}
                  onChange={(e) => setConfig({ ...config, openWeatherApiKey: e.target.value })}
                  className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowWeatherKey(!showWeatherKey)}
                  className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showWeatherKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-command-border bg-command-bg/90 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clean Zero-Key Default</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/40 cursor-pointer text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save &amp; Switch Tiles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MapApiKeyModal };
