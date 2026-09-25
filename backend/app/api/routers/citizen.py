from fastapi import APIRouter
from datetime import datetime
import uuid
from ...models.schemas import CitizenReportSubmission, CitizenReportModel
from ...database.memory_store import MemoryStore

router = APIRouter(prefix="/api", tags=["citizen"])

@router.post("/citizen-report")
def submit_citizen_report(submission: CitizenReportSubmission):
    store = MemoryStore.get_instance()
    report_id = f"CIT-{uuid.uuid4().hex[:6].upper()}"

    desc = submission.description.lower()
    if "trapped" in desc or "roof" in desc or "water rising" in desc:
        category = "TRAPPED_PERSON"
        severity = "HIGH"
    elif "medical" in desc or "injured" in desc or "elderly" in desc:
        category = "MEDICAL_URGENT"
        severity = "CRITICAL"
    elif "food" in desc or "water" in desc or "baby" in desc:
        category = "SUPPLY_RELIEF"
        severity = "MODERATE"
    else:
        category = "GENERAL_FLOOD_REPORT"
        severity = "MODERATE"

    report = {
        "id": report_id,
        "description": submission.description,
        "coordinates": [submission.latitude, submission.longitude],
        "number_of_people": submission.number_of_people,
        "emergency_type": submission.emergency_type,
        "ai_category": category,
        "ai_severity": severity,
        "status": "PENDING_VERIFICATION",
        "submitted_at": datetime.utcnow().strftime("%H:%M:%S UTC"),
        "contact_phone": submission.contact_phone
    }

    store.citizen_reports[report_id] = report

    # Add alert for incoming citizen report
    store.alerts.insert(0, {
        "id": f"ALT-{report_id}",
        "type": "WARNING",
        "title": f"New Citizen Report: {category}",
        "zone_id": "ZONE-07",
        "message": f"{submission.description[:80]}... ({submission.number_of_people} people)",
        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
        "acknowledged": False
    })

    return {
        "status": "RECEIVED",
        "report_id": report_id,
        "ai_category": category,
        "ai_severity": severity,
        "notice": "Submission queued and geo-referenced. Emergency responders alerted."
    }

@router.get("/citizen-reports")
def list_citizen_reports():
    store = MemoryStore.get_instance()
    return list(store.citizen_reports.values())
