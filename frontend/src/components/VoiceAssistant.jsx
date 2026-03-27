import { useState, useCallback } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

// Web Speech API — works on desktop and mobile (no external requests)
export function speak(text, lang = 'te') {
  if (!window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang === 'en' ? 'en-IN' : 'te-IN'
  utt.rate = 0.9
  utt.volume = 1
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find(v => v.lang === utt.lang) || voices.find(v => v.lang.startsWith(lang))
    if (match) utt.voice = match
    window.speechSynthesis.speak(utt)
  }
  // Mobile loads voices async
  if (window.speechSynthesis.getVoices().length > 0) {
    trySpeak()
  } else {
    window.speechSynthesis.onvoiceschanged = () => { trySpeak(); window.speechSynthesis.onvoiceschanged = null }
  }
}

export default function VoiceAssistant({ onTranscript, lang = 'te', welcomeText, welcomeLang = 'te' }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return alert('Speech recognition not supported. Please use Chrome browser.')
    const rec = new SpeechRecognition()
    const langCode = lang === 'en' ? 'en-IN' : `${lang}-IN`
    rec.lang = langCode
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onstart = () => setListening(true)
    rec.onresult = e => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      onTranscript?.(text)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.start()
  }, [lang, onTranscript])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
      <button className={`btn ${listening ? 'btn-danger' : 'btn-primary'}`}
        onClick={listening ? undefined : startListening}>
        {listening ? 'వింటున్నాను...' : 'మాట్లాడండి (Speak)'}
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      {welcomeText && (
        <button className="btn btn-secondary" onClick={() => speak(welcomeText, welcomeLang)}>
          <Volume2 size={18} /> {welcomeLang === 'te' ? 'తెలుగులో వినండి' : 'Listen in English'}
        </button>
      )}
      {transcript && (
        <span style={{ fontSize: '.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          "{transcript}"
        </span>
      )}
    </div>
  )
}
