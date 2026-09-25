import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database.memory_store import MemoryStore
from .services.simulation_engine import SimulationEngine
from .api.websocket import manager
from .api.routers import (
    disasters,
    incidents,
    resources,
    missions,
    routing,
    vision,
    simulation,
    copilot,
    citizen,
    analytics,
    auth,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize MemoryStore singleton
    store = MemoryStore.get_instance()
    sim_engine = SimulationEngine.get_instance()

    # Hook simulation events to websocket broadcasts
    async def on_simulation_broadcast(payload: dict):
        await manager.broadcast_simulation(payload)
        await manager.broadcast_dashboard(payload.get("summary", {}))

    sim_engine.register_listener(on_simulation_broadcast)
    yield

app = FastAPI(
    title="DisasterIQ Backend API",
    description="AI-Powered Disaster Response & Rescue Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local dev and frontend ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(disasters.router)
app.include_router(incidents.router)
app.include_router(resources.router)
app.include_router(missions.router)
app.include_router(routing.router)
app.include_router(vision.router)
app.include_router(simulation.router)
app.include_router(copilot.router)
app.include_router(citizen.router)
app.include_router(analytics.router)

@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    store = MemoryStore.get_instance()
    return store.get_dashboard_summary()

@app.get("/api/alerts")
def get_alerts():
    store = MemoryStore.get_instance()
    return store.alerts

@app.websocket("/ws/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    await manager.connect_dashboard(websocket)
    store = MemoryStore.get_instance()
    # Send initial snapshot upon connection
    await websocket.send_json({"type": "INIT_STATE", "data": store.get_dashboard_summary()})
    try:
        while True:
            data = await websocket.receive_text()
            # Handle client heartbeat or ping
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect_dashboard(websocket)

@app.websocket("/ws/simulation")
async def websocket_simulation(websocket: WebSocket):
    await manager.connect_simulation(websocket)
    sim_engine = SimulationEngine.get_instance()
    store = MemoryStore.get_instance()
    await websocket.send_json({
        "type": "SIM_INIT",
        "step": sim_engine.step,
        "max_steps": sim_engine.max_steps,
        "running": sim_engine.running,
        "timeline": store.timeline_events
    })
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_simulation(websocket)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "platform": "DisasterIQ", "mode": "OPERATIONAL"}
