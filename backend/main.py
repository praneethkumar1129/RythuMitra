from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from database.connection import connect_db, close_db
from routes import farmers, crops, disease, jobs, misc

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="RythuMitra API",
    description="AI-powered agriculture assistant for farmers",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
async def root():
    return {"message": "RythuMitra API is running", "docs": "/docs"}
