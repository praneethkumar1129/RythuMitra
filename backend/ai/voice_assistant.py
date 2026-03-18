"""
Voice assistant service.
generate_voice_response returns text that the frontend converts to speech via Web Speech API.
translate_to_telugu uses a mock map; swap with Google Translate API in production.
"""

MULTI_LANG_PHRASES = {
    "welcome": {
        "te": "రైతుమిత్రకు స్వాగతం. పంట సూచనలు, మొక్కల వ్యాధి గుర్తింపు, వ్యవసాయ ఉద్యోగాలు మరియు ప్రభుత్వ పథకాలలో నేను మీకు సహాయం చేస్తాను.",
        "en": "Welcome to RythuMitra. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes."
    },
    "register_prompt": {
        "te": "దయచేసి మీ పేరు, స్థానం మరియు భూమి వివరాలు చెప్పండి.",
        "en": "Please tell me your name, location and land details."
    },
    "crop_ready": {
        "te": "మీ భూమి విశ్లేషణ ఆధారంగా పంట సిఫార్సులు సిద్ధంగా ఉన్నాయి.",
        "en": "Crop recommendations based on your land analysis are ready."
    },
    "disease_detected": {
        "te": "మొక్కల వ్యాధి గుర్తించబడింది. దయచేసి చికిత్స వివరాలు చూడండి.",
        "en": "Plant disease detected. Please check the treatment details."
    },
    "weather_alert": {
        "te": "వాతావరణ హెచ్చరిక: మీ ప్రాంతంలో భారీ వర్షం అంచనా వేయబడింది.",
        "en": "Weather Alert: Heavy rain is expected in your area."
    },
    "job_posted": {
        "te": "మీ ఉద్యోగ ప్రకటన విజయవంతంగా పోస్ట్ చేయబడింది.",
        "en": "Your job posting has been successfully published."
    }
    # Add more keys as needed
}

def generate_voice_response(key: str, lang: str = "te") -> dict:
    phrase = MULTI_LANG_PHRASES.get(key, MULTI_LANG_PHRASES["welcome"])
    text = phrase.get(lang, phrase["en"])
    lang_code = f'{lang}-IN' if lang != "en" else "en-IN"
    return {
        "text": text,
        "lang_code": lang_code,
        "key": key,
    }

def translate_to_telugu(text: str) -> str:
    """Mock translation — returns Telugu welcome for any input in prototype."""
    return MULTI_LANG_PHRASES["welcome"]["te"]

def _telugu_to_english_fallback(key: str) -> str:
    en_fallback = {
        "welcome": "Welcome to RythuMitra. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes.",
        "register_prompt": "Please tell me your name, location and land details.",
        "crop_ready": "Crop recommendations based on your land analysis are ready.",
        "disease_detected": "Plant disease detected. Please check the treatment details.",
        "weather_alert": "Weather Alert: Heavy rain is expected in your area.",
        "job_posted": "Your job posting has been successfully published.",
    }
    return en_fallback.get(key, en_fallback["welcome"])
