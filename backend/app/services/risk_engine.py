from typing import Dict, Any, List

class RiskEngine:
    def __init__(self, weights: Dict[str, float] = None):
        self.weights = weights or {
            "population_weight": 0.30,
            "flood_coverage_weight": 0.25,
            "road_access_weight": 0.20,
            "victim_count_weight": 0.15,
            "hospital_distance_weight": 0.10
        }

    def update_weights(self, new_weights: Dict[str, float]):
        self.weights.update(new_weights)

    def calculate_zone_risk(self, zone: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates a heuristic risk score (0-100) based on weighted factors.
        Decision-support heuristic; clearly labeled as non-validated.
        """
        # Normalize population (0 - 100k)
        pop = zone.get("population", 0)
        norm_pop = min(100.0, (pop / 100000.0) * 100.0)

        # Flood coverage percentage (0 - 100)
        flood_cov = min(100.0, float(zone.get("flood_coverage_pct", 0)))

        # Blocked roads penalty (each blocked road adds 33.3%, max 3)
        blocked_roads = zone.get("blocked_access_roads", 0)
        norm_road_risk = min(100.0, blocked_roads * 33.33)

        # Possible victims (0 - 100 victims scale)
        victims = zone.get("possible_victims", 0)
        norm_victims = min(100.0, (victims / 100.0) * 100.0)

        # Hospital distance penalty (0 - 40km scale)
        hosp_km = zone.get("closest_hospital_km", 10.0)
        norm_hosp = min(100.0, (hosp_km / 40.0) * 100.0)

        score = (
            (norm_pop * self.weights["population_weight"]) +
            (flood_cov * self.weights["flood_coverage_weight"]) +
            (norm_road_risk * self.weights["road_access_weight"]) +
            (norm_victims * self.weights["victim_count_weight"]) +
            (norm_hosp * self.weights["hospital_distance_weight"])
        )
        score_int = int(round(max(0.0, min(100.0, score))))

        if score_int <= 25:
            level = "LOW"
        elif score_int <= 50:
            level = "MODERATE"
        elif score_int <= 75:
            level = "HIGH"
        else:
            level = "CRITICAL"

        # Generate explainable contributing factors
        factors: List[str] = []
        if flood_cov > 60:
            factors.append(f"Severe inundation coverage ({flood_cov:.0f}%)")
        if victims > 10:
            factors.append(f"{victims} possible victims awaiting evacuation")
        if blocked_roads >= 2:
            factors.append(f"{blocked_roads} key access corridors impassable")
        if hosp_km > 20:
            factors.append(f"Significant distance to Level 1 emergency hospital ({hosp_km:.1f} km)")
        if pop > 50000:
            factors.append(f"High population density area ({pop:,} citizens)")

        if not factors:
            factors.append("Nominal environmental parameters within manageable baseline threshold")

        return {
            "risk_score": score_int,
            "risk_level": level,
            "contributing_factors": factors,
            "disclaimer": "Decision-support heuristic score calculated based on current operational inputs."
        }
