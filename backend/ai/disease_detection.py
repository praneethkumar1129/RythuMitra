"""
Plant disease detection AI service.
Uses mock data for prototype; replace detect_plant_disease_from_image
with a real vision model call (Gemini Vision / OpenAI GPT-4o) in production.
"""

DISEASE_DB = {
    "rice": [
        {
            "disease_name": "Rice Blast",
            "symptoms": "Diamond-shaped lesions on leaves with gray centers",
            "treatment": "Apply Tricyclazole 75 WP @ 0.6g/L water. Remove infected plants.",
            "pesticides": ["Tricyclazole 75 WP", "Carbendazim 50 WP"],
            "organic_remedy": "Spray neem oil solution (5ml/L) every 7 days",
            "video_url": "https://www.youtube.com/results?search_query=rice+blast+disease+treatment",
            "severity": "High",
        },
        {
            "disease_name": "Brown Plant Hopper",
            "symptoms": "Yellowing and drying of plants in circular patches",
            "treatment": "Apply Imidacloprid 17.8 SL @ 0.3ml/L. Drain water from field.",
            "pesticides": ["Imidacloprid 17.8 SL", "Buprofezin 25 SC"],
            "organic_remedy": "Release natural predators like spiders and mirid bugs",
            "video_url": "https://www.youtube.com/results?search_query=brown+plant+hopper+rice",
            "severity": "Medium",
        },
    ],
    "cotton": [
        {
            "disease_name": "Cotton Bollworm",
            "symptoms": "Holes in bolls, damaged squares and flowers",
            "treatment": "Spray Chlorpyrifos 20 EC @ 2.5ml/L. Use pheromone traps.",
            "pesticides": ["Chlorpyrifos 20 EC", "Spinosad 45 SC"],
            "organic_remedy": "Install pheromone traps @ 5/acre. Spray NSKE 5%",
            "video_url": "https://www.youtube.com/results?search_query=cotton+bollworm+treatment",
            "severity": "High",
        },
    ],
    "tomato": [
        {
            "disease_name": "Early Blight",
            "symptoms": "Dark brown spots with concentric rings on older leaves",
            "treatment": "Apply Mancozeb 75 WP @ 2g/L. Remove infected leaves.",
            "pesticides": ["Mancozeb 75 WP", "Chlorothalonil 75 WP"],
            "organic_remedy": "Spray copper-based fungicide or baking soda solution",
            "video_url": "https://www.youtube.com/results?search_query=tomato+early+blight+treatment",
            "severity": "Medium",
        },
        {
            "disease_name": "Leaf Curl Virus",
            "symptoms": "Upward curling of leaves, yellowing, stunted growth",
            "treatment": "Control whitefly vector with Imidacloprid. Remove infected plants.",
            "pesticides": ["Imidacloprid 17.8 SL", "Thiamethoxam 25 WG"],
            "organic_remedy": "Use yellow sticky traps. Spray neem oil 3ml/L",
            "video_url": "https://www.youtube.com/results?search_query=tomato+leaf+curl+virus",
            "severity": "High",
        },
    ],
    "chilli": [
        {
            "disease_name": "Anthracnose",
            "symptoms": "Sunken dark lesions on fruits, fruit rot",
            "treatment": "Apply Carbendazim 50 WP @ 1g/L. Avoid overhead irrigation.",
            "pesticides": ["Carbendazim 50 WP", "Propiconazole 25 EC"],
            "organic_remedy": "Spray Trichoderma viride solution",
            "video_url": "https://www.youtube.com/results?search_query=chilli+anthracnose+treatment",
            "severity": "Medium",
        },
    ],
    "default": [
        {
            "disease_name": "Fungal Infection",
            "symptoms": "Discoloration, spots, or wilting on plant parts",
            "treatment": "Apply broad-spectrum fungicide. Improve drainage and air circulation.",
            "pesticides": ["Mancozeb 75 WP", "Carbendazim 50 WP"],
            "organic_remedy": "Spray neem oil 5ml/L every 10 days",
            "video_url": "https://www.youtube.com/results?search_query=plant+fungal+disease+treatment",
            "severity": "Medium",
        },
    ],
}

def detect_plant_disease_from_image(crop_type: str, image_filename: str = "") -> dict:
    """
    Mock disease detection. In production, send image bytes to Gemini Vision API.
    Returns the first disease entry for the crop type as a demo.
    """
    crop_key = crop_type.lower()
    diseases = DISEASE_DB.get(crop_key, DISEASE_DB["default"])
    detected = diseases[0]

    return {
        "crop_type": crop_type,
        "disease_name": detected["disease_name"],
        "confidence": "87%",
        "symptoms": detected["symptoms"],
        "severity": detected["severity"],
        "treatment": detected["treatment"],
        "pesticides": detected["pesticides"],
        "organic_remedy": detected["organic_remedy"],
        "video_url": detected["video_url"],
        "buy_links": [
            f"https://www.amazon.in/s?k={p.replace(' ', '+')}" for p in detected["pesticides"]
        ],
    }

def suggest_treatment(disease_name: str) -> dict:
    for crop_diseases in DISEASE_DB.values():
        for d in crop_diseases:
            if d["disease_name"].lower() == disease_name.lower():
                return {
                    "treatment": d["treatment"],
                    "pesticides": d["pesticides"],
                    "organic_remedy": d["organic_remedy"],
                }
    return {"treatment": "Consult local agricultural officer", "pesticides": [], "organic_remedy": ""}
