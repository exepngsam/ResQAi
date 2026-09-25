# DISASTERIQ — Technical Architecture

## 1. System Vision & Paradigm
**DisasterIQ** is an operational decision-support intelligence platform transforming fragmented multi-source emergency telemetry (satellite SAR, drone video, river gauges, IoT sensors, citizen reports) into actionable, explainable rescue operations.

```mermaid
graph TD
    A[Multi-Source Ingestion] -->|Satellite SAR / Drones / CCTV / River Gauges / Citizen Reports| B[FastAPI Gateway]
    B --> C[Spatial Risk Engine]
    B --> D[Route Optimizer - Dijkstra]
    B --> E[Computer Vision Detector]
    B --> F[Resource Allocation Optimizer]
    B --> G[DisasterIQ Copilot RAG]
    
    C --> H[(PostGIS / In-Memory Store)]
    D --> H
    E --> H
    F --> H
    
    H --> I[WebSocket Event Bus]
    I --> J[React + Leaflet GIS Command Center]
    
    J --> K{Human-in-the-Loop}
    K -->|APPROVE| L[Dispatched Field Units / Mobile HUD]
    K -->|REJECT| M[Commander Tactical Overwrite]
```

## 2. Decision Support Guarantee & Human-in-the-Loop
High-impact emergency directives (dispatching rescue teams, reallocating critical trauma resources, mandatory evacuation orders) require explicit human commander approval via `[APPROVE]` and `[REJECT]` interfaces. Automated models provide recommendations with transparent, contributing heuristic reasons.

## 3. Heuristic Risk Scoring Formula
$$\text{Risk Score} = 0.30 \cdot \text{PopRisk} + 0.25 \cdot \text{FloodDepth} + 0.20 \cdot \text{RoadCutoff} + 0.15 \cdot \text{VictimDensity} + 0.10 \cdot \text{HospitalDistance}$$
- 0–25: LOW
- 26–50: MODERATE
- 51–75: HIGH
- 76–100: CRITICAL
