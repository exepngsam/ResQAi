from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, Optional
from datetime import datetime
from ...database.memory_store import MemoryStore
from ...models.schemas import MissionModel

router = APIRouter(prefix="/api/missions", tags=["missions"])

@router.get("")
def list_missions():
    store = MemoryStore.get_instance()
    return list(store.missions.values())

@router.post("")
def create_mission(mission: MissionModel):
    store = MemoryStore.get_instance()
    store.missions[mission.id] = mission.model_dump()
    return {"status": "SUCCESS", "mission": store.missions[mission.id]}

@router.post("/{id}/approve")
def approve_mission(id: str, payload: Dict[str, Any] = Body(default={})):
    """
    CRITICAL HUMAN-IN-THE-LOOP AUTHORIZATION:
    Transitions mission from PENDING_APPROVAL -> APPROVED.
    Updates assigned rescue team status to ASSIGNED.
    """
    store = MemoryStore.get_instance()
    mission = store.missions.get(id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    officer_name = payload.get("officer_name", "Incident Commander (EOC HQ)")
    mission["status"] = "APPROVED"
    mission["approved_by"] = officer_name
    mission["approved_at"] = datetime.utcnow().strftime("%H:%M:%S UTC")

    # Update associated rescue team state
    team_id = mission.get("team_id")
    if team_id and team_id in store.rescue_teams:
        store.rescue_teams[team_id]["status"] = "ASSIGNED"
        store.rescue_teams[team_id]["assigned_mission_id"] = id

    # Add audit log / timeline event
    store.timeline_events.append({
        "time": datetime.utcnow().strftime("%H:%M"),
        "event": f"Human Approval Granted: Mission {id} authorized by {officer_name} -> Deploying {mission.get('team_name')}",
        "type": "DECISION"
    })

    return {
        "status": "APPROVED",
        "message": f"Mission {id} approved by authorized commander. Team dispatched.",
        "mission": mission
    }

@router.post("/{id}/reject")
def reject_mission(id: str, payload: Dict[str, Any] = Body(default={})):
    """
    CRITICAL HUMAN-IN-THE-LOOP AUTHORIZATION:
    Commander rejects automated recommendation.
    """
    store = MemoryStore.get_instance()
    mission = store.missions.get(id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    reason = payload.get("reason", "Commander reassessment")
    mission["status"] = "REJECTED"
    mission["rejection_reason"] = reason

    team_id = mission.get("team_id")
    if team_id and team_id in store.rescue_teams:
        store.rescue_teams[team_id]["status"] = "AVAILABLE"
        store.rescue_teams[team_id]["assigned_mission_id"] = None

    return {
        "status": "REJECTED",
        "message": f"Mission recommendation rejected: {reason}",
        "mission": mission
    }

@router.post("/{id}/status")
def update_mission_status(id: str, payload: Dict[str, Any] = Body(...)):
    """
    Enables status updates (e.g., from Mobile Response field app: ACCEPT, ARRIVED, RESOLVED).
    """
    store = MemoryStore.get_instance()
    mission = store.missions.get(id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing status parameter")

    mission["status"] = new_status
    if new_status in ["COMPLETED", "RESOLVED"]:
        team_id = mission.get("team_id")
        if team_id and team_id in store.rescue_teams:
            store.rescue_teams[team_id]["status"] = "AVAILABLE"
            store.rescue_teams[team_id]["assigned_mission_id"] = None

    return {"status": "UPDATED", "mission": mission}
