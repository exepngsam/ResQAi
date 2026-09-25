from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ...database.memory_store import MemoryStore
from ...services.risk_engine import RiskEngine

router = APIRouter(prefix="/api", tags=["disasters"])

@router.get("/disasters")
def get_disasters():
    store = MemoryStore.get_instance()
    return [store.disaster]

@router.get("/disasters/{id}")
def get_disaster(id: str):
    store = MemoryStore.get_instance()
    if store.disaster.get("id") == id:
        return store.disaster
    raise HTTPException(status_code=404, detail="Disaster event not found")

@router.get("/zones")
def get_zones():
    store = MemoryStore.get_instance()
    risk_engine = RiskEngine(store.risk_weights)
    
    # Recalculate dynamic risk on read
    results = []
    for z in store.zones.values():
        calc = risk_engine.calculate_zone_risk(z)
        merged = {**z, **calc}
        results.append(merged)
    return results

@router.get("/zones/{id}")
def get_zone(id: str):
    store = MemoryStore.get_instance()
    zone = store.zones.get(id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    risk_engine = RiskEngine(store.risk_weights)
    calc = risk_engine.calculate_zone_risk(zone)
    return {**zone, **calc}
