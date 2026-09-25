# DISASTERIQ — API Reference

## Base URL
`http://localhost:8000/api`

## Endpoints

### 1. Disasters & Situational Telemetry
- `GET /api/disasters` — Returns active disaster events and operational center coordinates.
- `GET /api/disasters/{id}` — Returns specific disaster metadata.
- `GET /api/dashboard/summary` — Composite snapshot of disaster state, critical counts, zones, incidents, and missions.
- `GET /api/zones` — GeoJSON polygon boundaries, flood depth, population, and heuristic risk scores.
- `GET /api/zones/{id}` — Individual zone telemetry and contributing factors.

### 2. Incidents & Prioritization (P1..P4)
- `GET /api/incidents` — List active incidents with optional query filters `?priority=P1&severity=CRITICAL`.
- `POST /api/incidents` — Log new field or drone-detected incident.
- `GET /api/incidents/{id}` — Incident details and recommended mitigation tactic.

### 3. Resource & Fleet Management
- `GET /api/resources` — Composite inventory of rescue teams, boats, ambulances, shelters, and trauma centers.
- `GET /api/rescue-teams` — Active responder status (AVAILABLE, ASSIGNED, BUSY).
- `GET /api/shelters` — Relief camps, occupancy percentages, and potable water reserves.
- `GET /api/hospitals` — Trauma levels, ICU surge availability, and bed counts.

### 4. Missions & Human-in-the-Loop Approval
- `GET /api/missions` — List active and pending operational missions.
- `POST /api/missions` — Create new AI mission recommendation.
- `POST /api/missions/{id}/approve` — **AUTHORIZATION:** Officer signs and activates mission dispatch.
- `POST /api/missions/{id}/reject` — **REJECTION:** Officer rejects recommendation with audit rationale.
- `POST /api/missions/{id}/status` — Field responder status update (`IN_TRANSIT`, `ARRIVED`, `RESOLVED`).

### 5. Spatial Routing & Resource Optimization
- `POST /api/routes` — Computes shortest safe route and alternative escape path dodging flooded/blocked roads.
- `POST /api/allocate-resource` — Matches incident needs with closest available capable unit.

### 6. Computer Vision Analysis
- `POST /api/analyze/image` — Ingest drone or CCTV imagery for flood coverage and victim cluster bounding boxes.
- `POST /api/analyze/video` — Video feed stream inference.

### 7. Simulation Controls
- `POST /api/simulation/start` — Start step-by-step deterministic disaster simulation (`{"speed": 1|2|5}`).
- `POST /api/simulation/pause` — Pause simulation ticker.
- `POST /api/simulation/reset` — Reset state back to initial baseline.
- `GET /api/simulation/state` — Step index and live event timeline.

### 8. DisasterIQ Copilot & RAG
- `POST /api/copilot/query` — Natural language operational query answering with tool invocations and NDMA SOP citations.

### 9. Citizen Reporting
- `POST /api/citizen-report` — Civilian emergency report with GPS coordinates and automated AI triage.
- `GET /api/citizen-reports` — Review queued citizen reports.

## WebSockets
- `WS /ws/dashboard` — Live dashboard delta updates.
- `WS /ws/simulation` — Live simulation ticks and timeline events.
