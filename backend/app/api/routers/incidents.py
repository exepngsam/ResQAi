from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime
from ...database.memory_store import MemoryStore
from ...models.schemas import IncidentModel

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

@router.get("")
def list_incidents(priority: str = None, severity: str = None):
    store = MemoryStore.get_instance()
    items = list(store.incidents.values())
    if priority:
        items = [i for i in items if i.get("priority") == priority.upper()]
    if severity:
        items = [i for i in items if i.get("severity") == severity.upper()]
    return items

@router.get("/{id}")
def get_incident(id: str):
    store = MemoryStore.get_instance()
    incident = store.incidents.get(id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("")
def create_incident(data: IncidentModel):
    store = MemoryStore.get_instance()
    store.incidents[data.id] = data.model_dump()
    return {"status": "SUCCESS", "incident": store.incidents[data.id]}
