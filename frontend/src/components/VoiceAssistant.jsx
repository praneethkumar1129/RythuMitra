import { useState, useCallback } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export function speak(text, lang = 'te-IN') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang
  utt.rate = 0.9
  window.speechSynthesis.speak(utt)
}

export default function VoiceAssistant({ onTranscript, lang = 'te-IN', welcomeText }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return alert('Speech recognition not supported in this browser')
    const rec = new SpeechRecognition()
    rec.lang = lang
    rec.interimResults = false
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
        {listening ? 'Listening...' : 'Speak'}
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
