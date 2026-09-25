import asyncio
import copy
from typing import Dict, Any, List, Optional
from ..database.memory_store import MemoryStore

class SimulationEngine:
    _instance = None

    def __init__(self):
        self.running = False
        self.step = 0
        self.max_steps = 7
        self.speed_multiplier = 1
        self.base_delay_seconds = 3.0
        self.task: Optional[asyncio.Task] = None
        self.listeners = []

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = SimulationEngine()
        return cls._instance

    def register_listener(self, callback):
        self.listeners.append(callback)

    async def broadcast_state(self, message: Dict[str, Any]):
        for listener in self.listeners:
            try:
                await listener(message)
            except Exception as e:
                pass

    def start(self, speed: int = 1):
        self.speed_multiplier = max(1, min(5, speed))
        if not self.running:
            self.running = True
            try:
                loop = asyncio.get_running_loop()
                self.task = loop.create_task(self._simulation_loop())
            except RuntimeError:
                pass

    def pause(self):
        self.running = False
        if self.task and not self.task.done():
            self.task.cancel()

    def reset(self):
        self.pause()
        self.step = 0
        store = MemoryStore.get_instance()
        store.reset_to_initial()

    async def _simulation_loop(self):
        store = MemoryStore.get_instance()
        try:
            while self.running and self.step < self.max_steps:
                delay = self.base_delay_seconds / self.speed_multiplier
                await asyncio.sleep(delay)
                self.step += 1
                await self._apply_step(self.step, store)
        except asyncio.CancelledError:
            pass
        finally:
            self.running = False

    async def _apply_step(self, step_num: int, store: MemoryStore):
        events = []
        new_alerts = []

        if step_num == 1:
            # Step 1: Upstream Reservoir Discharge
            events.append({"time": "12:47", "event": "Hirakud reservoir opens 12 additional sluice gates; Mahanadi delta surge accelerating.", "type": "WARNING"})
            store.disaster["current_status"] = "SURGE_RISING"

        elif step_num == 2:
            # Step 2: Flood Coverage Rises in Coastal Basin
            z7 = store.zones.get("ZONE-07")
            if z7:
                z7["flood_coverage_pct"] = 88.0
                z7["flood_depth_m"] = 3.4
                z7["risk_score"] = 96
            z3 = store.zones.get("ZONE-03")
            if z3:
                z3["flood_coverage_pct"] = 72.0
            events.append({"time": "12:48", "event": "Zone 7 flood depth increases to 3.4m (+30cm in 30min).", "type": "CRITICAL"})
            new_alerts.append({
                "id": "ALT-201",
                "type": "CRITICAL",
                "title": "Zone 7 Water Level Spike",
                "zone_id": "ZONE-07",
                "message": "Flood stage reached 3.4m. Rooftop evacuation critical window estimated at 45 minutes.",
                "timestamp": "12:48:15",
                "acknowledged": False
            })

        elif step_num == 3:
            # Step 3: Road Washout Verified
            r17 = store.roads.get("R-17")
            if r17:
                r17["status"] = "BLOCKED"
                r17["risk_level"] = "CRITICAL"
            events.append({"time": "12:49", "event": "Satellite SAR imagery confirms Road R-17 totally submerged over 4.2 km stretch.", "type": "CRITICAL"})

        elif step_num == 4:
            # Step 4: Autonomous Route Recalculation
            events.append({"time": "12:50", "event": "Spatial Route Optimizer reroutes RESCUE-04 via Canal Route R-18 (Dodging R-17 washout).", "type": "INFO"})

        elif step_num == 5:
            # Step 5: Mission Approval Triggered & In Transit
            mis = store.missions.get("MIS-801")
            if mis:
                mis["status"] = "APPROVED"
                mis["approved_by"] = "EOC Commander (Simulated Authorization)"
                mis["approved_at"] = "12:51:00"
            team = store.rescue_teams.get("RESCUE-04")
            if team:
                team["status"] = "ASSIGNED"
                team["assigned_mission_id"] = "MIS-801"
            events.append({"time": "12:51", "event": "Commander authorizes MIS-801: RESCUE-04 boats underway to Zone 7.", "type": "DECISION"})
            new_alerts.append({
                "id": "ALT-202",
                "type": "INFO",
                "title": "Mission MIS-801 Dispatched",
                "zone_id": "ZONE-07",
                "message": "NDRF 03 Bn Flood Unit launched 4 Zodiac boats via Canal Corridor R-18.",
                "timestamp": "12:51:20",
                "acknowledged": False
            })

        elif step_num == 6:
            # Step 6: On Scene & Extraction
            mis = store.missions.get("MIS-801")
            if mis:
                mis["status"] = "ON_SCENE"
            z7 = store.zones.get("ZONE-07")
            if z7:
                z7["possible_victims"] = 4  # 10 evacuated
            events.append({"time": "12:52", "event": "RESCUE-04 arrived on scene at Erasama School. 10 of 14 victims secured aboard life rafts.", "type": "INFO"})

        elif step_num == 7:
            # Step 7: Mission Resolved & Stabilization
            mis = store.missions.get("MIS-801")
            if mis:
                mis["status"] = "COMPLETED"
            z7 = store.zones.get("ZONE-07")
            if z7:
                z7["possible_victims"] = 0
                z7["risk_score"] = 64
                z7["risk_level"] = "HIGH"
            team = store.rescue_teams.get("RESCUE-04")
            if team:
                team["status"] = "AVAILABLE"
                team["assigned_mission_id"] = None
            events.append({"time": "12:53", "event": "All 14 victims transported safely to Erasama Relief Bunker. Medical checkups underway.", "type": "SUCCESS"})
            new_alerts.append({
                "id": "ALT-203",
                "type": "INFO",
                "title": "Zone 7 Rescue Mission Successful",
                "zone_id": "ZONE-07",
                "message": "14 civilians evacuated with zero casualties. Mission MIS-801 completed.",
                "timestamp": "12:53:00",
                "acknowledged": False
            })

        store.timeline_events.extend(events)
        store.alerts.extend(new_alerts)

        # Broadcast real-time update
        payload = {
            "type": "SIMULATION_TICK",
            "step": self.step,
            "max_steps": self.max_steps,
            "running": self.running,
            "events": events,
            "new_alerts": new_alerts,
            "summary": store.get_dashboard_summary()
        }
        await self.broadcast_state(payload)
