from fastapi import APIRouter, Body, Header, HTTPException
from typing import Dict, Any, Optional
from ...services.auth_service import AuthService, verify_jwt_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/officers")
def get_officers():
    """Returns available command staff profiles for quick login/duty handover."""
    service = AuthService.get_instance()
    return service.list_officers()

@router.post("/login")
def login(payload: Dict[str, Any] = Body(default={})):
    """
    Authenticate emergency operator and return JWT token with live login timestamp.
    """
    officer_id = payload.get("officer_id")
    badge_id = payload.get("badge_id")

    service = AuthService.get_instance()
    auth_result = service.authenticate_officer(officer_id=officer_id, badge_id=badge_id)

    if not auth_result:
        raise HTTPException(status_code=401, detail="Invalid officer credentials or badge ID")

    return {
        "status": "AUTHENTICATED",
        "data": auth_result
    }

@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Validates the active session JWT token and returns live duty session data.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = authorization.split(" ")[1]
    payload = verify_jwt_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

    return {
        "status": "VALID",
        "officer": {
            "id": payload.get("sub"),
            "name": payload.get("name"),
            "badge_id": payload.get("badge_id"),
            "role": payload.get("role"),
            "agency": payload.get("agency"),
            "clearance_level": payload.get("clearance_level"),
            "login_time_iso": payload.get("login_time_iso"),
            "login_time_display": payload.get("login_time_display"),
            "login_timestamp": payload.get("iat")
        }
    }
