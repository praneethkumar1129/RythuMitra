from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid
from models.schemas import FarmerCreate, FarmerUpdate, LoginRequest
from database.connection import get_db
from services.auth import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api", tags=["Farmers"])

def _serialize(doc: dict) -> dict:
    """Convert datetime fields to ISO strings for JSON response."""
    for k, v in doc.items():
        if hasattr(v, "isoformat"):
            doc[k] = v.isoformat()
    return doc

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

    # Save login history
    db.login_history.insert_one({
        "history_id": str(uuid.uuid4()),
        "farmer_id": farmer["farmer_id"],
        "name": farmer["name"],
        "phone": farmer["phone"],
        "location": farmer["location"],
        "logged_in_at": datetime.now(timezone.utc),
        "device": "web",
    })

    token = create_access_token({"farmer_id": farmer["farmer_id"], "name": farmer["name"]})
    return {
        "farmer_id": farmer["farmer_id"],
        "name": farmer["name"],
        "location": farmer["location"],
        "token": token,
        "message": "Login successful",
    }

@router.get("/farmer/{farmer_id}")
def get_farmer(farmer_id: str):
    db = get_db()
    farmer = db.farmers.find_one({"farmer_id": farmer_id}, {"_id": 0, "password": 0})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return _serialize(farmer)

@router.put("/farmer/{farmer_id}")
def update_farmer(farmer_id: str, updates: FarmerUpdate):
    db = get_db()
    farmer = db.farmers.find_one({"farmer_id": farmer_id})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updated_at"] = datetime.now(timezone.utc)
    db.farmers.update_one({"farmer_id": farmer_id}, {"$set": update_data})

    updated = db.farmers.find_one({"farmer_id": farmer_id}, {"_id": 0, "password": 0})
    return {"message": "Profile updated successfully", "farmer": _serialize(updated)}

@router.get("/farmer/{farmer_id}/history")
def get_farmer_history(farmer_id: str):
    db = get_db()
    farmer = db.farmers.find_one({"farmer_id": farmer_id}, {"_id": 0, "password": 0})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    disease_reports = [_serialize(r) for r in db.disease_reports.find(
        {"farmer_id": farmer_id}, {"_id": 0}).sort("date", -1).limit(10)]

    crop_searches = [_serialize(c) for c in db.crop_history.find(
        {"farmer_id": farmer_id}, {"_id": 0}).sort("searched_at", -1).limit(10)]

    jobs_posted = [_serialize(j) for j in db.jobs.find(
        {"farmer_id": farmer_id}, {"_id": 0}).sort("created_at", -1).limit(10)]

    login_history = [_serialize(l) for l in db.login_history.find(
        {"farmer_id": farmer_id}, {"_id": 0}).sort("logged_in_at", -1).limit(20)]

    return {
        "farmer": _serialize(farmer),
        "disease_reports": disease_reports,
        "crop_searches": crop_searches,
        "jobs_posted": jobs_posted,
        "login_history": login_history,
    }

@router.get("/farmers")
def list_farmers(location: str = None):
    db = get_db()
    query = {"location": {"$regex": location, "$options": "i"}} if location else {}
    farmers = [_serialize(f) for f in db.farmers.find(query, {"_id": 0, "password": 0}).limit(50)]
    return {"farmers": farmers, "count": len(farmers)}
