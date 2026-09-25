import pytest
import asyncio
from backend.app.database.memory_store import MemoryStore
from backend.app.services.simulation_engine import SimulationEngine

@pytest.mark.asyncio
async def test_simulation_reset_and_step():
    store = MemoryStore.get_instance()
    store.reset_to_initial()
    engine = SimulationEngine.get_instance()
    engine.reset()
    assert engine.step == 0
    assert len(store.zones) == 8

    # Apply step 1
    await engine._apply_step(1, store)
    assert store.disaster["current_status"] == "SURGE_RISING"

    # Reset back to pristine state
    engine.reset()
    assert engine.step == 0
