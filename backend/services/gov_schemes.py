GOV_SCHEMES = [
    {
        "id": "pm_kisan",
        "name": "PM-KISAN",
        "full_name": "Pradhan Mantri Kisan Samman Nidhi",
        "benefit": "₹6,000 per year direct income support in 3 installments",
        "eligibility": "All small and marginal farmers with cultivable land",
        "how_to_apply": "Visit nearest CSC center or apply at pmkisan.gov.in",
        "documents": ["Aadhaar Card", "Land Records", "Bank Account"],
        "link": "https://pmkisan.gov.in",
        "category": "Income Support",
    },
    {
        "id": "fasal_bima",
        "name": "PMFBY",
        "full_name": "Pradhan Mantri Fasal Bima Yojana",
        "benefit": "Crop insurance against natural calamities, pests and diseases",
        "eligibility": "All farmers growing notified crops",
        "how_to_apply": "Apply through bank, CSC or insuranceforfarmer.com",
        "documents": ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
        "link": "https://pmfby.gov.in",
        "category": "Crop Insurance",
    },
    {
        "id": "kcc",
        "name": "KCC",
        "full_name": "Kisan Credit Card",
        "benefit": "Short-term credit up to ₹3 lakh at 4% interest rate",
        "eligibility": "Farmers, sharecroppers, tenant farmers",
        "how_to_apply": "Apply at any nationalized bank or cooperative bank",
        "documents": ["Aadhaar Card", "Land Records", "Passport Photo"],
        "link": "https://www.nabard.org/content1.aspx?id=572",
        "category": "Credit",
    },
    {
        "id": "soil_health",
        "name": "Soil Health Card",
        "full_name": "Soil Health Card Scheme",
        "benefit": "Free soil testing and crop-wise fertilizer recommendations",
        "eligibility": "All farmers",
        "how_to_apply": "Contact local agriculture department or soilhealth.dac.gov.in",
        "documents": ["Aadhaar Card", "Land Details"],
        "link": "https://soilhealth.dac.gov.in",
        "category": "Soil & Fertilizer",
    },
    {
        "id": "rytu_bandhu",
        "name": "Rythu Bandhu",
        "full_name": "Telangana Rythu Bandhu Scheme",
        "benefit": "₹10,000 per acre per year investment support",
        "eligibility": "Farmers in Telangana with land records",
        "how_to_apply": "Auto-credited to registered bank account via Pahani records",
        "documents": ["Pahani / Land Records", "Bank Account linked to Aadhaar"],
        "link": "https://rythubandhu.telangana.gov.in",
        "category": "State Scheme",
    },
    {
        "id": "ap_annadata",
        "name": "YSR Rythu Bharosa",
        "full_name": "YSR Rythu Bharosa - PM Kisan",
        "benefit": "₹13,500 per year per farmer family",
        "eligibility": "Farmers in Andhra Pradesh",
        "how_to_apply": "Registered automatically through village secretariat",
        "documents": ["Aadhaar Card", "Land Records"],
        "link": "https://apagrisnet.gov.in",
        "category": "State Scheme",
    },
]

def get_all_schemes() -> list:
    return GOV_SCHEMES

def get_scheme_by_category(category: str) -> list:
    return [s for s in GOV_SCHEMES if s["category"].lower() == category.lower()]
