from typing import Dict, Any, List, Optional
from .route_optimizer import RouteOptimizer

class ResourceAllocator:
    def __init__(self):
        self.router = RouteOptimizer()

    def recommend_team_for_incident(
        self,
        incident: Dict[str, Any],
        teams: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Recommends best response team based on:
        1. Availability (AVAILABLE status prioritized)
        2. Capability (Flood rescue vs Aero-medical vs General)
        3. Proximity (Shortest distance / travel ETA)
        """
        dest_coord = incident.get("coordinates", [20.35, 86.10])
        water_level = incident.get("water_level_m", 1.0)
        category = incident.get("category", "FLOOD_RESCUE")

        candidates = []
        for team in teams:
            status = team.get("status", "AVAILABLE")
            if status not in ["AVAILABLE", "ASSIGNED"]:
                continue

            dist = self.router.haversine_distance(team.get("coordinates", [20.0, 85.0]), dest_coord)
            capability = team.get("capability", "")

            # Score capability match
            cap_score = 1.0
            if water_level > 2.0 and "Boat" not in capability and "Flood" not in capability:
                cap_score = 0.3  # Penalty for non-water capable teams in deep water
            elif "Flood" in capability:
                cap_score = 1.5

            if status == "AVAILABLE":
                avail_multiplier = 1.0
            else:
                avail_multiplier = 0.5

            # Calculate composite suitability score (higher is better)
            # Distance penalty: 1 / (1 + dist)
            score = (100.0 / (1.0 + dist)) * cap_score * avail_multiplier
            candidates.append({
                "team": team,
                "distance_km": round(dist, 1),
                "eta_min": max(6, int(dist * 1.5)),
                "suitability_score": score
            })

        if not candidates:
            return None

        candidates.sort(key=lambda x: x["suitability_score"], reverse=True)
        best = candidates[0]
        team = best["team"]

        # Formulate explicit reasoning
        reason = (
            f"Closest available team ({best['distance_km']} km, ETA ~{best['eta_min']} min) "
            f"equipped with {team.get('capability', 'general response')} and {team.get('boats_assigned', 0)} boats."
        )

        return {
            "recommended_team_id": team["id"],
            "recommended_team_name": team["name"],
            "distance_km": best["distance_km"],
            "estimated_eta_min": best["eta_min"],
            "capability": team.get("capability"),
            "reason": reason,
            "alternatives": [
                {
                    "team_id": c["team"]["id"],
                    "team_name": c["team"]["name"],
                    "distance_km": c["distance_km"],
                    "eta_min": c["eta_min"]
                }
                for c in candidates[1:3]
            ]
        }
