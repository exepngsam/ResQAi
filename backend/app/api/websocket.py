import json
from typing import List
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.dashboard_connections: List[WebSocket] = []
        self.simulation_connections: List[WebSocket] = []

    async def connect_dashboard(self, websocket: WebSocket):
        await websocket.accept()
        self.dashboard_connections.append(websocket)

    def disconnect_dashboard(self, websocket: WebSocket):
        if websocket in self.dashboard_connections:
            self.dashboard_connections.remove(websocket)

    async def connect_simulation(self, websocket: WebSocket):
        await websocket.accept()
        self.simulation_connections.append(websocket)

    def disconnect_simulation(self, websocket: WebSocket):
        if websocket in self.simulation_connections:
            self.simulation_connections.remove(websocket)

    async def broadcast_dashboard(self, data: dict):
        text = json.dumps(data)
        disconnected = []
        for connection in self.dashboard_connections:
            try:
                await connection.send_text(text)
            except Exception:
                disconnected.append(connection)
        for dead in disconnected:
            self.disconnect_dashboard(dead)

    async def broadcast_simulation(self, data: dict):
        text = json.dumps(data)
        disconnected = []
        for connection in self.simulation_connections:
            try:
                await connection.send_text(text)
            except Exception:
                disconnected.append(connection)
        for dead in disconnected:
            self.disconnect_simulation(dead)

manager = ConnectionManager()
