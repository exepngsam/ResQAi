export interface Disaster {
  id: string;
  name: string;
  type: string;
  location: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  started_at: string;
  affected_area_sq_km: number;
  current_status: string;
  center: [number, number];
  zoom: number;
}

export interface Zone {
  id: string;
  name: string;
  center: [number, number];
  polygon: [number, number][];
  population: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  flood_depth_m: number;
  flood_coverage_pct: number;
  possible_victims: number;
  blocked_access_roads: number;
  closest_hospital_km: number;
  contributing_factors: string[];
}

export interface Road {
  id: string;
  name: string;
  status: 'OPEN' | 'FLOODED' | 'BLOCKED';
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  distance_km: number;
  estimated_travel_min: number;
  coordinates: [number, number][];
}

export interface Hospital {
  id: string;
  name: string;
  location_name: string;
  coordinates: [number, number];
  total_beds: number;
  available_beds: number;
  icu_available: number;
  trauma_level: string;
  status: string;
}

export interface Shelter {
  id: string;
  name: string;
  coordinates: [number, number];
  capacity: number;
  occupancy: number;
  water_supply_days: number;
  medical_team_present: boolean;
  status: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  type: string;
  capability: string;
  coordinates: [number, number];
  personnel_count: number;
  boats_assigned: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'BUSY' | 'OFFLINE';
  equipment: string[];
  assigned_mission_id?: string | null;
}

export interface Incident {
  id: string;
  zone_id: string;
  zone_name: string;
  title: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  category: string;
  reported_at: string;
  coordinates: [number, number];
  possible_victims: number;
  water_level_m: number;
  status: 'PENDING_APPROVAL' | 'IN_PROGRESS' | 'SCHEDULED' | 'RESOLVED';
  description: string;
  recommended_action?: string;
}

export interface Mission {
  id: string;
  incident_id: string;
  incident_title: string;
  zone_id: string;
  team_id: string;
  team_name: string;
  priority: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'IN_TRANSIT' | 'ON_SCENE' | 'COMPLETED' | 'REJECTED';
  destination: [number, number];
  estimated_eta_min: number;
  recommended_route_id: string;
  approval_required: boolean;
  approved_by?: string | null;
  approved_at?: string | null;
  reason: string;
  rejection_reason?: string;
}

export interface AlertItem {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  zone_id: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface TimelineEvent {
  time: string;
  event: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'DECISION' | 'SUCCESS';
}

export interface DashboardSummary {
  disaster: Disaster;
  total_affected_population: number;
  critical_zones_count: number;
  detected_victims_count: number;
  active_rescue_teams_count: number;
  active_missions_count: number;
  available_shelters_count: number;
  available_ambulances_count: number;
  blocked_roads_count: number;
  zones: Zone[];
  recent_incidents: Incident[];
  active_missions: Mission[];
  recent_alerts: AlertItem[];
  simulation_state: {
    running: boolean;
    step: number;
    max_steps: number;
    scenario: string;
  };
}
