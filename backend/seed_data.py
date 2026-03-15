"""
seed_data.py - Populates MongoDB Atlas with sample data for RythuMitra.
Run: python seed_data.py
"""

import asyncio
import sys
import os
import uuid
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/rythumitra")

def now(days=0, hours=0):
    return datetime.now(timezone.utc) - timedelta(days=days, hours=hours)

# ─────────────────────────────────────────────
# FARMERS
# ─────────────────────────────────────────────

FARMERS = [
    {"farmer_id": str(uuid.uuid4()), "name": "Ravi Kumar",      "phone": "9876543210", "location": "Warangal",   "land_size": 3.5, "water_source": "borewell", "crops": ["Rice", "Maize"],             "created_at": now(days=30)},
    {"farmer_id": str(uuid.uuid4()), "name": "Lakshmi Devi",    "phone": "9123456780", "location": "Guntur",     "land_size": 2.0, "water_source": "canal",    "crops": ["Chilli", "Tomato"],          "created_at": now(days=20)},
    {"farmer_id": str(uuid.uuid4()), "name": "Suresh Reddy",    "phone": "9988776655", "location": "Karimnagar", "land_size": 5.0, "water_source": "rain",     "crops": ["Cotton", "Soybean"],        "created_at": now(days=15)},
    {"farmer_id": str(uuid.uuid4()), "name": "Anitha Rao",      "phone": "9871234560", "location": "Nellore",    "land_size": 1.5, "water_source": "borewell", "crops": ["Groundnut", "Onion"],       "created_at": now(days=10)},
    {"farmer_id": str(uuid.uuid4()), "name": "Venkat Naidu",    "phone": "9765432100", "location": "Hyderabad",  "land_size": 4.0, "water_source": "canal",    "crops": ["Vegetables", "Wheat"],      "created_at": now(days=5)},
    {"farmer_id": str(uuid.uuid4()), "name": "Padma Latha",     "phone": "9654321098", "location": "Vijayawada", "land_size": 2.5, "water_source": "canal",    "crops": ["Sugarcane", "Rice"],        "created_at": now(days=3)},
    {"farmer_id": str(uuid.uuid4()), "name": "Krishna Murthy",  "phone": "9543210987", "location": "Khammam",    "land_size": 6.0, "water_source": "borewell", "crops": ["Cotton", "Maize", "Pulses"],"created_at": now(days=2)},
    {"farmer_id": str(uuid.uuid4()), "name": "Saraswathi Bai",  "phone": "9432109876", "location": "Nizamabad",  "land_size": 1.0, "water_source": "rain",     "crops": ["Millets", "Pulses"],        "created_at": now(days=1)},
]

# ─────────────────────────────────────────────
# CROP DATA
# ─────────────────────────────────────────────

