import pytest
from backend.app.services.risk_engine import RiskEngine

def test_risk_engine_calculation():
    engine = RiskEngine()
    critical_zone = {
        "population": 90000,
        "flood_coverage_pct": 85,
        "blocked_access_roads": 3,
        "possible_victims": 40,
        "closest_hospital_km": 30.0
    }
    result = engine.calculate_zone_risk(critical_zone)
    assert result["risk_score"] > 70
    assert result["risk_level"] in ["HIGH", "CRITICAL"]
    assert len(result["contributing_factors"]) > 0

def test_risk_engine_low_risk():
    engine = RiskEngine()
    low_zone = {
        "population": 5000,
        "flood_coverage_pct": 10,
        "blocked_access_roads": 0,
        "possible_victims": 0,
        "closest_hospital_km": 2.0
    }
    result = engine.calculate_zone_risk(low_zone)
    assert result["risk_score"] <= 35
    assert result["risk_level"] in ["LOW", "MODERATE"]
