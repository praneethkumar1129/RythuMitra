import { useState, useCallback } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export function speak(text, lang = 'te-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang
  utt.rate = 0.85
  utt.pitch = 1.0
  utt.volume = 1.0

  // Try to find a Telugu voice, fallback to any available
  const voices = window.speechSynthesis.getVoices()
  const teluguVoice = voices.find(v => v.lang === 'te-IN' || v.lang.startsWith('te'))
  const indianVoice = voices.find(v => v.lang === 'en-IN')

  if (teluguVoice) {
    utt.voice = teluguVoice
  } else if (lang === 'te-IN' && indianVoice) {
    // Fallback: speak English translation with Indian accent
    utt.voice = indianVoice
    utt.lang = 'en-IN'
    utt.text = 'Welcome to RythuMitra. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes.'
  }

  // Voices may not be loaded yet — wait and retry
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const v2 = window.speechSynthesis.getVoices()
      const tv = v2.find(v => v.lang === 'te-IN' || v.lang.startsWith('te'))
      if (tv) utt.voice = tv
      window.speechSynthesis.speak(utt)
    }
  } else {
    window.speechSynthesis.speak(utt)
  }
}

export default function VoiceAssistant({ onTranscript, lang = 'te-IN', welcomeText }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return alert('Speech recognition not supported in this browser. Use Chrome.')
    const rec = new SpeechRecognition()
    rec.lang = lang
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
      <button
        className={`btn ${listening ? 'btn-danger' : 'btn-primary'}`}
        onClick={listening ? undefined : startListening}
      >
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
        {listening ? 'Listening...' : 'Speak (తెలుగు)'}
      </button>
      {welcomeText && (
        <button className="btn btn-secondary" onClick={() => speak(welcomeText, lang)}>
          <Volume2 size={18} /> Play Welcome
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
