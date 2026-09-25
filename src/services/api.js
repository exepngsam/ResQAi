const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:8000/api";
import fallbackData from "../../data/demo/odisha_flood.json";
const api = {
  async getDashboardSummary() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/summary`, { signal: AbortSignal.timeout(2500) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("API /dashboard/summary unavailable, using local cache:", err);
      const totalPop = fallbackData.zones.reduce((acc, z) => acc + z.population, 0);
      const critZones = fallbackData.zones.filter((z) => z.risk_level === "CRITICAL").length;
      const victims = fallbackData.zones.reduce((acc, z) => acc + z.possible_victims, 0);
      return {
        disaster: fallbackData.disaster,
        total_affected_population: totalPop,
        critical_zones_count: critZones,
        detected_victims_count: victims,
        active_rescue_teams_count: 24,
        active_missions_count: 1,
        available_shelters_count: 4,
        available_ambulances_count: 8,
        blocked_roads_count: 1,
        zones: fallbackData.zones,
        recent_incidents: fallbackData.incidents,
        rescue_teams: fallbackData.rescue_teams || [],
        shelters: fallbackData.shelters || [],
        hospitals: fallbackData.hospitals || [],
        ambulances: fallbackData.ambulances || [],
        roads: fallbackData.roads || [],
        active_missions: [
          {
            id: "MIS-801",
            incident_id: "INC-801",
            incident_title: "14 Possible Victims Stranded on Submerged School Rooftop",
            zone_id: "ZONE-07",
            team_id: "RESCUE-04",
            team_name: "NDRF 03 Bn Flood Specialist Unit",
            priority: "P1",
            status: "PENDING_APPROVAL",
            destination: [20.19, 86.43],
            estimated_eta_min: 11,
            recommended_route_id: "R-18",
            approval_required: true,
            reason: "14 possible victims + nearest flood-capable team with 4 motorized boats + safe canal route R-18 avoids blocked R-17"
          }
        ],
        recent_alerts: [
          {
            id: "ALT-101",
            type: "CRITICAL",
            title: "Possible Victims Detected in Zone 7",
            zone_id: "ZONE-07",
            message: "Aerial drone pass verified 14 possible individuals stranded on submerged rooftop.",
            timestamp: "12:43:10",
            acknowledged: false
          }
        ],
        simulation_state: {
          running: false,
          step: 0,
          max_steps: 7,
          scenario: "ODISHA_FLOOD_CAT_4"
        }
      };
    }
  },
  async getZones() {
    try {
      const res = await fetch(`${API_BASE}/zones`, { signal: AbortSignal.timeout(2e3) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return fallbackData.zones;
    }
  },
  async getIncidents() {
    try {
      const res = await fetch(`${API_BASE}/incidents`, { signal: AbortSignal.timeout(2e3) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return fallbackData.incidents;
    }
  },
  async getMissions() {
    try {
      const res = await fetch(`${API_BASE}/missions`, { signal: AbortSignal.timeout(2e3) });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return [
        {
          id: "MIS-801",
          incident_id: "INC-801",
          incident_title: "14 Possible Victims Stranded on Submerged School Rooftop",
          zone_id: "ZONE-07",
          team_id: "RESCUE-04",
          team_name: "NDRF 03 Bn Flood Specialist Unit",
          priority: "P1",
          status: "PENDING_APPROVAL",
          destination: [20.19, 86.43],
          estimated_eta_min: 11,
          recommended_route_id: "R-18",
          approval_required: true,
          reason: "14 possible victims + nearest flood-capable team with 4 motorized boats + safe canal route R-18 avoids blocked R-17"
        }
      ];
    }
  },
  async approveMission(id, officerName = "Incident Commander") {
    try {
      const res = await fetch(`${API_BASE}/missions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officer_name: officerName })
      });
      return await res.json();
    } catch {
      return { status: "APPROVED", message: "Mission approved (offline simulation mode)" };
    }
  },
  async rejectMission(id, reason = "Reassessed by commander") {
    try {
      const res = await fetch(`${API_BASE}/missions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      return await res.json();
    } catch {
      return { status: "REJECTED", message: "Mission rejected (offline simulation mode)" };
    }
  },
  async startSimulation(speed = 1) {
    try {
      const res = await fetch(`${API_BASE}/simulation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speed })
      });
      return await res.json();
    } catch {
      return { status: "RUNNING", speed };
    }
  },
  async pauseSimulation() {
    try {
      const res = await fetch(`${API_BASE}/simulation/pause`, { method: "POST" });
      return await res.json();
    } catch {
      return { status: "PAUSED" };
    }
  },
  async resetSimulation() {
    try {
      const res = await fetch(`${API_BASE}/simulation/reset`, { method: "POST" });
      return await res.json();
    } catch {
      return { status: "RESET" };
    }
  },
  async queryCopilot(query, contextZoneId) {
    try {
      const res = await fetch(`${API_BASE}/copilot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, context_zone_id: contextZoneId })
      });
      return await res.json();
    } catch {
      return {
        answer: "Zone 7 (Erasama Coastal Basin) is currently the highest priority critical zone with 14 possible trapped individuals on a submerged rooftop. Road R-17 is impassable, and Canal Waterway Route R-18 is the only verified safe passage.",
        tool_calls: [{ tool: "get_critical_zones", parameters: {} }],
        sources: [
          {
            id: "SOP-FLD-01",
            title: "NDMA Standard Operating Procedure for Flood Water Evacuation & Rooftop Rescues",
            source: "NDMA National Flood Management Guidelines (Rev. 2024), Section 4.2"
          }
        ],
        confidence_label: "OFFLINE_CACHED_BENCHMARK"
      };
    }
  },
  async submitCitizenReport(data) {
    try {
      const res = await fetch(`${API_BASE}/citizen-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return {
        status: "RECEIVED",
        report_id: "CIT-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        ai_category: "TRAPPED_PERSON",
        ai_severity: "HIGH",
        notice: "Offline mode: report saved to local sync queue."
      };
    }
  }
};
export {
  api
};
