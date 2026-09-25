from fastapi import APIRouter
from ...database.memory_store import MemoryStore

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("")
def get_analytics():
    store = MemoryStore.get_instance()
    summary = store.get_dashboard_summary()

    # Time series disaster progression (deterministic for demo fidelity)
    progression_series = [
        {"time": "06:00", "water_level_m": 0.8, "affected_pop": 24000, "critical_zones": 1},
        {"time": "08:00", "water_level_m": 1.4, "affected_pop": 52000, "critical_zones": 3},
        {"time": "10:00", "water_level_m": 2.1, "affected_pop": 89000, "critical_zones": 5},
        {"time": "12:00", "water_level_m": 2.9, "affected_pop": 126420, "critical_zones": 8},
        {"time": "14:00", "water_level_m": 3.1, "affected_pop": 138000, "critical_zones": 8}
    ]

    # Resource distribution metrics
    resource_utilization = {
        "rescue_boats": {"total": 15, "active": 9, "standby": 6},
        "ambulances": {"total": 10, "active": 4, "standby": 6},
        "shelter_beds": {"total": 6100, "occupied": 3590, "available": 2510},
        "hospital_icu_beds": {"total": 73, "occupied": 48, "available": 25}
    }

    # Incident resolution stats
    incident_stats = {
        "total_incidents": 18,
        "resolved_incidents": 12,
        "active_incidents": 6,
        "avg_response_time_min": 14.2,
        "evacuated_civilians": 842
    }

    return {
        "summary": summary,
        "progression_series": progression_series,
        "resource_utilization": resource_utilization,
        "incident_stats": incident_stats
    }
