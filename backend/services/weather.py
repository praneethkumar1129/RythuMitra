import httpx
import os
from datetime import datetime

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY", "")

MOCK_WEATHER = {
    "hyderabad": {"temp": 32, "humidity": 65, "condition": "Partly Cloudy", "rain_chance": 30, "alert": None},
    "warangal":  {"temp": 34, "humidity": 70, "condition": "Sunny",         "rain_chance": 10, "alert": None},
    "guntur":    {"temp": 36, "humidity": 60, "condition": "Hot & Dry",      "rain_chance": 5,  "alert": "Drought risk — irrigate crops"},
    "karimnagar":{"temp": 30, "humidity": 80, "condition": "Cloudy",         "rain_chance": 70, "alert": "Heavy rain expected — protect harvested crops"},
    "nellore":   {"temp": 33, "humidity": 75, "condition": "Humid",          "rain_chance": 45, "alert": None},
}

async def get_weather(location: str) -> dict:
    loc_key = location.lower().strip()

    if OPENWEATHER_KEY:
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                r = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={"q": location, "appid": OPENWEATHER_KEY, "units": "metric"},
                )
                if r.status_code == 200:
                    data = r.json()
                    return {
                        "location": location,
                        "temp": data["main"]["temp"],
                        "humidity": data["main"]["humidity"],
                        "condition": data["weather"][0]["description"].title(),
                        "rain_chance": data.get("clouds", {}).get("all", 0),
                        "alert": _generate_alert(data),
                        "timestamp": datetime.utcnow().isoformat(),
                    }
        except Exception:
            pass

    # Fallback to mock
    mock = MOCK_WEATHER.get(loc_key, {
        "temp": 31, "humidity": 68, "condition": "Clear", "rain_chance": 20, "alert": None
    })
    return {"location": location, **mock, "timestamp": datetime.utcnow().isoformat()}

def _generate_alert(data: dict) -> str | None:
    rain = data.get("rain", {}).get("1h", 0)
    if rain > 10:
        return "Heavy rain detected — protect crops and drainage"
    wind = data["wind"]["speed"]
    if wind > 15:
        return "Strong winds — secure crop covers and structures"
    return None
