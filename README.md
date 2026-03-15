# RythuMitra — AI-Powered Agriculture Assistant

> రైతుమిత్ర | Helping farmers make smarter decisions using AI

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite, Recharts, Axios  |
| Backend   | Python FastAPI + Motor (async)    |
| Database  | MongoDB Atlas                     |
| AI Stubs  | Gemini / OpenAI ready             |
| Auth      | JWT (python-jose)                 |
| Weather   | OpenWeatherMap API                |

---

## Project Structure

```
rythumitra/
├── backend/
│   ├── main.py                  # FastAPI app entry
│   ├── requirements.txt
│   ├── .env.example
│   ├── database/
│   │   └── connection.py        # MongoDB Motor connection
│   ├── models/
│   │   └── schemas.py           # Pydantic models
│   ├── routes/
│   │   ├── farmers.py           # Registration & profile APIs
│   │   ├── crops.py             # Crop recommendation & demand
│   │   ├── disease.py           # Plant disease detection
│   │   ├── jobs.py              # Farm job marketplace
│   │   └── misc.py              # Weather, schemes, voice
│   ├── services/
│   │   ├── auth.py              # JWT helpers
│   │   ├── weather.py           # OpenWeatherMap integration
│   │   └── gov_schemes.py       # Government schemes data
│   └── ai/
│       ├── crop_recommendation.py
│       ├── disease_detection.py
│       └── voice_assistant.py
└── frontend/
    └── src/
        ├── App.jsx              # Router + Navbar
        ├── api.js               # Axios instance
        ├── index.css            # Global styles
        ├── components/
        │   └── VoiceAssistant.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Register.jsx
            ├── CropRecommendation.jsx
            ├── DiseaseDetection.jsx
            ├── CropDemand.jsx
            ├── Jobs.jsx
            ├── Weather.jsx
            └── GovSchemes.jsx
```

---

## Setup Instructions

### 1. Clone / Open the project

```bash
cd rythumitra
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and fill environment variables
copy .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/rythumitra
JWT_SECRET=your_secret_key
OPENWEATHER_API_KEY=your_key   # optional, mock data used if missing
GEMINI_API_KEY=your_key        # optional, mock AI used if missing
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | /api/register_farmer            | Register a new farmer        |
| GET    | /api/farmer/{farmer_id}         | Get farmer profile           |
| POST   | /api/crop_recommendation        | Get AI crop suggestions      |
| GET    | /api/crop_demand                | Crop market demand data      |
| POST   | /api/detect_disease             | Upload image, detect disease |
| POST   | /api/create_job                 | Post a farm job              |
| GET    | /api/jobs_nearby?location=X     | Browse jobs near location    |
| POST   | /api/apply_job                  | Apply for a job              |
| GET    | /api/weather/{location}         | Weather + farming alerts     |
| GET    | /api/gov_schemes                | Government schemes list      |
| GET    | /api/voice/{key}?lang=te        | Telugu voice response text   |

---

## MongoDB Collections

| Collection      | Key Fields                                              |
|-----------------|---------------------------------------------------------|
| farmers         | farmer_id, name, location, land_size, water_source, crops |
| jobs            | job_id, farmer_id, crop_type, salary, location, applicants |
| disease_reports | report_id, farmer_id, crop_type, disease_name, treatment  |

---

## Features

- 🎤 **Voice Dashboard** — Telugu TTS welcome using Web Speech API
- 👨‍🌾 **Smart Registration** — Voice-assisted farmer onboarding
- 🌱 **Crop Recommendation** — Soil + water + location based AI suggestions
- 🔪 **Smart Land Division** — Multi-crop layout to reduce risk
- 🐛 **Disease Detection** — Upload plant photo → instant diagnosis
- 📊 **Market Demand Graph** — Bar/Line/Table views with Recharts
- 💼 **Job Marketplace** — Post & apply for farm work
- 🌦️ **Weather Alerts** — Real-time weather + farming advice
- 📋 **Govt Schemes** — PM-KISAN, PMFBY, KCC, Rythu Bandhu & more

---

## Replacing Mock AI with Real APIs

### Gemini Vision (Disease Detection)
In `backend/ai/disease_detection.py`, replace `detect_plant_disease_from_image` with:
```python
import google.generativeai as genai
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content([prompt, image_part])
```

### Crop Recommendation
In `backend/ai/crop_recommendation.py`, call Gemini/OpenAI with soil + location context for dynamic recommendations.

### Telugu Translation
Replace `translate_to_telugu` in `voice_assistant.py` with Google Cloud Translation API.

---

## License
MIT — Built for RythuMitra Hackathon 🚀
