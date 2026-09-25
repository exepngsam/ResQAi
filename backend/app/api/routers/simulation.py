from fastapi import APIRouter, Body
from typing import Dict, Any
from ...services.simulation_engine import SimulationEngine
from ...database.memory_store import MemoryStore

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

@router.post("/start")
async def start_simulation(payload: Dict[str, Any] = Body(default={})):
    speed = payload.get("speed", 1)
    engine = SimulationEngine.get_instance()
    engine.start(speed=speed)
    return {
        "status": "RUNNING",
        "step": engine.step,
        "max_steps": engine.max_steps,
        "speed": engine.speed_multiplier
    }

@router.post("/pause")
async def pause_simulation():
    engine = SimulationEngine.get_instance()
    engine.pause()
    return {"status": "PAUSED", "step": engine.step}

@router.post("/reset")
async def reset_simulation():
    engine = SimulationEngine.get_instance()
    engine.reset()
    store = MemoryStore.get_instance()
    return {
        "status": "RESET",
        "step": 0,
        "summary": store.get_dashboard_summary()
    }

@router.get("/state")
def get_simulation_state():
    engine = SimulationEngine.get_instance()
    store = MemoryStore.get_instance()
    return {
        "running": engine.running,
        "step": engine.step,
        "max_steps": engine.max_steps,
        "speed": engine.speed_multiplier,
        "timeline_events": store.timeline_events
    }
