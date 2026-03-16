from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from datetime import datetime, timezone
import uuid
from ai.disease_detection import detect_plant_disease_from_image
from database.connection import get_db

router = APIRouter(prefix="/api", tags=["Disease"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

@router.post("/detect_disease")
def detect_disease(
    crop_type: str = Form(...),
    farmer_id: str = Form(default=""),
    image: UploadFile = File(...),
):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG/PNG/WEBP images allowed")

    result = detect_plant_disease_from_image(crop_type, image.filename)

    db = get_db()
    db.disease_reports.insert_one({
        "report_id": str(uuid.uuid4()),
        "farmer_id": farmer_id,
        "crop_type": crop_type,
        "disease_name": result["disease_name"],
        "image_url": image.filename,
        "treatment": result["treatment"],
        "date": datetime.now(timezone.utc),
    })
    return result

@router.get("/disease_reports/{farmer_id}")
def get_disease_reports(farmer_id: str):
    db = get_db()
    reports = list(db.disease_reports.find(
        {"farmer_id": farmer_id}, {"_id": 0}
    ).sort("date", -1).limit(20))
    return {"reports": reports}
