from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from routes import farmers, crops, disease, jobs, misc

app = FastAPI(
    title="RythuMitra API",
    description="AI-powered agriculture assistant for farmers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farmers.router)
app.include_router(crops.router)
app.include_router(disease.router)
app.include_router(jobs.router)
app.include_router(misc.router)

@app.get("/")
def root():
    return {"message": "RythuMitra API is running", "docs": "/docs"}
