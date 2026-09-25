import json
import os
import copy
from threading import Lock
from typing import Dict, Any, List, Optional
from datetime import datetime

class MemoryStore:
    _instance = None
    _lock = Lock()

    def __init__(self):
        self.disaster = {}
        self.zones: Dict[str, Dict[str, Any]] = {}
        self.roads: Dict[str, Dict[str, Any]] = {}
        self.hospitals: Dict[str, Dict[str, Any]] = {}
        self.shelters: Dict[str, Dict[str, Any]] = {}
        self.rescue_teams: Dict[str, Dict[str, Any]] = {}
        self.ambulances: Dict[str, Dict[str, Any]] = {}
        self.incidents: Dict[str, Dict[str, Any]] = {}
        self.missions: Dict[str, Dict[str, Any]] = {}
        self.citizen_reports: Dict[str, Dict[str, Any]] = {}
        self.alerts: List[Dict[str, Any]] = []
        self.timeline_events: List[Dict[str, Any]] = []
        self.risk_weights = {
            "population_weight": 0.30,
            "flood_coverage_weight": 0.25,
            "road_access_weight": 0.20,
            "victim_count_weight": 0.15,
            "hospital_distance_weight": 0.10
        }
        self.system_settings = {
            "mode": "DEMO_SIMULATION",  # or REAL_AI
            "offline_sync_queue": 7,
            "system_health": "OPTIMAL_99.98",
            "last_ingestion_epoch": datetime.utcnow().isoformat() + "Z"
        }
        self.load_initial_data()

    @classmethod
    def get_instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = MemoryStore()
            return cls._instance

    def load_initial_data(self):
        # Resolve data path relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        data_file = os.path.abspath(os.path.join(current_dir, "..", "..", "..", "data", "demo", "odisha_flood.json"))
        
        if os.path.exists(data_file):
            with open(data_file, "r", encoding="utf-8") as f:
                raw = json.load(f)
                self.disaster = raw.get("disaster", {})
                self.zones = {z["id"]: copy.deepcopy(z) for z in raw.get("zones", [])}
                self.roads = {r["id"]: copy.deepcopy(r) for r in raw.get("roads", [])}
                self.hospitals = {h["id"]: copy.deepcopy(h) for h in raw.get("hospitals", [])}
                self.shelters = {s["id"]: copy.deepcopy(s) for s in raw.get("shelters", [])}
                self.rescue_teams = {t["id"]: copy.deepcopy(t) for t in raw.get("rescue_teams", [])}
                self.ambulances = {a["id"]: copy.deepcopy(a) for a in raw.get("ambulances", [])}
                self.incidents = {i["id"]: copy.deepcopy(i) for i in raw.get("incidents", [])}
        else:
            print(f"Warning: Demo data file not found at {data_file}")

        # Seed initial mission proposal for Human-in-the-Loop demonstration
        self.missions["MIS-801"] = {
            "id": "MIS-801",
            "incident_id": "INC-801",
            "incident_title": "14 Possible Victims Stranded on Submerged School Rooftop",
            "zone_id": "ZONE-07",
            "team_id": "RESCUE-04",
            "team_name": "NDRF 03 Bn Flood Specialist Unit",
            "priority": "P1",
            "status": "PENDING_APPROVAL",
            "destination": [20.19, 86.43],
            "estimated_eta_min": 11,
            "recommended_route_id": "R-18",
            "approval_required": True,
            "approved_by": None,
            "approved_at": None,
            "reason": "14 possible victims + nearest flood-capable team with 4 motorized boats + safe canal route R-18 avoids blocked R-17"
        }

        # Seed initial alerts
        self.alerts = [
            {
                "id": "ALT-101",
                "type": "CRITICAL",
                "title": "Possible Victims Detected in Zone 7",
                "zone_id": "ZONE-07",
                "message": "Aerial drone pass verified 14 possible individuals stranded on submerged rooftop.",
                "timestamp": "12:43:10",
                "acknowledged": False
            },
            {
                "id": "ALT-102",
                "type": "WARNING",
                "title": "Road R-17 Inundated & Impassable",
                "zone_id": "ZONE-07",
                "message": "Water velocity > 1.8 m/s scoured culvert. Divert all emergency convoys to Canal Route R-18.",
                "timestamp": "12:42:00",
                "acknowledged": True
            },
            {
                "id": "ALT-103",
                "type": "INFO",
                "title": "Rescue Unit RESCUE-01 Deployed to Zone 4",
                "zone_id": "ZONE-04",
                "message": "Senior citizen residential evacuation mission in progress.",
                "timestamp": "12:35:40",
                "acknowledged": True
            }
        ]

        # Seed initial timeline
        self.timeline_events = [
            {"time": "12:40", "event": "Flood telemetry detected at Mahanadi delta gauge (+1.8m above danger mark)", "type": "INFO"},
            {"time": "12:41", "event": "Zone 4 Cuttack Outer Sector classified as HIGH risk", "type": "WARNING"},
            {"time": "12:42", "event": "Road R-17 washed out; secondary canal waterway activated", "type": "CRITICAL"},
            {"time": "12:43", "event": "14 possible victims detected in Zone 7 Erasama coastal basin", "type": "CRITICAL"},
            {"time": "12:44", "event": "AI response proposal generated: Dispatch RESCUE-04 to Zone 7 (Pending Human Approval)", "type": "DECISION"},
            {"time": "12:45", "event": "Alternative watercraft route R-18 calculated (ETA 11 min)", "type": "INFO"},
            {"time": "12:46", "event": "SCB Medical College pre-staged 34 trauma beds for incoming evacuees", "type": "INFO"}
        ]

    def reset_to_initial(self):
        with self._lock:
            self.load_initial_data()

    def get_dashboard_summary(self) -> Dict[str, Any]:
        with self._lock:
            total_affected = sum(z.get("population", 0) for z in self.zones.values())
            critical_zones = sum(1 for z in self.zones.values() if z.get("risk_level") == "CRITICAL")
            detected_victims = sum(z.get("possible_victims", 0) for z in self.zones.values())
            active_teams = sum(1 for t in self.rescue_teams.values() if t.get("status") in ["AVAILABLE", "ASSIGNED"])
            active_missions = sum(1 for m in self.missions.values() if m.get("status") in ["IN_TRANSIT", "APPROVED", "ON_SCENE"])
            avail_shelters = sum(1 for s in self.shelters.values() if s.get("status") == "AVAILABLE")
            avail_ambulances = sum(1 for a in self.ambulances.values() if a.get("status") == "AVAILABLE")
            blocked_roads = sum(1 for r in self.roads.values() if r.get("status") == "BLOCKED")

            return {
                "disaster": self.disaster,
                "total_affected_population": total_affected,
                "critical_zones_count": critical_zones,
                "detected_victims_count": detected_victims,
                "active_rescue_teams_count": active_teams,
                "active_missions_count": active_missions,
                "available_shelters_count": avail_shelters,
                "available_ambulances_count": avail_ambulances,
                "blocked_roads_count": blocked_roads,
                "zones": list(self.zones.values()),
                "recent_incidents": list(self.incidents.values()),
                "active_missions": list(self.missions.values()),
                "recent_alerts": self.alerts,
                "simulation_state": {
                    "running": False,
                    "step": 4,
                    "max_steps": 8,
                    "scenario": "ODISHA_FLOOD_CAT_4"
                }
            }