CROP_DATA = [
    {"crop_name": "Rice",       "soil_type": ["clay", "loamy"],         "water_requirement": "High",      "market_demand": "High",      "average_price": 2200, "season": "Kharif",       "yield_per_acre": "25-30 quintals",  "profit_per_acre": 20000, "farmers_growing": 4200, "demand_index": 85, "trend": "stable"},
    {"crop_name": "Cotton",     "soil_type": ["black", "loamy"],        "water_requirement": "Medium",    "market_demand": "High",      "average_price": 6500, "season": "Kharif",       "yield_per_acre": "8-12 quintals",   "profit_per_acre": 30000, "farmers_growing": 3100, "demand_index": 78, "trend": "up"},
    {"crop_name": "Tomato",     "soil_type": ["loamy", "sandy"],        "water_requirement": "Medium",    "market_demand": "Very High", "average_price": 1800, "season": "Rabi",         "yield_per_acre": "80-120 quintals", "profit_per_acre": 50000, "farmers_growing": 2800, "demand_index": 90, "trend": "up"},
    {"crop_name": "Chilli",     "soil_type": ["loamy", "black"],        "water_requirement": "Medium",    "market_demand": "High",      "average_price": 8000, "season": "Kharif",       "yield_per_acre": "15-20 quintals",  "profit_per_acre": 42000, "farmers_growing": 1900, "demand_index": 82, "trend": "up"},
    {"crop_name": "Maize",      "soil_type": ["loamy", "sandy"],        "water_requirement": "Medium",    "market_demand": "Medium",    "average_price": 1900, "season": "Kharif",       "yield_per_acre": "20-25 quintals",  "profit_per_acre": 14000, "farmers_growing": 2200, "demand_index": 70, "trend": "stable"},
    {"crop_name": "Groundnut",  "soil_type": ["sandy", "loamy"],        "water_requirement": "Low",       "market_demand": "Medium",    "average_price": 5500, "season": "Kharif",       "yield_per_acre": "10-15 quintals",  "profit_per_acre": 24000, "farmers_growing": 1600, "demand_index": 75, "trend": "stable"},
    {"crop_name": "Sugarcane",  "soil_type": ["clay", "loamy"],         "water_requirement": "Very High", "market_demand": "Medium",    "average_price": 3200, "season": "Annual",       "yield_per_acre": "300-400 quintals","profit_per_acre": 37000, "farmers_growing": 1400, "demand_index": 65, "trend": "down"},
    {"crop_name": "Soybean",    "soil_type": ["black", "loamy"],        "water_requirement": "Low",       "market_demand": "Medium",    "average_price": 4200, "season": "Kharif",       "yield_per_acre": "10-14 quintals",  "profit_per_acre": 17000, "farmers_growing": 1200, "demand_index": 72, "trend": "up"},
    {"crop_name": "Onion",      "soil_type": ["loamy", "sandy"],        "water_requirement": "Medium",    "market_demand": "Very High", "average_price": 2500, "season": "Rabi",         "yield_per_acre": "80-100 quintals", "profit_per_acre": 45000, "farmers_growing": 900,  "demand_index": 88, "trend": "up"},
    {"crop_name": "Vegetables", "soil_type": ["loamy", "sandy"],        "water_requirement": "Medium",    "market_demand": "Very High", "average_price": 2800, "season": "All seasons",  "yield_per_acre": "60-80 quintals",  "profit_per_acre": 37000, "farmers_growing": 2100, "demand_index": 92, "trend": "up"},
    {"crop_name": "Wheat",      "soil_type": ["loamy", "clay"],         "water_requirement": "Medium",    "market_demand": "Medium",    "average_price": 2100, "season": "Rabi",         "yield_per_acre": "18-22 quintals",  "profit_per_acre": 16000, "farmers_growing": 1800, "demand_index": 68, "trend": "stable"},
    {"crop_name": "Pulses",     "soil_type": ["black", "loamy", "sandy"],"water_requirement": "Low",      "market_demand": "High",      "average_price": 6000, "season": "Rabi",         "yield_per_acre": "6-10 quintals",   "profit_per_acre": 15000, "farmers_growing": 1100, "demand_index": 80, "trend": "up"},
]

# ─────────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────────

