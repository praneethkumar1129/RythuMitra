"""
Crop recommendation AI service.
Uses mock data for prototype; swap analyze_soil / recommend_best_crops
with Gemini/OpenAI calls in production.
"""

CROP_DB = {
    "clay": {
        "borewell": ["Rice", "Sugarcane", "Cotton"],
        "canal":    ["Rice", "Wheat", "Sugarcane"],
        "rain":     ["Soybean", "Groundnut", "Maize"],
    },
    "sandy": {
        "borewell": ["Groundnut", "Watermelon", "Carrot"],
        "canal":    ["Vegetables", "Onion", "Tomato"],
        "rain":     ["Millets", "Pulses", "Sesame"],
    },
    "loamy": {
        "borewell": ["Tomato", "Chilli", "Maize"],
        "canal":    ["Wheat", "Vegetables", "Sunflower"],
        "rain":     ["Soybean", "Pulses", "Maize"],
    },
    "black": {
        "borewell": ["Cotton", "Soybean", "Wheat"],
        "canal":    ["Sugarcane", "Cotton", "Wheat"],
        "rain":     ["Soybean", "Cotton", "Jowar"],
    },
}

CROP_PROFIT = {
    "Rice":       {"yield_per_acre": "25-30 quintals", "profit_per_acre": "₹18,000-22,000"},
    "Wheat":      {"yield_per_acre": "18-22 quintals", "profit_per_acre": "₹14,000-18,000"},
    "Cotton":     {"yield_per_acre": "8-12 quintals",  "profit_per_acre": "₹25,000-35,000"},
    "Sugarcane":  {"yield_per_acre": "300-400 quintals","profit_per_acre": "₹30,000-45,000"},
    "Tomato":     {"yield_per_acre": "80-120 quintals", "profit_per_acre": "₹40,000-60,000"},
    "Groundnut":  {"yield_per_acre": "10-15 quintals",  "profit_per_acre": "₹20,000-28,000"},
    "Maize":      {"yield_per_acre": "20-25 quintals",  "profit_per_acre": "₹12,000-16,000"},
    "Soybean":    {"yield_per_acre": "10-14 quintals",  "profit_per_acre": "₹15,000-20,000"},
    "Chilli":     {"yield_per_acre": "15-20 quintals",  "profit_per_acre": "₹35,000-50,000"},
    "Vegetables": {"yield_per_acre": "60-80 quintals",  "profit_per_acre": "₹30,000-45,000"},
    "Millets":    {"yield_per_acre": "8-12 quintals",   "profit_per_acre": "₹10,000-14,000"},
    "Pulses":     {"yield_per_acre": "6-10 quintals",   "profit_per_acre": "₹12,000-18,000"},
    "Onion":      {"yield_per_acre": "80-100 quintals", "profit_per_acre": "₹35,000-55,000"},
    "Watermelon": {"yield_per_acre": "100-150 quintals","profit_per_acre": "₹25,000-40,000"},
    "Sunflower":  {"yield_per_acre": "8-12 quintals",   "profit_per_acre": "₹14,000-20,000"},
}

def analyze_soil(soil_type: str, water_source: str) -> list[str]:
    soil_key = soil_type.lower()
    water_key = water_source.lower()
    crops = CROP_DB.get(soil_key, CROP_DB["loamy"]).get(water_key, [])
    return crops or ["Millets", "Pulses", "Vegetables"]

def recommend_best_crops(soil_type: str, location: str, water_source: str, land_size: float) -> dict:
    crops = analyze_soil(soil_type, water_source)
    recommendations = []
    for crop in crops[:3]:
        info = CROP_PROFIT.get(crop, {"yield_per_acre": "N/A", "profit_per_acre": "N/A"})
        recommendations.append({
            "crop": crop,
            "yield_per_acre": info["yield_per_acre"],
            "profit_per_acre": info["profit_per_acre"],
            "total_profit_estimate": f"₹{int(land_size * 20000)}-{int(land_size * 35000)}",
        })

    # Smart land division
    division = _suggest_land_division(crops, land_size)

    return {
        "recommended_crops": recommendations,
        "land_division": division,
        "tips": [
            f"Best season for {location}: Kharif (June-Oct) and Rabi (Nov-Mar)",
            "Use drip irrigation to save 40% water",
            "Apply organic compost before sowing",
        ],
    }

def _suggest_land_division(crops: list, land_size: float) -> list[dict]:
    if not crops:
        return []
    portions = [0.5, 0.3, 0.2] if len(crops) >= 3 else ([0.6, 0.4] if len(crops) == 2 else [1.0])
    return [
        {"crop": crops[i], "acres": round(land_size * portions[i], 2)}
        for i in range(min(len(crops), len(portions)))
    ]
