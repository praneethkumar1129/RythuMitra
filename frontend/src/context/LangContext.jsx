import { createContext, useContext, useState, useEffect } from 'react'

const LangContext = createContext(null)

const i18n = {
  nav: {
    home: { te: 'హోమ్', en: 'Home', hi: 'घर', kn: 'ಮುಖ್ಯ ಪುಟ', ta: 'முகப்பு', ml: 'ഹോം' },
    crops: { te: 'పంటలు', en: 'Crops', hi: 'फसलें', kn: 'ಬೆಳೆಗಳು', ta: 'பயிர்கள்', ml: 'പശ്ചാത്തലം' },
    disease: { te: 'వ్యాధి', en: 'Disease', hi: 'रोग', kn: 'ರೋಗ', ta: 'நோய்', ml: 'രോഗം' },
    market: { te: 'మార్కెట్', en: 'Market', hi: 'बाजार', kn: 'ಬಜಾರು', ta: 'சந்தை', ml: 'വിപണി' },
    jobs: { te: 'ఉద్యోగాలు', en: 'Jobs', hi: 'नौकरियाँ', kn: 'ಗೊತ್ತುಗಳು', ta: 'வேலைகள்', ml: 'ജോലികൾ' },
    weather: { te: 'వాతావరణం', en: 'Weather', hi: 'मौसम', kn: 'ಹವಾಮಾನ', ta: 'இம்மானை', ml: 'കാലാവസ്ഥ' },
    schemes: { te: 'పథకాలు', en: 'Schemes', hi: 'योजनाएँ', kn: 'ಯೋಜನೆಗಳು', ta: 'திட்டங்கள்', ml: 'പദ്ധതികൾ' },
    profile: { te: 'ప్రొఫైల్', en: 'Profile', hi: 'प्रोफ़ाइल', kn: 'ಸಂಕೀರ್ಣ', ta: 'சுயவிவரம்', ml: 'പ്രൊഫൈൽ' },
    login: { te: 'లాగిన్', en: 'Login', hi: 'लॉगिन', kn: 'ಲಾಗಿನ್', ta: 'புகுபதிவு', ml: 'ലോഗിൻ' }
  },
  common: {
    welcome: { 
      te: 'రైతు సేవకు స్వాగతం. పంట సూచనలు, మొక్కల వ్యాధి గుర్తింపు, వ్యవసాయ ఉద్యోగాలు మరియు ప్రభుత్వ పథకాలలో నేను మీకు సహాయం చేస్తాను.',
      en: 'Welcome to Rythu Seva. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes.',
      hi: 'रैयतु सेवा में आपका स्वागत है। मैं आपको फसल सुझाव, पौधों की बीमारी पहचान, खेती के काम और सरकारी योजनाओं में मदद करूंगा।',
      kn: 'ರೈತು ಸೇವೆಗೆ ಸ್ವಾಗತ. ನಾನು ಬೆಳೆ ಸಲಹೆಗಳು, ಸಸ್ಯ ರೋಗ ಗುರುತಿಸುವಿಕೆ, ರೈತಿಂಗ್ ಉದ್ಯೋಗಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಲ್ಲಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
      ta: 'ரய்து சேவைக்கு வரவேற்கிறோம். நான் பயிர் பரிந்துரைகள், தாவர நோய் கண்டறியல், விவசாய வேலைகள் மற்றும் அரசு திட்டங்களில் உங்களுக்கு உதவுகிறேன்.',
      ml: 'രൈതു സേവയിലേക്ക് സ്വാഗതം. ഞാൻ നിങ്ങളെ വിളവ് നിർദ്ദേശങ്ങൾ, ചെറു രോഗ അവഗണന, കൃഷി ജോലികൾ, സർക്കാർ പദ്ധതികൾ എന്നിവയിൽ സഹായിക്കാം.'
    },
    toggleLang: { te: 'ఇంగ్లీష్', en: 'తెలుగు', hi: 'अंग्रेज़ी', kn: 'ಇಂಗ್ಲಿಷ್', ta: 'ஆங்கிலம்', ml: 'ഇംഗ്ലീഷ്' },
    speak: { te: 'వినండి', en: 'Listen', hi: 'सुनें', kn: 'ಶ್ರവಿಸಿ', ta: 'கேள்', ml: 'കേൾക്കുക' },
    // Add more as needed for pages
    cropRecTitle: { te: 'పంట సిఫార్సు', en: 'Crop Recommendation', hi: 'फसल सिफारिश', kn: 'ಬೆಳೆ ಸಿಫಾರ್ಸು', ta: 'பயிர் பரிந்துரை', ml: 'പശ്ചാത്തല നിർദ്ദേശം' },
    soilType: { te: 'నేల రకం', en: 'Soil Type', hi: 'मिट्टी का प्रकार', kn: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ', ta: 'மண் வகை', ml: 'മണ്ണ് തരം' },
    cropRecTitle: { te: 'పంట సిఫార్సు', en: 'Crop Recommendation', hi: 'फसल सिफारिश', kn: 'ಬೆಳೆ ಸಿಫಾರ್ಸು', ta: 'பயிர் பரிந்துரை', ml: 'പശ്ചാത്തല നിർദ്ദേശം' },
    landDetails: { te: 'భూమి వివరాలు', en: 'Land Details', hi: 'भूमि विवरण', kn: 'ಭೂಮಿ ವಿವರಗಳು', ta: 'நில விவரங்கள்', ml: 'നില വിശദാംശങ്ങൾ' },
    location: { te: 'స్థానం / జిల్లా', en: 'Location / District', hi: 'स्थान / जिला', kn: 'ಸ್ಥಳ / ಜಿಲ್ಲೆ', ta: 'இடம் / மாவட்டம்', ml: 'സ്ഥലം / ജില്ല' },
    waterSource: { te: 'నీటి మూలం', en: 'Water Source', hi: 'जल स्रोत', kn: 'ನೀರಿನ ಮೂಲ', ta: 'நீர் மூலம்', ml: 'നീർ ഉറവിടം' },
    landSize: { te: 'భూమి పరిమాణం (ఎకరాలు)', en: 'Land Size (acres)', hi: 'भूमि आकार (एकड़)', kn: 'ಭೂಮಿ ಆಕಾರ (ಎಕರೆ)', ta: 'நில அளவு (எக்டேர்)', ml: 'നില പരിമാണം (എക്കർ)' },
    analyze: { te: 'విశ్లేషించండి', en: 'Analyzing...', hi: 'विश्लेषण कर रहे हैं...', kn: 'ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇನೆ...', ta: 'பகுப்பாய்வு செய்கிறது...', ml: 'വിശകലനം ചെയ്യുന്നു...' },
    getRec: { te: 'సిఫార్సులు పొందండి', en: 'Get Recommendations', hi: 'सिफारिशें प्राप्त करें', kn: 'ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ', ta: 'பரிந்துரைகளைப் பெறுங்கள்', ml: 'നിർദ്ദേശങ്ങൾ ലഭിക്കുക' },
    recCrops: { te: 'సిఫార్సు పంటలు', en: 'Recommended Crops', hi: 'अनुशंसित फसलें', kn: 'ಶಿಫಾರಸು ಬೆಳೆಗಳು', ta: 'பரிந்துரைக்கப்பட்ட பயிர்கள்', ml: 'നിർദ്ദേശിക്കപ്പെട്ട വിളകൾ' }
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'te'  // Default Telugu
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = (category, key) => {
    return i18n[category]?.[key]?.[lang] || i18n.common[key]?.[lang] || key
  }

  const toggleLang = (newLang) => setLang(newLang)
  const langs = ['te', 'en']  // Telugu, English

  return (
    <LangContext.Provider value={{ lang, t, toggleLang, langs }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}

