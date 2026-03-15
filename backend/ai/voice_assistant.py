"""
Voice assistant service.
generate_voice_response returns text that the frontend converts to speech via Web Speech API.
translate_to_telugu uses a mock map; swap with Google Translate API in production.
"""

TELUGU_PHRASES = {
    "welcome": "రైతుమిత్రకు స్వాగతం. పంట సూచనలు, మొక్కల వ్యాధి గుర్తింపు, వ్యవసాయ ఉద్యోగాలు మరియు ప్రభుత్వ పథకాలలో నేను మీకు సహాయం చేస్తాను.",
    "register_prompt": "దయచేసి మీ పేరు, స్థానం మరియు భూమి వివరాలు చెప్పండి.",
    "crop_ready": "మీ భూమి విశ్లేషణ ఆధారంగా పంట సిఫార్సులు సిద్ధంగా ఉన్నాయి.",
    "disease_detected": "మొక్కల వ్యాధి గుర్తించబడింది. దయచేసి చికిత్స వివరాలు చూడండి.",
    "weather_alert": "వాతావరణ హెచ్చరిక: మీ ప్రాంతంలో భారీ వర్షం అంచనా వేయబడింది.",
    "job_posted": "మీ ఉద్యోగ ప్రకటన విజయవంతంగా పోస్ట్ చేయబడింది.",
}

def generate_voice_response(key: str, lang: str = "te") -> dict:
    text_te = TELUGU_PHRASES.get(key, TELUGU_PHRASES["welcome"])
    text_en = _telugu_to_english_fallback(key)
    return {
        "text": text_te if lang == "te" else text_en,
        "lang_code": "te-IN" if lang == "te" else "en-IN",
        "key": key,
    }

def translate_to_telugu(text: str) -> str:
    """Mock translation — returns Telugu welcome for any input in prototype."""
    return TELUGU_PHRASES.get("welcome")

def _telugu_to_english_fallback(key: str) -> str:
    mapping = {
        "welcome": "Welcome to RythuMitra. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes.",
        "register_prompt": "Please tell me your name, location and land details.",
        "crop_ready": "Crop recommendations based on your land analysis are ready.",
        "disease_detected": "Plant disease detected. Please check the treatment details.",
        "weather_alert": "Weather Alert: Heavy rain is expected in your area.",
        "job_posted": "Your job posting has been successfully published.",
    }
    return mapping.get(key, mapping["welcome"])
