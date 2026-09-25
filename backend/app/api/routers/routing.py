from fastapi import APIRouter, Body
from typing import Dict, Any, List
from ...database.memory_store import MemoryStore
from ...services.route_optimizer import RouteOptimizer
from ...services.resource_allocator import ResourceAllocator

router = APIRouter(prefix="/api", tags=["routing"])

@router.post("/routes")
def compute_route(payload: Dict[str, Any] = Body(...)):
    store = MemoryStore.get_instance()
    router_service = RouteOptimizer()

    start_coord = payload.get("start", [20.28, 86.20])
    dest_coord = payload.get("destination", [20.19, 86.43])
    is_water_capable = payload.get("water_capable", True)

    result = router_service.find_best_route(
        start_coord=start_coord,
        dest_coord=dest_coord,
        roads=list(store.roads.values()),
        is_water_capable=is_water_capable
    )
    return result

@router.post("/allocate-resource")
def allocate_resource(payload: Dict[str, Any] = Body(...)):
    store = MemoryStore.get_instance()
    allocator = ResourceAllocator()
    incident_id = payload.get("incident_id", "INC-801")
    incident = store.incidents.get(incident_id)
    if not incident:
        incident = list(store.incidents.values())[0] if store.incidents else {}

    recommendation = allocator.recommend_team_for_incident(
        incident=incident,
        teams=list(store.rescue_teams.values())
    )
    return recommendation
