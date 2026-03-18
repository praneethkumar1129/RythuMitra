# Bilingual Multi-Language Support for RythuMitra
## Approved Plan Breakdown (from blackboxai)

### 1. Setup Multi-Language Context ✅
- [x] Created `rythumitra/frontend/src/context/LangContext.jsx` with state for lang ('te','hi','kn','ta','ml','en'), toggle, i18n dicts for 6 langs.

**Progress: Step 1 complete. Next: Update App.jsx for LangProvider + auto-welcome.**


### 2. Update App & Navbar for Global Toggle & Auto-Welcome ✅
- [x] Edit `App.jsx`: Wrapped LangProvider, added useEffect auto Telugu welcome speak(), passed lang to ChatBot.
- [x] Edit Navbar: Added cycle toggle button (తె→हिं→ಕ→த→മ→EN), translated nav/profile/login labels.

**Progress: Steps 1-2 complete. Next: Update pages/components for lang support (step 3).**

### 3. Bilingual/Multi-lang UI Updates ✅
- [x] Edit components/ChatBot.jsx, VoiceAssistant.jsx: Lang prop, STT/TTS lang codes, bilingual text.
- [x] Edit Dashboard.jsx: useLang, removed local toggle.
- [x] Edit CropRecommendation.jsx: Added useLang + i18n for titles/labels.


**Progress: Steps 1-3 mostly complete. Next: Backend lang support (step 4) + test.**

### 4. Update API Calls & Backend for Lang ✅
- [x] Edit `api.js`: Added X-Lang header from localStorage.
- [x] Edit `backend/routes/chatbot.py`: Added lang param, integrated generate_voice_response(lang), returns reply/lang/lang_code.

**Progress: Steps 1-4 complete. Next: Backend voice multi-lang (step 5) + test + GitHub.**

### 5. Backend Voice Assistant Enhancement ✅
- [x] Edit `backend/ai/voice_assistant.py`: MULTI_LANG_PHRASES dict for all langs, generate_voice_response supports multi-lang.

**Progress: All core steps 1-5 complete. Next: Test + GitHub PR (step 6-7).**

### 6. Testing
- [ ] Run `cd rythumitra/frontend && npm run dev`, test toggle, auto-welcome TTS, STT, AI bilingual responses.
- [ ] Backend test: uvicorn (but frontend proxy handles).

### 7. GitHub PR
- [ ] `git checkout -b blackboxai/multi-lang-voice-ui`
- [ ] Commit changes.
- [ ] `gh pr create --title "Add Multi-Language (TE/HI/KN/TA/ML/EN) + Auto Telugu Welcome" --body "..."`

**Progress: Starting step 1**

