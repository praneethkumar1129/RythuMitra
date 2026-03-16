import { useState, useCallback } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

// Uses Google Translate TTS — works in all browsers, real Telugu audio
export function speak(text, lang = 'te') {
  try {
    const encoded = encodeURIComponent(text)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`
    const audio = new Audio(url)
    audio.volume = 1.0
    audio.play().catch(() => {
      // Fallback to Web Speech API if Google TTS blocked
      webSpeechFallback(text, lang)
    })
  } catch {
    webSpeechFallback(text, lang)
  }
}

function webSpeechFallback(text, lang) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang === 'te' ? 'te-IN' : 'en-IN'
  utt.rate = 0.85
  window.speechSynthesis.speak(utt)
}

export default function VoiceAssistant({ onTranscript, lang = 'te-IN', welcomeText, welcomeLang = 'te' }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return alert('Speech recognition not supported. Please use Chrome browser.')
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
      <button className={`btn ${listening ? 'btn-danger' : 'btn-primary'}`}
        onClick={listening ? undefined : startListening}>
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
        {listening ? 'వింటున్నాను...' : 'మాట్లాడండి (Speak)'}
      </button>
      {welcomeText && (
        <button className="btn btn-secondary" onClick={() => speak(welcomeText, welcomeLang)}>
          <Volume2 size={18} /> తెలుగులో వినండి
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
