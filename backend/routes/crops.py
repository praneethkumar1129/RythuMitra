from fastapi import APIRouter, Header
from typing import Optional
from datetime import datetime, timezone
import uuid
from models.schemas import CropRecommendationRequest
from ai.crop_recommendation import recommend_best_crops
from database.connection import get_db
from services.auth import decode_token

router = APIRouter(prefix="/api", tags=["Crops"])

CROP_DEMAND_DATA = [
    {"crop": "Rice",       "farmers_growing": 4200, "demand_index": 85, "market_price": 2200, "trend": "stable"},
    {"crop": "Cotton",     "farmers_growing": 3100, "demand_index": 78, "market_price": 6500, "trend": "up"},
    {"crop": "Tomato",     "farmers_growing": 2800, "demand_index": 90, "market_price": 1800, "trend": "up"},
    {"crop": "Chilli",     "farmers_growing": 1900, "demand_index": 82, "market_price": 8000, "trend": "up"},
    {"crop": "Maize",      "farmers_growing": 2200, "demand_index": 70, "market_price": 1900, "trend": "stable"},
    {"crop": "Groundnut",  "farmers_growing": 1600, "demand_index": 75, "market_price": 5500, "trend": "stable"},
    {"crop": "Sugarcane",  "farmers_growing": 1400, "demand_index": 65, "market_price": 3200, "trend": "down"},
    {"crop": "Soybean",    "farmers_growing": 1200, "demand_index": 72, "market_price": 4200, "trend": "up"},
    {"crop": "Onion",      "farmers_growing": 900,  "demand_index": 88, "market_price": 2500, "trend": "up"},
    {"crop": "Vegetables", "farmers_growing": 2100, "demand_index": 92, "market_price": 2800, "trend": "up"},
    {"crop": "Wheat",      "farmers_growing": 1800, "demand_index": 68, "market_price": 2100, "trend": "stable"},
    {"crop": "Pulses",     "farmers_growing": 1100, "demand_index": 80, "market_price": 6000, "trend": "up"},
]

@router.post("/crop_recommendation")
def crop_recommendation(req: CropRecommendationRequest, authorization: Optional[str] = Header(default=None)):
    result = recommend_best_crops(req.soil_type, req.location, req.water_source, req.land_size)

    # Save to history if logged in
    farmer_id = None
    if authorization and authorization.startswith("Bearer "):
        payload = decode_token(authorization.split(" ")[1])
        if payload:
            farmer_id = payload.get("farmer_id")

    if farmer_id:
        try:
            db = get_db()
            db.crop_history.insert_one({
                "history_id": str(uuid.uuid4()),
                "farmer_id": farmer_id,
                "soil_type": req.soil_type,
                "location": req.location,
                "water_source": req.water_source,
                "land_size": req.land_size,
                "recommended_crops": [c["crop"] for c in result["recommended_crops"]],
                "searched_at": datetime.now(timezone.utc),
            })
        except Exception:
            pass

    return result

@router.get("/crop_demand")
def crop_demand():
    return {"data": CROP_DEMAND_DATA}
