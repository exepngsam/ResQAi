import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getMapConfig,
  getTileLayerDefinition,
  subscribeMapConfig,
  saveMapConfig
} from "../../utils/mapConfig";
import {
  Layers,
  Crosshair,
  Maximize2,
  Compass,
  AlertTriangle,
  LifeBuoy,
  Shield,
  Activity,
  Home,
  Navigation,
  Globe
} from "lucide-react";

const DisasterMap = ({
  zones = [],
  roads = [],
  hospitals = [],
  shelters = [],
  rescueTeams = [],
  incidents = [],
  activeRoute,
  onSelectZone,
  onSelectIncident,
  layers: propLayers,
  mapConfig: propMapConfig,
  height = "100%",
  showOverlayControls = true,
  showLegend: propShowLegend = true
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const weatherTileLayerRef = useRef(null);
  const [activeConfig, setActiveConfig] = useState(propMapConfig || getMapConfig());
  const [mouseCoords, setMouseCoords] = useState({ lat: 20.35, lng: 86.15 });
  const [currentZoom, setCurrentZoom] = useState(10);
  const [isSatellite, setIsSatellite] = useState(
    (propMapConfig || getMapConfig()).provider === "esri_satellite" ||
    (propMapConfig || getMapConfig()).provider === "mapbox_satellite"
  );
  const [showLegend, setShowLegend] = useState(propShowLegend);

  // Internal layer toggles allowing map-level control
  const [internalLayers, setInternalLayers] = useState({
    zones: true,
    roads: true,
    hospitals: true,
    shelters: true,
    teams: true,
    victims: true,
    routes: true,
    ...(propLayers || {})
  });

  const effectiveLayers = useMemo(() => {
    return { ...internalLayers, ...(propLayers || {}) };
  }, [internalLayers, propLayers]);

  const toggleLayer = (key) => {
    setInternalLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const layerGroupsRef = useRef(null);

  useEffect(() => {
    if (propMapConfig) {
      setActiveConfig(propMapConfig);
    }
  }, [propMapConfig]);

  useEffect(() => {
    const unsubscribe = subscribeMapConfig((newConfig) => {
      setActiveConfig(newConfig);
      setIsSatellite(newConfig.provider === "esri_satellite" || newConfig.provider === "mapbox_satellite");
    });
    return () => unsubscribe();
  }, []);

  // Quick Action: Center Critical Zone (Erasama Zone 07)
  const handleCenterCriticalZone = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const crit = zones.find((z) => z.risk_level === "CRITICAL" || z.risk_score >= 85) || zones[6] || zones[0];
    if (crit && crit.center) {
      map.flyTo([crit.center[0], crit.center[1]], 12, { duration: 1.2 });
      if (onSelectZone) onSelectZone(crit);
    }
  };

  // Quick Action: Fit All Active Sectors
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (zones && zones.length > 0) {
      const allPoints = zones.flatMap((z) => z.polygon || []);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    } else {
      map.flyTo([20.35, 86.15], 10, { duration: 1 });
    }
  };

  // Toggle Satellite vs Dark Matter directly on the map
  const handleToggleBasemap = () => {
    const newSatellite = !isSatellite;
    setIsSatellite(newSatellite);
    const updated = saveMapConfig({
      provider: newSatellite ? "esri_satellite" : "carto_dark"
    });
    setActiveConfig(updated);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20.35, 86.15],
      zoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    // Custom top-right zoom control
    L.control.zoom({ position: "topright" }).addTo(map);

    // Track coordinates
    map.on("mousemove", (e) => {
      setMouseCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4))
      });
    });

    map.on("zoomend", () => {
      setCurrentZoom(map.getZoom());
    });

    const def = getTileLayerDefinition(activeConfig);
    const baseLayer = L.tileLayer(def.url, {
      attribution: def.attribution,
      subdomains: def.subdomains || "abcd",
      maxZoom: def.maxZoom
    }).addTo(map);

    baseTileLayerRef.current = baseLayer;

    const layerGroups = {
      zones: L.layerGroup().addTo(map),
      zoneLabels: L.layerGroup().addTo(map),
      roads: L.layerGroup().addTo(map),
      hospitals: L.layerGroup().addTo(map),
      shelters: L.layerGroup().addTo(map),
      teams: L.layerGroup().addTo(map),
      victims: L.layerGroup().addTo(map),
      routes: L.layerGroup().addTo(map)
    };

    layerGroupsRef.current = layerGroups;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      baseTileLayerRef.current = null;
      weatherTileLayerRef.current = null;
    };
  }, []);

  // Update Base Tile Layer dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const def = getTileLayerDefinition(activeConfig);
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const newBaseLayer = L.tileLayer(def.url, {
      attribution: def.attribution,
      subdomains: def.subdomains || "abcd",
      maxZoom: def.maxZoom
    }).addTo(map);

    newBaseLayer.bringToBack();
    baseTileLayerRef.current = newBaseLayer;

    if (activeConfig.weatherOverlay && activeConfig.openWeatherApiKey?.trim().length > 0) {
      if (weatherTileLayerRef.current) {
        map.removeLayer(weatherTileLayerRef.current);
      }
      weatherTileLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${activeConfig.openWeatherApiKey.trim()}`,
        { opacity: 0.55, maxZoom: 19 }
      ).addTo(map);
    } else if (weatherTileLayerRef.current) {
      map.removeLayer(weatherTileLayerRef.current);
      weatherTileLayerRef.current = null;
    }
  }, [activeConfig]);

  // Render Overlays: Polygons, Labels, Markers, Corridors, Routes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupsRef.current) return;

    const {
      zones: gZones,
      zoneLabels: gLabels,
      roads: gRoads,
      hospitals: gHosp,
      shelters: gShelt,
      teams: gTeams,
      victims: gVictims,
      routes: gRoutes
    } = layerGroupsRef.current;

    gZones.clearLayers();
    gLabels.clearLayers();
    gRoads.clearLayers();
    gHosp.clearLayers();
    gShelt.clearLayers();
    gTeams.clearLayers();
    gVictims.clearLayers();
    gRoutes.clearLayers();

    // 1. ZONES POLYGONS & LABELS
    if (effectiveLayers.zones && zones) {
      zones.forEach((z) => {
        let strokeColor = "#10b981";
        let fillColor = "#10b981";
        let fillOpacity = 0.14;
        let dashArray = void 0;
        let riskBadgeBg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
        let dotColor = "bg-emerald-400";

        if (z.risk_level === "CRITICAL" || z.risk_score >= 80) {
          strokeColor = "#f43f5e";
          fillColor = "#ef4444";
          fillOpacity = 0.25;
          dashArray = "5, 5";
          riskBadgeBg = "bg-red-500/25 text-red-300 border-red-500/50";
          dotColor = "bg-red-500 animate-ping";
        } else if (z.risk_level === "HIGH" || z.risk_score >= 60) {
          strokeColor = "#f97316";
          fillColor = "#ea580c";
          fillOpacity = 0.18;
          riskBadgeBg = "bg-orange-500/20 text-orange-300 border-orange-500/40";
          dotColor = "bg-orange-400";
        } else if (z.risk_level === "MODERATE" || z.risk_score >= 40) {
          strokeColor = "#eab308";
          fillColor = "#ca8a04";
          fillOpacity = 0.15;
          riskBadgeBg = "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
          dotColor = "bg-yellow-400";
        }

        // Polygon
        const poly = L.polygon(z.polygon, {
          color: strokeColor,
          weight: z.risk_level === "CRITICAL" ? 2.5 : 2,
          fillColor,
          fillOpacity,
          dashArray,
          lineJoin: "round"
        });

        poly.bindPopup(`
          <div class="p-3 text-slate-100 font-sans min-w-[240px]">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <span class="font-bold text-sm tracking-wide text-white">${z.name}</span>
              <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${riskBadgeBg}">
                ${z.risk_level} (${z.risk_score})
              </span>
            </div>
            <div class="text-xs text-slate-300 mt-2.5 space-y-1.5 font-mono">
              <div class="flex justify-between">
                <span class="text-slate-400">Flood Inundation:</span>
                <span class="text-white font-bold">${z.flood_depth_m}m (${z.flood_coverage_pct}%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Possible Victims:</span>
                <span class="text-red-400 font-bold">${z.possible_victims} awaiting evac</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Population:</span>
                <span class="text-slate-200">${z.population.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Access Blockages:</span>
                <span class="text-amber-400 font-bold">${z.blocked_access_roads || 0} routes</span>
              </div>
            </div>
          </div>
        `);

        poly.on("click", () => {
          if (onSelectZone) onSelectZone(z);
        });

        gZones.addLayer(poly);

        // Centroid Tactical Pill Tag
        if (z.center && z.center.length === 2) {
          const labelIcon = L.divIcon({
            className: "zone-centroid-tag",
            html: `
              <div class="cursor-pointer group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#08080a]/90 border border-white/20 text-[10px] font-mono font-bold text-white shadow-xl backdrop-blur-md hover:border-white/50 hover:bg-[#121216] transition-all transform hover:scale-105">
                <span class="w-2 h-2 rounded-full ${dotColor}"></span>
                <span class="tracking-tight">${z.name}</span>
                <span class="text-[9px] px-1 py-0.2 rounded font-mono border ${riskBadgeBg}">
                  ${z.risk_score}
                </span>
              </div>
            `,
            iconSize: [160, 24],
            iconAnchor: [80, 12]
          });

          const labelMarker = L.marker(z.center, { icon: labelIcon });
          labelMarker.on("click", () => {
            poly.openPopup();
            if (onSelectZone) onSelectZone(z);
          });
          gLabels.addLayer(labelMarker);
        }
      });
    }

    // 2. ROAD NETWORK & CORRIDORS
    if (effectiveLayers.roads && roads) {
      roads.forEach((r) => {
        let color = "#10b981";
        let dashArray = void 0;
        let weight = 2.5;
        let opacity = 0.75;
        let statusBadge = "bg-emerald-500/20 text-emerald-300";

        if (r.status === "BLOCKED") {
          color = "#ef4444";
          dashArray = "6, 6";
          weight = 4;
          opacity = 0.95;
          statusBadge = "bg-red-500/25 text-red-300";
        } else if (r.status === "FLOODED") {
          color = "#f97316";
          dashArray = "5, 5";
          weight = 3.5;
          opacity = 0.85;
          statusBadge = "bg-orange-500/25 text-orange-300";
        }

        const line = L.polyline(r.coordinates, {
          color,
          weight,
          dashArray,
          opacity,
          lineCap: "round",
          lineJoin: "round"
        });

        line.bindPopup(`
          <div class="p-2.5 text-slate-100 font-mono text-xs min-w-[200px]">
            <div class="font-bold text-sm text-white">${r.name}</div>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-slate-400">Status:</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge}">${r.status}</span>
            </div>
            <div class="mt-1 flex justify-between">
              <span class="text-slate-400">Length:</span>
              <span class="text-slate-200">${r.distance_km} km</span>
            </div>
          </div>
        `);
        gRoads.addLayer(line);
      });
    }

    // 3. HOSPITALS (Red Cross Medical Nodes)
    if (effectiveLayers.hospitals && hospitals) {
      hospitals.forEach((h) => {
        const icon = L.divIcon({
          className: "custom-hosp-icon",
          html: `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="w-7 h-7 bg-red-950/90 border-2 border-red-500 rounded-lg flex items-center justify-center text-red-300 shadow-xl shadow-red-950/60 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-black/90 border border-red-500/30 text-[8px] font-mono text-red-300 whitespace-nowrap shadow">
                ${h.name.split(" ")[0]} (${h.available_beds} Beds)
              </div>
            </div>
          `,
          iconSize: [60, 42],
          iconAnchor: [30, 21]
        });
        const m = L.marker(h.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2.5 text-slate-100 font-mono text-xs min-w-[220px]">
            <div class="font-bold text-sm text-red-400">${h.name}</div>
            <div class="text-slate-400 mt-1">${h.location_name}</div>
            <div class="mt-2.5 space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Available Beds:</span>
                <span class="font-bold text-emerald-400">${h.available_beds} / ${h.total_beds}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">ICU Capacity:</span>
                <span class="font-bold text-amber-400">${h.icu_available} free</span>
              </div>
            </div>
          </div>
        `);
        gHosp.addLayer(m);
      });
    }

    // 4. SHELTERS (Bunkers & Evacuation Safe Havens)
    if (effectiveLayers.shelters && shelters) {
      shelters.forEach((s) => {
        const pct = Math.round((s.occupancy / s.capacity) * 100);
        const icon = L.divIcon({
          className: "custom-shelter-icon",
          html: `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="w-7 h-7 bg-emerald-950/90 border-2 border-emerald-400 rounded-lg flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-950/60 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-black/90 border border-emerald-500/30 text-[8px] font-mono text-emerald-300 whitespace-nowrap shadow">
                ${s.name.split(" ")[0]} (${pct}%)
              </div>
            </div>
          `,
          iconSize: [60, 42],
          iconAnchor: [30, 21]
        });
        const m = L.marker(s.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2.5 text-slate-100 font-mono text-xs min-w-[220px]">
            <div class="font-bold text-sm text-emerald-400">${s.name}</div>
            <div class="mt-2 space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Capacity:</span>
                <span class="text-white font-bold">${s.occupancy} / ${s.capacity} (${pct}%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Water Reserves:</span>
                <span class="text-cyan-400 font-bold">${s.water_supply_days} days</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Medical Team:</span>
                <span class="text-emerald-400 font-bold">${s.medical_team_present ? "On Site" : "Pending"}</span>
              </div>
            </div>
          </div>
        `);
        gShelt.addLayer(m);
      });
    }

    // 5. RESCUE TEAMS FLEET (Boats / Airborne / Specialists)
    if (effectiveLayers.teams && rescueTeams) {
      rescueTeams.forEach((t) => {
        const isAssigned = t.status === "ASSIGNED";
        const icon = L.divIcon({
          className: "custom-team-icon",
          html: `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="w-8 h-8 rounded-full ${isAssigned ? "bg-amber-950/90 border-amber-400 text-amber-300" : "bg-cyan-950/90 border-cyan-400 text-cyan-300"} border-2 flex items-center justify-center shadow-lg shadow-cyan-950/60 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="mt-0.5 px-1.5 py-0.2 rounded bg-black/90 border ${isAssigned ? "border-amber-500/40 text-amber-300" : "border-cyan-500/40 text-cyan-300"} text-[8px] font-mono font-bold whitespace-nowrap shadow">
                ${t.id} (${t.boats_assigned || 0} Boats)
              </div>
            </div>
          `,
          iconSize: [70, 44],
          iconAnchor: [35, 22]
        });
        const m = L.marker(t.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2.5 text-slate-100 font-mono text-xs min-w-[230px]">
            <div class="flex items-center justify-between pb-1 border-b border-white/10">
              <span class="font-bold text-sm text-cyan-400">${t.name}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold ${isAssigned ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}">
                ${t.status}
              </span>
            </div>
            <div class="text-slate-300 mt-2">${t.capability}</div>
            <div class="mt-2 space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Personnel:</span>
                <span class="text-white font-bold">${t.personnel_count} operators</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Boats Assigned:</span>
                <span class="text-cyan-400 font-bold">${t.boats_assigned} motorized</span>
              </div>
            </div>
          </div>
        `);
        gTeams.addLayer(m);
      });
    }

    // 6. INCIDENTS (SOS Pins with Radar Beacons)
    if (effectiveLayers.victims && incidents) {
      incidents.forEach((inc) => {
        const isP1 = inc.priority === "P1";
        const isP2 = inc.priority === "P2";
        const isHazardOnly = inc.category === "ROAD_HAZARD" || inc.possible_victims === 0;

        let iconHtml = "";

        if (isHazardOnly) {
          // Yellow Caution Diamond for road hazard (No confusing '0' in red circle)
          iconHtml = `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="w-6 h-6 rotate-45 rounded bg-amber-500/90 border-2 border-white flex items-center justify-center text-black shadow-lg shadow-amber-950/50 group-hover:scale-110 transition-transform">
                <svg class="-rotate-45 w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="mt-1 px-1.5 py-0.2 rounded bg-black/90 border border-amber-500/40 text-[8px] font-mono font-bold text-amber-300 whitespace-nowrap shadow">
                ROAD HAZARD
              </div>
            </div>
          `;
        } else if (isP1) {
          // Critical P1: Glowing red radar ping + SOS victim count
          iconHtml = `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="relative flex items-center justify-center">
                <div class="absolute -inset-3 rounded-full bg-red-500/30 radar-ping"></div>
                <div class="absolute -inset-1 rounded-full bg-red-500/50 animate-pulse"></div>
                <div class="relative w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-white flex flex-col items-center justify-center text-white font-black shadow-xl shadow-red-950/80 group-hover:scale-110 transition-transform">
                  <span class="text-[11px] leading-none">${inc.possible_victims}</span>
                  <span class="text-[7px] uppercase font-mono tracking-tighter leading-none opacity-90">SOS</span>
                </div>
              </div>
              <div class="mt-1 px-1.5 py-0.2 rounded bg-black/90 border border-red-500/50 text-[8px] font-mono font-bold text-red-400 whitespace-nowrap shadow">
                P1 • ${inc.possible_victims} VICTIMS
              </div>
            </div>
          `;
        } else {
          // P2 or other: Amber evacuation pin
          iconHtml = `
            <div class="relative flex flex-col items-center cursor-pointer group">
              <div class="relative flex items-center justify-center">
                <div class="absolute -inset-1.5 rounded-full bg-amber-500/30 animate-pulse"></div>
                <div class="relative w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-white flex flex-col items-center justify-center text-white font-bold shadow-lg shadow-amber-950/60 group-hover:scale-110 transition-transform">
                  <span class="text-[10px] leading-none">${inc.possible_victims}</span>
                  <span class="text-[7px] uppercase font-mono tracking-tighter leading-none opacity-90">EVAC</span>
                </div>
              </div>
              <div class="mt-1 px-1.5 py-0.2 rounded bg-black/90 border border-amber-500/50 text-[8px] font-mono font-bold text-amber-300 whitespace-nowrap shadow">
                P2 • ${inc.possible_victims} TRAPPED
              </div>
            </div>
          `;
        }

        const icon = L.divIcon({
          className: "custom-incident-icon",
          html: iconHtml,
          iconSize: [80, 50],
          iconAnchor: [40, 25]
        });

        const m = L.marker(inc.coordinates, { icon });
        m.bindPopup(`
          <div class="p-3 text-slate-100 font-sans min-w-[260px]">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <span class="font-bold text-sm text-white">${inc.title}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isP1 ? "bg-red-500/25 text-red-300 border border-red-500/40" : "bg-amber-500/25 text-amber-300 border border-amber-500/40"}">
                ${inc.priority} ${inc.severity || ""}
              </span>
            </div>
            <div class="mt-2 text-xs text-slate-300 leading-relaxed font-mono">${inc.description}</div>
            <div class="mt-3 p-2 rounded bg-white/[0.03] border border-white/10 space-y-1 font-mono text-xs">
              <div class="flex justify-between">
                <span class="text-slate-400">Sector:</span>
                <span class="text-white font-bold">${inc.zone_name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Water Depth:</span>
                <span class="text-cyan-400 font-bold">${inc.water_level_m}m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Possible Victims:</span>
                <span class="text-red-400 font-bold">${inc.possible_victims} persons</span>
              </div>
            </div>
            ${inc.recommended_action ? `
              <div class="mt-2.5 text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-500/20 font-mono">
                <span class="font-bold text-cyan-400">AI PLAN:</span> ${inc.recommended_action}
              </div>
            ` : ""}
          </div>
        `);

        m.on("click", () => {
          if (onSelectIncident) onSelectIncident(inc);
        });

        gVictims.addLayer(m);
      });
    }

    // 7. ACTIVE EXTRACTION ROUTE (Dual-layer Neon Polyline with Waypoints)
    if (effectiveLayers.routes && activeRoute && activeRoute.length > 1) {
      // Glow underlayer
      const outerGlow = L.polyline(activeRoute, {
        color: "#06b6d4",
        weight: 9,
        opacity: 0.35,
        lineCap: "round",
        lineJoin: "round"
      });
      gRoutes.addLayer(outerGlow);

      // Crisp dashed inner line
      const innerLine = L.polyline(activeRoute, {
        color: "#22d3ee",
        weight: 3.5,
        opacity: 0.95,
        dashArray: "6, 6",
        lineCap: "round",
        lineJoin: "round"
      });
      gRoutes.addLayer(innerLine);

      // Start Waypoint (NDRF Launch Base)
      const startCoord = activeRoute[0];
      const startIcon = L.divIcon({
        className: "route-start-icon",
        html: `
          <div class="flex flex-col items-center">
            <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-950/80">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-0.5 px-1.5 py-0.2 rounded bg-black/90 border border-cyan-500/40 text-[8px] font-mono text-cyan-300 whitespace-nowrap shadow">
              LAUNCH BASE
            </div>
          </div>
        `,
        iconSize: [70, 36],
        iconAnchor: [35, 18]
      });
      gRoutes.addLayer(L.marker(startCoord, { icon: startIcon }));

      // End Waypoint (Extraction Destination)
      const endCoord = activeRoute[activeRoute.length - 1];
      const endIcon = L.divIcon({
        className: "route-end-icon",
        html: `
          <div class="flex flex-col items-center">
            <div class="relative flex items-center justify-center">
              <div class="absolute -inset-2 rounded-full bg-red-500/40 radar-ping"></div>
              <div class="w-7 h-7 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white font-bold shadow-lg shadow-red-950/80">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-0.5 px-1.5 py-0.2 rounded bg-black/90 border border-red-500/50 text-[8px] font-mono font-bold text-red-300 whitespace-nowrap shadow">
              CANAL ROUTE R-18 (~11 MIN)
            </div>
          </div>
        `,
        iconSize: [120, 42],
        iconAnchor: [60, 21]
      });
      gRoutes.addLayer(L.marker(endCoord, { icon: endIcon }));
    }
  }, [
    zones,
    roads,
    hospitals,
    shelters,
    rescueTeams,
    incidents,
    activeRoute,
    effectiveLayers,
    onSelectZone,
    onSelectIncident
  ]);

  return (
    <div className="relative w-full h-full min-h-[420px] select-none group/map">
      {/* Map Viewport Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#050505]"
      />

      {/* Floating Tactical Top-Left HUD Controls & Filters */}
      {showOverlayControls && (
        <>
          <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleCenterCriticalZone}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#08080a]/90 hover:bg-[#141418] border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-mono font-bold backdrop-blur-md shadow-lg transition-all cursor-pointer"
              title="Pan directly to critical disaster zone"
            >
              <Crosshair className="w-3.5 h-3.5 animate-pulse" />
              <span>TARGET ZONE 07</span>
            </button>

            <button
              type="button"
              onClick={handleFitAll}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#08080a]/90 hover:bg-[#141418] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-mono backdrop-blur-md shadow-lg transition-all cursor-pointer"
              title="Fit view to all active sectors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>FIT ALL</span>
            </button>

            <button
              type="button"
              onClick={handleToggleBasemap}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                isSatellite
                  ? "bg-cyan-950/80 border-cyan-400 text-cyan-300"
                  : "bg-[#08080a]/90 border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
              }`}
              title="Switch between Carto Dark Matter and High-Res Satellite"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isSatellite ? "SATELLITE ACTIVE" : "DARK MATTER"}</span>
            </button>
          </div>

          {/* Floating Tactical Layer Filter Pills (Top Center / Right) */}
          <div className="absolute top-3 right-14 z-[400] hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300 shadow-xl pointer-events-auto">
            <button
              type="button"
              onClick={() => toggleLayer("zones")}
              className={`px-2 py-1 rounded transition-colors ${
                effectiveLayers.zones ? "bg-white/10 text-white font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Sectors
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("victims")}
              className={`px-2 py-1 rounded transition-colors ${
                effectiveLayers.victims ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Incidents
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("teams")}
              className={`px-2 py-1 rounded transition-colors ${
                effectiveLayers.teams ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Fleet
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("roads")}
              className={`px-2 py-1 rounded transition-colors ${
                effectiveLayers.roads ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Corridors
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("hospitals")}
              className={`px-2 py-1 rounded transition-colors ${
                effectiveLayers.hospitals ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Med
            </button>
            <button
              type="button"
              onClick={() => toggleLayer("shelters")}
              className={`px-2 py-1 rounded transition-colors ${
                effectiveLayers.shelters ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Shelters
            </button>
          </div>
        </>
      )}

      {/* Floating Tactical Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-[400] pointer-events-auto">
        {showLegend ? (
          <div className="p-2.5 rounded-xl bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 shadow-2xl space-y-1.5 max-w-[260px]">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GIS Tactical HUD
              </span>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                className="text-slate-500 hover:text-slate-300 text-[10px] cursor-pointer"
              >
                Hide
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-500 border border-white/40" />
                <span>Critical (&gt;80)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-orange-500 border border-white/40" />
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>SOS Incident</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Rescue Fleet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-cyan-400" />
                <span>Canal Route R-18</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-500 border-dashed" />
                <span>Blocked Road</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowLegend(true)}
            className="px-2 py-1 rounded-lg bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 hover:text-white shadow-xl cursor-pointer"
          >
            Show Legend
          </button>
        )}
      </div>

      {/* Floating Bottom-Right Coordinates & Scale HUD */}
      <div className="absolute bottom-3 right-3 z-[400] pointer-events-none hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#08080a]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-400 shadow-xl">
        <Compass className="w-3 h-3 text-cyan-400 animate-spin-slow" />
        <span>{mouseCoords.lat}°N, {mouseCoords.lng}°E</span>
        <span className="text-white/20">|</span>
        <span>ZOOM {currentZoom}×</span>
      </div>
    </div>
  );
};

export { DisasterMap };
