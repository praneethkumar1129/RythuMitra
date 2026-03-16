from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid
from models.schemas import FarmerCreate, LoginRequest
from database.connection import get_db
from services.auth import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api", tags=["Farmers"])

@router.post("/register_farmer")
def register_farmer(farmer: FarmerCreate):
    db = get_db()
    if farmer.phone:
        if db.farmers.find_one({"phone": farmer.phone}):
            raise HTTPException(status_code=400, detail="Farmer with this phone already exists")
    farmer_id = str(uuid.uuid4())
    doc = {
        "farmer_id": farmer_id,
        "name": farmer.name,
        "location": farmer.location,
        "land_size": farmer.land_size,
        "water_source": farmer.water_source,
        "crops": farmer.crops,
        "phone": farmer.phone,
        "password": hash_password(farmer.password) if farmer.password else None,
        "created_at": datetime.now(timezone.utc),
    }
    db.farmers.insert_one(doc)
    token = create_access_token({"farmer_id": farmer_id, "name": farmer.name})
    return {"farmer_id": farmer_id, "name": farmer.name, "message": "Registration successful", "token": token}

@router.post("/login")
def login(req: LoginRequest):
    db = get_db()
    farmer = db.farmers.find_one({"phone": req.phone})
    if not farmer:
        raise HTTPException(status_code=404, detail="Phone number not registered")
    if farmer.get("password") and not verify_password(req.password, farmer["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")
    token = create_access_token({"farmer_id": farmer["farmer_id"], "name": farmer["name"]})
    return {
        "farmer_id": farmer["farmer_id"],
        "name": farmer["name"],
        "location": farmer["location"],
        "token": token,
        "message": "Login successful"
    }

@router.get("/farmer/{farmer_id}")
def get_farmer(farmer_id: str):
    db = get_db()
    farmer = db.farmers.find_one({"farmer_id": farmer_id}, {"_id": 0, "password": 0})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer

@router.get("/farmers")
def list_farmers(location: str = None):
    db = get_db()
    query = {"location": {"$regex": location, "$options": "i"}} if location else {}
    farmers = list(db.farmers.find(query, {"_id": 0, "password": 0}).limit(50))
    return {"farmers": farmers, "count": len(farmers)}

@router.get("/farmer/{farmer_id}/history")
def get_farmer_history(farmer_id: str):
    db = get_db()
    farmer = db.farmers.find_one({"farmer_id": farmer_id}, {"_id": 0, "password": 0})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    disease_reports = list(db.disease_reports.find(
        {"farmer_id": farmer_id}, {"_id": 0}
    ).sort("date", -1).limit(10))

    crop_searches = list(db.crop_history.find(
        {"farmer_id": farmer_id}, {"_id": 0}
    ).sort("searched_at", -1).limit(10))

    jobs_posted = list(db.jobs.find(
        {"farmer_id": farmer_id}, {"_id": 0}
    ).sort("created_at", -1).limit(10))

    # Serialize datetime objects
    for r in disease_reports:
        if "date" in r and hasattr(r["date"], "isoformat"):
            r["date"] = r["date"].isoformat()
    for c in crop_searches:
        if "searched_at" in c and hasattr(c["searched_at"], "isoformat"):
            c["searched_at"] = c["searched_at"].isoformat()
    for j in jobs_posted:
        if "created_at" in j and hasattr(j["created_at"], "isoformat"):
            j["created_at"] = j["created_at"].isoformat()

    return {
        "farmer": farmer,
        "disease_reports": disease_reports,
        "crop_searches": crop_searches,
        "jobs_posted": jobs_posted,
    }
