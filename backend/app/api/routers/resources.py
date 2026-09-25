from fastapi import APIRouter
from ...database.memory_store import MemoryStore

router = APIRouter(prefix="/api", tags=["resources"])

@router.get("/resources")
def get_all_resources():
    store = MemoryStore.get_instance()
    return {
        "rescue_teams": list(store.rescue_teams.values()),
        "ambulances": list(store.ambulances.values()),
        "shelters": list(store.shelters.values()),
        "hospitals": list(store.hospitals.values())
    }

@router.get("/rescue-teams")
def get_rescue_teams():
    store = MemoryStore.get_instance()
    return list(store.rescue_teams.values())

@router.get("/shelters")
def get_shelters():
    store = MemoryStore.get_instance()
    return list(store.shelters.values())

@router.get("/hospitals")
def get_hospitals():
    store = MemoryStore.get_instance()
    return list(store.hospitals.values())
