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
  EyeOff,
  Film,
  Sparkles,
  Database
} from "lucide-react";
import { getMapConfig, saveMapConfig, subscribeMapConfig } from "../utils/mapConfig";
import { CommandHeader } from "../components/common/CommandHeader";
import { GlassCard } from "../components/common/GlassCard";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

const SettingsPage = ({ onReplayIntro }) => {
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
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveGisConfig = () => {
    saveMapConfig(mapConfig);
    setGisSavedSuccess(true);
    setTimeout(() => setGisSavedSuccess(false), 2000);
  };

  const handleResetCarto = () => {
    const reset = { ...mapConfig, provider: "carto_dark" };
    setMapConfig(reset);
    saveMapConfig(reset);
    setGisSavedSuccess(true);
    setTimeout(() => setGisSavedSuccess(false), 2000);
  };

  const handleTriggerReplayIntro = () => {
    localStorage.removeItem("resqai_intro_seen");
    if (onReplayIntro) {
      onReplayIntro();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-blur-fade-up">
      <CommandHeader
        title="System Parameters & Diagnostics"
        description="Configure Live GIS tile engines, tune explainable risk weights, inspect offline telemetry caches, and test audio-visual presets."
        badgeText="CONFIGURATION"
        badgeVariant="LOW"
      />

      {/* Cinematic Experience Preference (Section 57) */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Cinematic Opening Experience (Section 57)
            </h2>
          </div>
          <Badge variant="SIMULATION" text="VIDEO PRESENTATION" />
        </div>

        <p className="text-xs text-command-secondary font-sans leading-relaxed">
          The cinematic opening sequence introduces the disaster command platform using high-definition aerial footage and audio-visual cues. By default, returning commanders skip straight to the operational console.
        </p>

        <div className="pt-2">
          <Button
            variant="glass"
            size="md"
            icon={Film}
            onClick={handleTriggerReplayIntro}
            className="text-amber-300 hover:text-white border-amber-500/30"
          >
            REPLAY CINEMATIC INTRO VIDEO
          </Button>
        </div>
      </GlassCard>

      {/* Live GIS Map Provider & API Key Credentials Card */}
      <GlassCard className="p-6 space-y-5 border-cyan-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Live GIS Map API Credentials & Tile Engines</span>
          </div>
          <Badge variant="LOW" text="GEOSPATIAL" />
        </div>

        {gisSavedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 flex items-center gap-2 font-bold font-mono text-xs animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Live GIS Map configuration and API credentials updated!</span>
          </div>
        )}

        {/* Tile Provider Selector */}
        <div className="space-y-2 font-mono text-xs">
          <label className="text-[11px] font-bold text-command-secondary uppercase">
            Active Tile Provider Engine:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setMapConfig({ ...mapConfig, provider: "carto_dark" })}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                mapConfig.provider === "carto_dark"
                  ? "bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                  : "bg-surface-elevated/40 border-white/[0.06] text-command-muted hover:text-white"
              }`}
            >
              <div className="font-bold text-slate-200">CartoDB Dark Matter</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Zero-Key Native Active</div>
            </button>

            <button
              type="button"
              onClick={() => setMapConfig({ ...mapConfig, provider: "mapbox_satellite" })}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                mapConfig.provider.startsWith("mapbox")
                  ? "bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                  : "bg-surface-elevated/40 border-white/[0.06] text-command-muted hover:text-white"
              }`}
            >
              <div className="font-bold text-slate-200">Mapbox Optical</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">High-Res Satellite</div>
            </button>

            <button
              type="button"
              onClick={() => setMapConfig({ ...mapConfig, provider: "google_hybrid" })}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                mapConfig.provider.startsWith("google")
                  ? "bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                  : "bg-surface-elevated/40 border-white/[0.06] text-command-muted hover:text-white"
              }`}
            >
              <div className="font-bold text-slate-200">Google Maps Platform</div>
              <div className="text-[10px] text-amber-400 mt-0.5">Hybrid Satellite + Roads</div>
            </button>
          </div>
        </div>

        {/* Mapbox Token Input */}
        <div className="space-y-1.5 p-3.5 rounded-xl bg-surface-elevated/40 border border-white/[0.06] font-mono text-xs">
          <div className="flex justify-between items-center text-command-secondary">
            <span className="font-bold text-white">Mapbox Access Token (VITE_MAPBOX_TOKEN):</span>
            <a
              href="https://account.mapbox.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative">
            <input
              type={showMapboxKey ? "text" : "password"}
              value={mapConfig.mapboxToken}
              onChange={(e) => setMapConfig({ ...mapConfig, mapboxToken: e.target.value })}
              placeholder="pk.eyJ1IjoieW91cnVzZXIiLCJhIjoiY2x4..."
              className="w-full pl-3 pr-10 py-2 rounded-lg bg-surface-base border border-white/10 text-slate-200 placeholder-command-muted focus:outline-none focus:border-cyan-400 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowMapboxKey(!showMapboxKey)}
              className="absolute right-2.5 top-2.5 text-command-muted hover:text-white"
            >
              {showMapboxKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Google Maps API Key Input */}
        <div className="space-y-1.5 p-3.5 rounded-xl bg-surface-elevated/40 border border-white/[0.06] font-mono text-xs">
          <div className="flex justify-between items-center text-command-secondary">
            <span className="font-bold text-white">Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY):</span>
            <a
              href="https://mapsplatform.google.com/maps-demo-key"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Free Demo Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative">
            <input
              type={showGoogleKey ? "text" : "password"}
              value={mapConfig.googleMapsApiKey}
              onChange={(e) => setMapConfig({ ...mapConfig, googleMapsApiKey: e.target.value })}
              placeholder="AIzaSyA..."
              className="w-full pl-3 pr-10 py-2 rounded-lg bg-surface-base border border-white/10 text-slate-200 placeholder-command-muted focus:outline-none focus:border-cyan-400 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowGoogleKey(!showGoogleKey)}
              className="absolute right-2.5 top-2.5 text-command-muted hover:text-white"
            >
              {showGoogleKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* OpenWeather Radar */}
        <div className="space-y-1.5 p-3.5 rounded-xl bg-surface-elevated/40 border border-white/[0.06] font-mono text-xs">
          <div className="flex justify-between items-center text-command-secondary">
            <span className="font-bold text-white">OpenWeather Radar API Key:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-command-muted text-[10px]">
              <input
                type="checkbox"
                checked={mapConfig.weatherOverlay}
                onChange={(e) => setMapConfig({ ...mapConfig, weatherOverlay: e.target.checked })}
                className="accent-cyan-400"
              />
              <span>Enable Precipitation Radar</span>
            </label>
          </div>
          <div className="relative">
            <input
              type={showWeatherKey ? "text" : "password"}
              value={mapConfig.openWeatherApiKey}
              onChange={(e) => setMapConfig({ ...mapConfig, openWeatherApiKey: e.target.value })}
              placeholder="b1b15e88..."
              className="w-full pl-3 pr-10 py-2 rounded-lg bg-surface-base border border-white/10 text-slate-200 placeholder-command-muted focus:outline-none focus:border-cyan-400 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowWeatherKey(!showWeatherKey)}
              className="absolute right-2.5 top-2.5 text-command-muted hover:text-white"
            >
              {showWeatherKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Button
            variant="glass"
            size="sm"
            icon={RefreshCw}
            onClick={handleResetCarto}
          >
            Reset to Free CartoDB
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleSaveGisConfig}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
          >
            SAVE GIS CREDENTIALS
          </Button>
        </div>
      </GlassCard>

      {/* Heuristic Risk Weight Tuning */}
      <GlassCard className="p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Configurable Explainable Risk Weights</span>
          </div>
          <span className="text-[10px] text-command-muted">
            Total: {Object.values(weights).reduce((a, b) => a + b, 0)}%
          </span>
        </div>

        <div className="space-y-3">
          {[
            { key: "population", label: "Population Density Exposure" },
            { key: "floodCoverage", label: "Hydrological Inundation Hazard" },
            { key: "roadAccess", label: "Road Washout & Accessibility" },
            { key: "victims", label: "Possible Victim Proximity" },
            { key: "hospitalDistance", label: "Medical Trauma Isolation" }
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex justify-between text-command-secondary">
                <span>{item.label}:</span>
                <span className="font-bold text-cyan-400">{weights[item.key]}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={weights[item.key]}
                onChange={(e) =>
                  setWeights((prev) => ({
                    ...prev,
                    [item.key]: parseInt(e.target.value) || 0
                  }))
                }
                className="w-full h-1.5 bg-surface-base rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveWeights}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
          >
            {savedSuccess ? "WEIGHTS APPLIED" : "APPLY RISK WEIGHTS"}
          </Button>
        </div>
      </GlassCard>

      {/* Offline Sync & System Health Diagnostics */}
      <GlassCard className="p-6 space-y-3 font-mono text-xs">
        <div className="text-sm font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <Server className="w-4 h-4 text-command-muted" />
          <span>Offline Resilience & Telemetry Diagnostics</span>
        </div>

        <div className="space-y-2 text-command-secondary">
          <div className="flex justify-between p-2.5 bg-surface-elevated/40 rounded-xl border border-white/[0.04]">
            <span>Offline Event Sync Queue:</span>
            <span className="font-bold text-amber-400">7 Pending Events (Cached in IndexedDB)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-surface-elevated/40 rounded-xl border border-white/[0.04]">
            <span>FastAPI Server Telemetry:</span>
            <span className="font-bold text-emerald-400">127.0.0.1:8000 (HEALTHY)</span>
          </div>
          <div className="flex justify-between p-2.5 bg-surface-elevated/40 rounded-xl border border-white/[0.04]">
            <span>WebSockets Connection State:</span>
            <span className="font-bold text-cyan-400">ACTIVE_SUBSCRIPTION (/ws/dashboard)</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export { SettingsPage };
