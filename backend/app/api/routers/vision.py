from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from ...services.vision_engine import VisionEngine

router = APIRouter(prefix="/api/analyze", tags=["vision"])

@router.post("/image")
async def analyze_image(
    file: Optional[UploadFile] = File(None),
    scenario: Optional[str] = Form("odisha_drone_zone7")
):
    engine = VisionEngine(mode="DEMO_SIMULATION")
    filename = file.filename if file else f"{scenario}.jpg"
    content = await file.read() if file else None
    
    result = engine.analyze_frame_or_image(filename=filename, image_bytes=content)
    return result

@router.post("/video")
async def analyze_video(
    file: Optional[UploadFile] = File(None),
    camera_id: Optional[str] = Form("CCTV-MAHANADI-04")
):
    engine = VisionEngine(mode="DEMO_SIMULATION")
    filename = file.filename if file else f"{camera_id}_feed.mp4"
    result = engine.analyze_frame_or_image(filename=filename)
    return result
