from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field

class DisasterModel(BaseModel):
    id: str
    name: str
    type: str = "FLOOD"
    location: str
    severity: str = "CRITICAL"
    started_at: str
    affected_area_sq_km: float
    current_status: str
    center: List[float] = [20.35, 86.10]
    zoom: int = 10

class ZoneModel(BaseModel):
    id: str
    name: str
    center: List[float]
    polygon: List[List[float]]
    population: int
    risk_level: str
    risk_score: int
    flood_depth_m: float
    flood_coverage_pct: float
    possible_victims: int
    blocked_access_roads: int
    closest_hospital_km: float
    contributing_factors: List[str]

class RoadModel(BaseModel):
    id: str
    name: str
    status: str  # OPEN, FLOODED, BLOCKED
    risk_level: str
    distance_km: float
    estimated_travel_min: int
    coordinates: List[List[float]]

class ShelterModel(BaseModel):
    id: str
    name: str
    coordinates: List[float]
    capacity: int
    occupancy: int
    water_supply_days: int
    medical_team_present: bool
    status: str

class HospitalModel(BaseModel):
    id: str
    name: str
    location_name: str
    coordinates: List[float]
    total_beds: int
    available_beds: int
    icu_available: int
    trauma_level: str
    status: str

class RescueTeamModel(BaseModel):
    id: str
    name: str
    type: str
    capability: str
    coordinates: List[float]
    personnel_count: int
    boats_assigned: int
    status: str  # AVAILABLE, ASSIGNED, BUSY, OFFLINE
    equipment: List[str]
    assigned_mission_id: Optional[str] = None

class IncidentModel(BaseModel):
    id: str
    zone_id: str
    zone_name: str
    title: str
    priority: str  # P1, P2, P3, P4
    severity: str  # CRITICAL, HIGH, MODERATE, LOW
    category: str
    reported_at: str
    coordinates: List[float]
    possible_victims: int
    water_level_m: float
    status: str  # PENDING_APPROVAL, IN_PROGRESS, SCHEDULED, RESOLVED
    description: str
    recommended_action: Optional[str] = None

class MissionModel(BaseModel):
    id: str
    incident_id: str
    incident_title: str
    zone_id: str
    team_id: str
    team_name: str
    priority: str
    status: str  # PENDING_APPROVAL, APPROVED, IN_TRANSIT, ON_SCENE, COMPLETED, REJECTED
    destination: List[float]
    estimated_eta_min: int
    recommended_route_id: str
    approval_required: bool = True
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    reason: str

class RiskWeightsConfig(BaseModel):
    population_weight: float = 0.30
    flood_coverage_weight: float = 0.25
    road_access_weight: float = 0.20
    victim_count_weight: float = 0.15
    hospital_distance_weight: float = 0.10

class VisionAnalysisResult(BaseModel):
    is_demo: bool = True
    damage_level: str
    flood_percentage: float
    possible_victims: int
    detected_objects: List[Dict[str, Any]]
    blocked_roads: List[str]
    confidence: float
    explanation: str

class CitizenReportSubmission(BaseModel):
    description: str
    latitude: float
    longitude: float
    number_of_people: int = 1
    emergency_type: str = "FLOOD_TRAPPED"
    contact_phone: Optional[str] = None
    image_data: Optional[str] = None

class CitizenReportModel(BaseModel):
    id: str
    description: str
    coordinates: List[float]
    number_of_people: int
    emergency_type: str
    ai_category: str
    ai_severity: str
    status: str = "PENDING_VERIFICATION"
    submitted_at: str

class CopilotQueryRequest(BaseModel):
    query: str
    context_zone_id: Optional[str] = None

class CopilotQueryResponse(BaseModel):
    answer: str
    tool_calls: List[Dict[str, Any]] = []
    sources: List[Dict[str, str]] = []
    confidence_label: str = "VERIFIED_PLATFORM_DATA"

class SimulationControlRequest(BaseModel):
    action: str  # START, PAUSE, RESET, SPEED
    speed_multiplier: Optional[int] = 1

class DashboardStateResponse(BaseModel):
    disaster: DisasterModel
    total_affected_population: int
    critical_zones_count: int
    detected_victims_count: int
    active_rescue_teams_count: int
    active_missions_count: int
    available_shelters_count: int
    available_ambulances_count: int
    blocked_roads_count: int
    zones: List[ZoneModel]
    recent_incidents: List[IncidentModel]
    active_missions: List[MissionModel]
    recent_alerts: List[Dict[str, Any]]
    simulation_state: Dict[str, Any]
