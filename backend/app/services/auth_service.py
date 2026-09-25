import os
import json
import time
import hmac
import hashlib
import base64
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone

JWT_SECRET = os.getenv("JWT_SECRET", "9a75864ef63e6f47348e9ea3ed8e422f5e0754cd8bb9683ec16940c7d88aa06f")

OFFICERS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "OFF-001",
        "name": "Commander Rajesh Kumar",
        "badge_id": "NDRF-CMD-082",
        "role": "INCIDENT_COMMANDER",
        "role_display": "Incident Commander",
        "agency": "NDRF 03rd Battalion (Mundali)",
        "clearance_level": "LEVEL 4 — FULL HITL APPROVAL",
        "duty_station": "Odisha State EOC Bhubaneswar",
        "avatar_initials": "RK",
        "permissions": ["APPROVE_MISSION", "DEPLOY_MILITARY", "BROADCAST_ALERT", "OVERRIDE_ROUTING"]
    },
    {
        "id": "OFF-002",
        "name": "Captain Sunita Rao",
        "badge_id": "ODRAF-OPS-114",
        "role": "TACTICAL_OPS_LEAD",
        "role_display": "Tactical Operations Lead",
        "agency": "ODRAF Coastal Taskforce",
        "clearance_level": "LEVEL 3 — TACTICAL DISPATCH",
        "duty_station": "District Control Paradip",
        "avatar_initials": "SR",
        "permissions": ["DISPATCH_UNITS", "UPDATE_INCIDENT", "REQUEST_SUPPLIES"]
    },
    {
        "id": "OFF-003",
        "name": "Dr. Alok Sen, GISP",
        "badge_id": "ORSA-GIS-409",
        "role": "GIS_SPECIALIST",
        "role_display": "Senior GIS Specialist",
        "agency": "Odisha Remote Sensing Application Centre",
        "clearance_level": "LEVEL 3 — GEOSPATIAL EDIT",
        "duty_station": "Spatial Analytics Lab",
        "avatar_initials": "AS",
        "permissions": ["EDIT_HAZARD_ZONES", "PUBLISH_TILESETS", "INUNDATION_MODELING"]
    },
    {
        "id": "OFF-004",
        "name": "Inspector Amit Patnaik",
        "badge_id": "FIRE-RES-219",
        "role": "FIELD_RESCUE_LEADER",
        "role_display": "Field Rescue Team Leader",
        "agency": "Odisha Fire & Disaster Response",
        "clearance_level": "LEVEL 2 — FIELD HUD",
        "duty_station": "Erasama Rapid Response Unit",
        "avatar_initials": "AP",
        "permissions": ["REPORT_EXTRICATION", "TRIAGE_VICTIMS", "RADIO_TELEMETRY"]
    }
]

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4)) if (len(data) % 4) != 0 else ''
    return base64.urlsafe_b64decode(data + padding)

def create_jwt_token(payload: Dict[str, Any], secret: str = JWT_SECRET) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    header_encoded = base64url_encode(json.dumps(header).encode('utf-8'))
    payload_encoded = base64url_encode(json.dumps(payload).encode('utf-8'))
    signing_input = f"{header_encoded}.{payload_encoded}".encode('utf-8')
    signature = hmac.new(secret.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_encoded = base64url_encode(signature)
    return f"{header_encoded}.{payload_encoded}.{sig_encoded}"

def verify_jwt_token(token: str, secret: str = JWT_SECRET) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(secret.encode('utf-8'), signing_input, hashlib.sha256).digest()
        if not hmac.compare_digest(base64url_encode(expected_sig), sig_b64):
            return None
        payload = json.loads(base64url_decode(payload_b64).decode('utf-8'))
        if payload.get("exp") and payload["exp"] < time.time():
            return None
        return payload
    except Exception:
        return None

class AuthService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = AuthService()
        return cls._instance

    def list_officers(self) -> List[Dict[str, Any]]:
        return OFFICERS_DATABASE

    def authenticate_officer(self, officer_id: Optional[str] = None, badge_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        officer = None
        for off in OFFICERS_DATABASE:
            if officer_id and off["id"].upper() == officer_id.upper():
                officer = off
                break
            if badge_id and off["badge_id"].upper() == badge_id.upper():
                officer = off
                break
        
        # Default to first commander if none matched for demo ease
        if not officer and not officer_id and not badge_id:
            officer = OFFICERS_DATABASE[0]

        if not officer:
            return None

        now_utc = datetime.now(timezone.utc)
        login_timestamp = int(now_utc.timestamp())
        login_time_iso = now_utc.isoformat()
        login_time_display = now_utc.strftime("%H:%M:%S UTC")

        payload = {
            "sub": officer["id"],
            "name": officer["name"],
            "badge_id": officer["badge_id"],
            "role": officer["role"],
            "agency": officer["agency"],
            "clearance_level": officer["clearance_level"],
            "login_time_iso": login_time_iso,
            "login_time_display": login_time_display,
            "iat": login_timestamp,
            "exp": login_timestamp + 86400  # 24 hours
        }

        token = create_jwt_token(payload)

        return {
            "token": token,
            "officer": officer,
            "login_time_iso": login_time_iso,
            "login_time_display": login_time_display,
            "login_timestamp": login_timestamp,
            "expires_in": 86400
        }
