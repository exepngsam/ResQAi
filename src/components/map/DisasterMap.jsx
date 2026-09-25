import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  getMapConfig,
  getTileLayerDefinition,
  subscribeMapConfig
} from "../../utils/mapConfig";
const DisasterMap = ({
  zones,
  roads = [],
  hospitals = [],
  shelters = [],
  rescueTeams = [],
  incidents = [],
  activeRoute,
  onSelectZone,
  onSelectIncident,
  layers = {
    zones: true,
    roads: true,
    hospitals: true,
    shelters: true,
    teams: true,
    victims: true,
    routes: true
  },
  mapConfig: propMapConfig
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileLayerRef = useRef(null);
  const weatherTileLayerRef = useRef(null);
  const [activeConfig, setActiveConfig] = useState(propMapConfig || getMapConfig());
  const layerGroupsRef = useRef(null);
  useEffect(() => {
    if (propMapConfig) {
      setActiveConfig(propMapConfig);
    }
  }, [propMapConfig]);
  useEffect(() => {
    const unsubscribe = subscribeMapConfig((newConfig) => {
      setActiveConfig(newConfig);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: [20.35, 86.15],
      zoom: 10,
      zoomControl: false
    });
    L.control.zoom({ position: "topright" }).addTo(map);
    const def = getTileLayerDefinition(activeConfig);
    const baseLayer = L.tileLayer(def.url, {
      attribution: def.attribution,
      subdomains: def.subdomains || "abc",
      maxZoom: def.maxZoom
    }).addTo(map);
    baseTileLayerRef.current = baseLayer;
    const layerGroups = {
      zones: L.layerGroup().addTo(map),
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
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const def = getTileLayerDefinition(activeConfig);
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }
    const newBaseLayer = L.tileLayer(def.url, {
      attribution: def.attribution,
      subdomains: def.subdomains || "abc",
      maxZoom: def.maxZoom
    }).addTo(map);
    newBaseLayer.bringToBack();
    baseTileLayerRef.current = newBaseLayer;
    if (activeConfig.weatherOverlay && activeConfig.openWeatherApiKey.trim().length > 0) {
      if (weatherTileLayerRef.current) {
        map.removeLayer(weatherTileLayerRef.current);
      }
      weatherTileLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${activeConfig.openWeatherApiKey.trim()}`,
        {
          opacity: 0.55,
          maxZoom: 19
        }
      ).addTo(map);
    } else if (weatherTileLayerRef.current) {
      map.removeLayer(weatherTileLayerRef.current);
      weatherTileLayerRef.current = null;
    }
  }, [activeConfig]);
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupsRef.current) return;
    const { zones: gZones, roads: gRoads, hospitals: gHosp, shelters: gShelt, teams: gTeams, victims: gVictims, routes: gRoutes } = layerGroupsRef.current;
    gZones.clearLayers();
    gRoads.clearLayers();
    gHosp.clearLayers();
    gShelt.clearLayers();
    gTeams.clearLayers();
    gVictims.clearLayers();
    gRoutes.clearLayers();
    if (layers.zones && zones) {
      zones.forEach((z) => {
        let color = "#10b981";
        if (z.risk_level === "CRITICAL") color = "#ef4444";
        else if (z.risk_level === "HIGH") color = "#f97316";
        else if (z.risk_level === "MODERATE") color = "#eab308";
        const poly = L.polygon(z.polygon, {
          color,
          weight: 2,
          fillColor: color,
          fillOpacity: z.risk_level === "CRITICAL" ? 0.35 : 0.2,
          dashArray: z.risk_level === "CRITICAL" ? "4, 4" : void 0
        });
        poly.bindPopup(`
          <div class="p-2 text-slate-100">
            <div class="font-bold text-sm tracking-wide flex items-center justify-between">
              <span>${z.name}</span>
              <span class="text-xs px-2 py-0.5 rounded font-mono" style="background:${color}33; color:${color}; border:1px solid ${color}">
                ${z.risk_level} (${z.risk_score})
              </span>
            </div>
            <div class="text-xs text-slate-400 mt-2 space-y-1 font-mono">
              <div>Flood Depth: <span class="text-slate-200">${z.flood_depth_m}m</span> (${z.flood_coverage_pct}% coverage)</div>
              <div>Possible Victims: <span class="text-red-400 font-bold">${z.possible_victims}</span></div>
              <div>Population: ${z.population.toLocaleString()}</div>
            </div>
          </div>
        `);
        poly.on("click", () => {
          if (onSelectZone) onSelectZone(z);
        });
        gZones.addLayer(poly);
      });
    }
    if (layers.roads && roads) {
      roads.forEach((r) => {
        let color = "#10b981";
        let dashArray = void 0;
        let weight = 3;
        if (r.status === "BLOCKED") {
          color = "#ef4444";
          dashArray = "6, 6";
          weight = 4;
        } else if (r.status === "FLOODED") {
          color = "#f97316";
          dashArray = "4, 4";
        }
        const line = L.polyline(r.coordinates, {
          color,
          weight,
          dashArray,
          opacity: 0.85
        });
        line.bindPopup(`
          <div class="p-2 text-slate-100 font-mono text-xs">
            <div class="font-bold text-slate-200">${r.name}</div>
            <div class="mt-1 flex items-center gap-2">
              Status: <span class="font-bold" style="color:${color}">${r.status}</span>
            </div>
            <div>Distance: ${r.distance_km} km</div>
          </div>
        `);
        gRoads.addLayer(line);
      });
    }
    if (layers.hospitals && hospitals) {
      hospitals.forEach((h) => {
        const icon = L.divIcon({
          className: "custom-hosp-icon",
          html: `
            <div class="w-7 h-7 bg-red-950/80 border border-red-500 rounded-md flex items-center justify-center text-red-400 shadow-lg shadow-red-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const m = L.marker(h.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2 text-slate-100 font-mono text-xs">
            <div class="font-bold text-sm text-red-400">${h.name}</div>
            <div class="text-slate-400 mt-1">${h.location_name}</div>
            <div class="mt-2 text-slate-200">Available Beds: <span class="font-bold text-emerald-400">${h.available_beds}</span> / ${h.total_beds}</div>
            <div>ICU Capacity: <span class="font-bold text-amber-400">${h.icu_available}</span> free</div>
          </div>
        `);
        gHosp.addLayer(m);
      });
    }
    if (layers.shelters && shelters) {
      shelters.forEach((s) => {
        const icon = L.divIcon({
          className: "custom-shelter-icon",
          html: `
            <div class="w-7 h-7 bg-emerald-950/80 border border-emerald-500 rounded-md flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const m = L.marker(s.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2 text-slate-100 font-mono text-xs">
            <div class="font-bold text-sm text-emerald-400">${s.name}</div>
            <div class="mt-1">Capacity: ${s.occupancy} / ${s.capacity} (${Math.round(s.occupancy / s.capacity * 100)}%)</div>
            <div>Water Reserves: ${s.water_supply_days} days</div>
          </div>
        `);
        gShelt.addLayer(m);
      });
    }
    if (layers.teams && rescueTeams) {
      rescueTeams.forEach((t) => {
        const isAssigned = t.status === "ASSIGNED";
        const icon = L.divIcon({
          className: "custom-team-icon",
          html: `
            <div class="w-8 h-8 ${isAssigned ? "bg-amber-950/90 border-amber-400 text-amber-300" : "bg-cyan-950/90 border-cyan-400 text-cyan-300"} border-2 rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        const m = L.marker(t.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2 text-slate-100 font-mono text-xs">
            <div class="font-bold text-cyan-400 text-sm">${t.name}</div>
            <div class="text-slate-400">${t.capability}</div>
            <div class="mt-2 flex items-center gap-2">
              Status: <span class="font-bold ${isAssigned ? "text-amber-400" : "text-emerald-400"}">${t.status}</span>
            </div>
            <div>Personnel: ${t.personnel_count} | Boats: ${t.boats_assigned}</div>
          </div>
        `);
        gTeams.addLayer(m);
      });
    }
    if (layers.victims && incidents) {
      incidents.forEach((inc) => {
        const isCritical = inc.priority === "P1";
        const icon = L.divIcon({
          className: "custom-incident-icon relative",
          html: `
            <div class="relative flex items-center justify-center">
              ${isCritical ? '<div class="absolute w-8 h-8 rounded-full bg-red-500/40 radar-ping"></div>' : ""}
              <div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                ${inc.possible_victims}
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const m = L.marker(inc.coordinates, { icon });
        m.bindPopup(`
          <div class="p-2 text-slate-100 text-xs">
            <div class="font-bold text-red-400 flex items-center justify-between">
              <span>${inc.title}</span>
              <span class="bg-red-950 border border-red-500 px-1.5 py-0.5 rounded text-[10px]">${inc.priority}</span>
            </div>
            <div class="mt-1 text-slate-300 font-mono">${inc.description}</div>
            <div class="mt-2 font-mono text-amber-300">Possible Victims: ${inc.possible_victims}</div>
          </div>
        `);
        m.on("click", () => {
          if (onSelectIncident) onSelectIncident(inc);
        });
        gVictims.addLayer(m);
      });
    }
    if (layers.routes && activeRoute && activeRoute.length > 1) {
      const routeLine = L.polyline(activeRoute, {
        color: "#06b6d4",
        weight: 5,
        opacity: 0.9,
        lineCap: "round"
      });
      gRoutes.addLayer(routeLine);
    }
  }, [zones, roads, hospitals, shelters, rescueTeams, incidents, activeRoute, layers, onSelectZone, onSelectIncident]);
  return <div className="relative w-full h-full min-h-[400px]"><div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden border border-command-border shadow-2xl" /></div>;
};
export {
  DisasterMap
};
