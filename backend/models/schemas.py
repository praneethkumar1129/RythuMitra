from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FarmerCreate(BaseModel):
    name: str
    location: str
    land_size: float
    water_source: str  # borewell | canal | rain
    crops: List[str]
    phone: Optional[str] = None

class FarmerResponse(BaseModel):
    farmer_id: str
    name: str
    location: str
    land_size: float
    water_source: str
    crops: List[str]
    phone: Optional[str] = None
    created_at: datetime

class CropRecommendationRequest(BaseModel):
    soil_type: str
    location: str
    water_source: str
    land_size: float

class JobCreate(BaseModel):
    farmer_id: str
    crop_type: str
    salary: float
    working_hours: str
    location: str
    workers_required: int
    description: Optional[str] = None

class JobApply(BaseModel):
    job_id: str
    worker_name: str
    phone: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    phone: str
    password: str
