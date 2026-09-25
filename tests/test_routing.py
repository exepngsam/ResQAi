import pytest
from backend.app.services.route_optimizer import RouteOptimizer

def test_haversine_distance():
    router = RouteOptimizer()
    dist = router.haversine_distance([20.46, 85.88], [20.35, 85.82])
    assert 10.0 < dist < 20.0

def test_erasama_waterway_reroute():
    router = RouteOptimizer()
    start = [20.28, 86.20]
    dest = [20.19, 86.43]
    result = router.find_best_route(start, dest, [], is_water_capable=True)
    assert result["recommended_route"]["is_safe"] is True
    assert "R-17" in result["blocked_corridors_avoided"]
