from fastapi import APIRouter
from services.weather import get_weather
from services.gov_schemes import get_all_schemes
from ai.voice_assistant import generate_voice_response

router = APIRouter(prefix="/api", tags=["Misc"])

@router.get("/weather/{location}")
def weather(location: str):
    return get_weather(location)

@router.get("/gov_schemes")
def gov_schemes(category: str = None):
    schemes = get_all_schemes()
    if category:
        schemes = [s for s in schemes if s["category"].lower() == category.lower()]
    return {"schemes": schemes, "count": len(schemes)}

@router.get("/voice/{key}")
def voice_response(key: str, lang: str = "te"):
    return generate_voice_response(key, lang)
