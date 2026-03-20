from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import os
import httpx

router = APIRouter(prefix="/api", tags=["Chatbot"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

SYSTEM_PROMPT = """You are Rythu Seva AI, a helpful agriculture assistant for Indian farmers, especially in Andhra Pradesh and Telangana.
You help farmers with:
- Crop recommendations based on soil, water, season
- Plant disease identification and treatment
- Government schemes like PM-KISAN, Rythu Bandhu, PMFBY
- Weather advice and farming tips
- Market prices and crop demand
- Fertilizer and pesticide guidance

Always respond in simple language. If the farmer writes in Telugu, respond in Telugu. If in English, respond in English.
Keep answers short, practical and farmer-friendly. Use bullet points when listing items.
Do not answer questions unrelated to farming or agriculture."""

class Message(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    messages: List[Message]

def _mock_response(user_msg: str) -> str:
    msg = user_msg.lower()
    if any(w in msg for w in ["rice", "paddy", "వరి"]):
        return "🌾 Rice grows best in clay/loamy soil with good water supply. Best season: Kharif (June-Oct). Apply Urea 50kg/acre at tillering stage. Watch for Rice Blast disease — spray Tricyclazole if you see diamond-shaped spots on leaves."
    if any(w in msg for w in ["disease", "pest", "వ్యాధి", "పురుగు"]):
        return "🐛 To identify plant disease, upload a photo in the Disease Detection page. Common treatments:\n• Fungal: Mancozeb 75WP @ 2g/L\n• Bacterial: Copper oxychloride\n• Pests: Neem oil 5ml/L as organic remedy"
    if any(w in msg for w in ["scheme", "subsidy", "పథకం", "pm kisan", "rythu"]):
        return "📋 Key schemes for you:\n• PM-KISAN: ₹6,000/year direct to bank\n• Rythu Bandhu: ₹10,000/acre/year (Telangana)\n• PMFBY: Crop insurance at low premium\n• KCC: Loan at 4% interest\nVisit Schemes page for details and apply links."
    if any(w in msg for w in ["weather", "rain", "వర్షం", "వాతావరణ"]):
        return "🌦️ Check the Weather page for real-time alerts for your location. General tips:\n• High rain chance → avoid spraying pesticides\n• Drought → irrigate early morning\n• High humidity → watch for fungal diseases"
    if any(w in msg for w in ["price", "market", "ధర", "మార్కెట్"]):
        return "📊 Current high-demand crops:\n• Vegetables: ₹2,800/quintal (demand 92)\n• Onion: ₹2,500/quintal (demand 88)\n• Tomato: ₹1,800/quintal (demand 90)\nCheck Market page for full demand graph."
    if any(w in msg for w in ["soil", "నేల", "మట్టి"]):
        return "🌱 Soil tips:\n• Black soil → Cotton, Soybean, Wheat\n• Loamy soil → Tomato, Chilli, Maize\n• Sandy soil → Groundnut, Watermelon\n• Clay soil → Rice, Sugarcane\nGet soil tested free via Soil Health Card scheme!"
    if any(w in msg for w in ["cotton", "పత్తి"]):
        return "🌿 Cotton grows best in black soil with borewell irrigation. Sow in May-June. Common pest: Bollworm — spray Chlorpyrifos 2ml/L. Avoid waterlogging. Expected yield: 8-12 quintals/acre."
    if any(w in msg for w in ["fertilizer", "urea", "ఎరువు"]):
        return "🧪 Fertilizer guide:\n• Urea (Nitrogen): Apply at sowing + tillering\n• DAP (Phosphorus): Apply at sowing\n• Potash (MOP): Apply at flowering\n• Organic: Vermicompost 2 tons/acre improves soil health"
    if any(w in msg for w in ["hello", "hi", "నమస్కారం", "హలో", "help"]):
        return "నమస్కారం! 👋 Welcome to Rythu Seva AI. I can help you with:\n• Crop recommendations\n• Disease detection\n• Government schemes\n• Weather alerts\n• Market prices\n\nWhat would you like to know?"
    return "I'm here to help with farming questions! Ask me about crops, diseases, schemes, weather, or market prices. You can also type in Telugu — నేను తెలుగులో కూడా సహాయం చేస్తాను! 🌾"

@router.post("/chat")
def chat(req: ChatRequest):
    user_msg = req.messages[-1].text if req.messages else ""

    if not GEMINI_API_KEY:
        return {"reply": _mock_response(user_msg)}

    try:
        contents = [
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT + "\n\nNow answer the farmer's question:"}]},
            {"role": "model", "parts": [{"text": "Understood! I am Rythu Seva AI, ready to help farmers. Please ask your question."}]}
        ]
        for m in req.messages:
            contents.append({"role": m.role, "parts": [{"text": m.text}]})

        with httpx.Client(timeout=15) as client:
            r = client.post(
                f"{GEMINI_URL}?key={GEMINI_API_KEY}",
                json={"contents": contents, "generationConfig": {"maxOutputTokens": 400, "temperature": 0.7}},
            )
            if r.status_code == 200:
                reply = r.json()["candidates"][0]["content"]["parts"][0]["text"]
                return {"reply": reply}
    except Exception:
        pass

    return {"reply": _mock_response(user_msg)}
