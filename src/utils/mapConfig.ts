// DISASTERIQ — GIS Map Engine & API Key Configuration Manager

export type MapTileProvider =
  | 'carto_dark'
  | 'mapbox_dark'
  | 'mapbox_satellite'
  | 'google_hybrid'
  | 'google_roadmap';

export interface MapConfig {
  provider: MapTileProvider;
  mapboxToken: string;
  googleMapsApiKey: string;
  openWeatherApiKey: string;
  weatherOverlay: boolean;
}

const STORAGE_KEY = 'disasteriq_gis_map_config';

export const DEFAULT_MAP_CONFIG: MapConfig = {
  provider: 'carto_dark',
  mapboxToken: (import.meta.env.VITE_MAPBOX_TOKEN as string) || '',
  googleMapsApiKey: (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '',
  openWeatherApiKey: (import.meta.env.VITE_OPENWEATHER_API_KEY as string) || '',
  weatherOverlay: false,
};

export const getMapConfig = (): MapConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_MAP_CONFIG,
        ...parsed,
        // Preserve env fallback if empty in storage
        mapboxToken: parsed.mapboxToken || (import.meta.env.VITE_MAPBOX_TOKEN as string) || '',
        googleMapsApiKey: parsed.googleMapsApiKey || (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '',
        openWeatherApiKey: parsed.openWeatherApiKey || (import.meta.env.VITE_OPENWEATHER_API_KEY as string) || '',
      };
    }
  } catch (e) {
    console.error('Error reading map config from localStorage', e);
  }
  return { ...DEFAULT_MAP_CONFIG };
};

export const saveMapConfig = (updates: Partial<MapConfig>): MapConfig => {
  const current = getMapConfig();
  const updated: MapConfig = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('disasteriq_map_config_updated', { detail: updated }));
  } catch (e) {
    console.error('Error saving map config to localStorage', e);
  }
  return updated;
};

export const subscribeMapConfig = (callback: (config: MapConfig) => void): (() => void) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<MapConfig>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };
  window.addEventListener('disasteriq_map_config_updated', handler);
  return () => {
    window.removeEventListener('disasteriq_map_config_updated', handler);
  };
};

export interface TileLayerDefinition {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
  requiresKey: boolean;
  hasKey: boolean;
  providerName: string;
}

export const getTileLayerDefinition = (config: MapConfig): TileLayerDefinition => {
  const { provider, mapboxToken, googleMapsApiKey } = config;

  switch (provider) {
    case 'mapbox_dark':
      if (mapboxToken && mapboxToken.trim().length > 0) {
        return {
          url: `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken.trim()}`,
          attribution: '&copy; Mapbox &copy; OpenStreetMap contributors',
          maxZoom: 19,
          requiresKey: true,
          hasKey: true,
          providerName: 'Mapbox Dark Tactical',
        };
      }
      break;

    case 'mapbox_satellite':
      if (mapboxToken && mapboxToken.trim().length > 0) {
        return {
          url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken.trim()}`,
          attribution: '&copy; Mapbox &copy; Maxar',
          maxZoom: 19,
          requiresKey: true,
          hasKey: true,
          providerName: 'Mapbox High-Res Satellite',
        };
      }
      break;

    case 'google_hybrid':
      if (googleMapsApiKey && googleMapsApiKey.trim().length > 0) {
        return {
          url: `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleMapsApiKey.trim()}`,
          attribution: '&copy; Google Maps',
          maxZoom: 20,
          requiresKey: true,
          hasKey: true,
          providerName: 'Google Maps Hybrid Satellite',
        };
      }
      break;

    case 'google_roadmap':
      if (googleMapsApiKey && googleMapsApiKey.trim().length > 0) {
        return {
          url: `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleMapsApiKey.trim()}`,
          attribution: '&copy; Google Maps',
          maxZoom: 20,
          requiresKey: true,
          hasKey: true,
          providerName: 'Google Maps Road Network',
        };
      }
      break;

    case 'carto_dark':
    default:
      break;
  }

  // Fallback to CartoDB Dark Matter (Zero-Key Native Leaflet, always reliable)
  return {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
    requiresKey: false,
    hasKey: true,
    providerName: 'CartoDB Dark Matter (Zero-Key Active)',
  };
};
