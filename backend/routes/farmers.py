from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import uuid
from models.schemas import FarmerCreate, FarmerResponse
from database.connection import get_db
from services.auth import create_access_token

router = APIRouter(prefix="/api", tags=["Farmers"])

@router.post("/register_farmer")
async def register_farmer(farmer: FarmerCreate):
    db = get_db()
    existing = await db.farmers.find_one({"phone": farmer.phone}) if farmer.phone else None
    if existing:
        raise HTTPException(status_code=400, detail="Farmer with this phone already exists")

    farmer_id = str(uuid.uuid4())
    doc = {
        "farmer_id": farmer_id,
        **farmer.model_dump(),
        "created_at": datetime.utcnow(),
    }
    await db.farmers.insert_one(doc)
    token = create_access_token({"farmer_id": farmer_id, "name": farmer.name})
    return {"farmer_id": farmer_id, "message": "Registration successful", "token": token}

@router.get("/farmer/{farmer_id}")
async def get_farmer(farmer_id: str):
    db = get_db()
    farmer = await db.farmers.find_one({"farmer_id": farmer_id}, {"_id": 0})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer

@router.get("/farmers")
async def list_farmers(location: str = None):
    db = get_db()
    query = {"location": {"$regex": location, "$options": "i"}} if location else {}
    farmers = await db.farmers.find(query, {"_id": 0}).to_list(50)
    return {"farmers": farmers, "count": len(farmers)}