JOBS = [
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-001", "crop_type": "Rice",       "salary": 450, "working_hours": "6 AM - 2 PM", "location": "Warangal",   "workers_required": 5,  "description": "Paddy transplanting work. Meals provided.",                          "applicants": [], "status": "open", "created_at": now(days=2)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-002", "crop_type": "Cotton",     "salary": 500, "working_hours": "7 AM - 3 PM", "location": "Guntur",     "workers_required": 8,  "description": "Cotton picking season. Experience preferred.",                       "applicants": [], "status": "open", "created_at": now(days=1)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-003", "crop_type": "Chilli",     "salary": 400, "working_hours": "6 AM - 1 PM", "location": "Guntur",     "workers_required": 10, "description": "Red chilli harvesting. Daily wages paid.",                           "applicants": [], "status": "open", "created_at": now(hours=18)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-004", "crop_type": "Tomato",     "salary": 420, "working_hours": "5 AM - 12 PM","location": "Karimnagar", "workers_required": 6,  "description": "Tomato harvesting and packing work.",                                "applicants": [], "status": "open", "created_at": now(hours=12)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-005", "crop_type": "Sugarcane",  "salary": 600, "working_hours": "6 AM - 4 PM", "location": "Nellore",    "workers_required": 15, "description": "Sugarcane cutting. Transport provided from Nellore bus stand.",      "applicants": [], "status": "open", "created_at": now(hours=6)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-006", "crop_type": "Groundnut",  "salary": 380, "working_hours": "7 AM - 2 PM", "location": "Hyderabad",  "workers_required": 4,  "description": "Groundnut digging and drying work.",                                 "applicants": [], "status": "open", "created_at": now(hours=3)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-007", "crop_type": "Maize",      "salary": 350, "working_hours": "6 AM - 1 PM", "location": "Khammam",    "workers_required": 7,  "description": "Maize harvesting. Lunch provided.",                                  "applicants": [], "status": "open", "created_at": now(hours=1)},
    {"job_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-008", "crop_type": "Vegetables", "salary": 400, "working_hours": "5 AM - 11 AM","location": "Vijayawada", "workers_required": 3,  "description": "Mixed vegetable harvesting for market supply.",                      "applicants": [], "status": "open", "created_at": now()},
]

# ─────────────────────────────────────────────
# DISEASE REPORTS
# ─────────────────────────────────────────────

DISEASE_REPORTS = [
    {"report_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-001", "crop_type": "Rice",   "disease_name": "Rice Blast",      "image_url": "rice_blast_sample.jpg",        "treatment": "Apply Tricyclazole 75 WP @ 0.6g/L water. Remove infected plants.", "severity": "High",   "date": now(days=5)},
    {"report_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-002", "crop_type": "Tomato", "disease_name": "Early Blight",    "image_url": "tomato_blight_sample.jpg",     "treatment": "Apply Mancozeb 75 WP @ 2g/L. Remove infected leaves.",            "severity": "Medium", "date": now(days=3)},
    {"report_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-003", "crop_type": "Cotton", "disease_name": "Cotton Bollworm", "image_url": "cotton_bollworm_sample.jpg",   "treatment": "Spray Chlorpyrifos 20 EC @ 2.5ml/L. Use pheromone traps.",        "severity": "High",   "date": now(days=1)},
    {"report_id": str(uuid.uuid4()), "farmer_id": "demo-farmer-004", "crop_type": "Chilli", "disease_name": "Anthracnose",     "image_url": "chilli_anthracnose_sample.jpg","treatment": "Apply Carbendazim 50 WP @ 1g/L. Avoid overhead irrigation.",      "severity": "Medium", "date": now(hours=12)},
]

# ─────────────────────────────────────────────
# SEEDER
# ─────────────────────────────────────────────

async def seed():
    print("\nConnecting to MongoDB Atlas...")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.rythumitra

    collections = {
        "farmers":         FARMERS,
        "crop_data":       CROP_DATA,
        "jobs":            JOBS,
        "disease_reports": DISEASE_REPORTS,
    }

    for col_name, docs in collections.items():
        col = db[col_name]
        await col.drop()
        print(f"  [CLEAR]  '{col_name}'")
        result = await col.insert_many(docs)
        print(f"  [OK]     Inserted {len(result.inserted_ids)} documents into '{col_name}'")

    # Indexes
    await db.farmers.create_index("farmer_id", unique=True)
    await db.farmers.create_index("phone")
    await db.farmers.create_index("location")
    await db.jobs.create_index("job_id", unique=True)
    await db.jobs.create_index("location")
    await db.jobs.create_index("status")
    await db.disease_reports.create_index("farmer_id")
    await db.crop_data.create_index("crop_name", unique=True)
    print("\n  [OK]     Indexes created")

    # Summary
    print("\nSeed Summary:")
    for col_name in collections:
        count = await db[col_name].count_documents({})
        print(f"  {col_name:20s} -> {count} documents")

    client.close()
    print("\nMongoDB Atlas seeded successfully!\n")

if __name__ == "__main__":
    asyncio.run(seed())
