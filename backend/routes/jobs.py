from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from models.schemas import JobCreate, JobApply
from database.connection import get_db

router = APIRouter(prefix="/api", tags=["Jobs"])

@router.post("/create_job")
async def create_job(job: JobCreate):
    db = get_db()
    doc = {
        "job_id": str(uuid.uuid4()),
        **job.model_dump(),
        "applicants": [],
        "status": "open",
        "created_at": datetime.utcnow(),
    }
    await db.jobs.insert_one(doc)
    return {"job_id": doc["job_id"], "message": "Job posted successfully"}

@router.get("/jobs_nearby")
async def jobs_nearby(location: str, limit: int = 10):
    db = get_db()
    jobs = await db.jobs.find(
        {"location": {"$regex": location, "$options": "i"}, "status": "open"},
        {"_id": 0}
    ).sort("created_at", -1).to_list(limit)
    return {"jobs": jobs, "count": len(jobs)}

@router.post("/apply_job")
async def apply_job(application: JobApply):
    db = get_db()
    job = await db.jobs.find_one({"job_id": application.job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "open":
        raise HTTPException(status_code=400, detail="Job is no longer accepting applications")

    applicant = {
        "worker_name": application.worker_name,
        "phone": application.phone,
        "applied_at": datetime.utcnow().isoformat(),
    }
    await db.jobs.update_one(
        {"job_id": application.job_id},
        {"$push": {"applicants": applicant}}
    )
    return {"message": "Application submitted successfully"}

@router.get("/jobs/{farmer_id}")
async def farmer_jobs(farmer_id: str):
    db = get_db()
    jobs = await db.jobs.find({"farmer_id": farmer_id}, {"_id": 0}).to_list(20)
    return {"jobs": jobs}
