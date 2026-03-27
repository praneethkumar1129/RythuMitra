import { useState, useRef, useEffect } from 'react'
import { useLang } from '../context/LangContext'
import api from '../api'
import { speak } from './VoiceAssistant'

export default function ChatBot() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const spokenRef = useRef(false)

  // Reset welcome message when lang changes
  useEffect(() => {
    setMessages([{ role: 'model', text: t('common.welcome') }])
    spokenRef.current = false
  }, [lang])

  // Auto-speak welcome when first opened
  useEffect(() => {
    if (open && !spokenRef.current) {
      spokenRef.current = true
      setTimeout(() => speak(t('common.welcome'), lang), 500)
    }
    if (!open) spokenRef.current = false
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function toggleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return alert('Speech recognition not supported in this browser.')
    if (listening) { recognitionRef.current?.stop(); setListening(false); return }
    const rec = new SR()
    rec.lang = lang === 'en' ? 'en-IN' : 'te-IN'
    rec.interimResults = false
    rec.onresult = e => setInput(e.results[0][0].transcript)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const updated = [...messages, { role: 'user', text }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/chat', { messages: updated, lang })
      const reply = data.reply
      setMessages(prev => [...prev, { role: 'model', text: reply }])
      speak(reply, lang)
    } catch {
      const err = lang === 'te' ? 'క్షమించండి, ఏదో తప్పు జరిగింది.' : 'Sorry, something went wrong.'
      setMessages(prev => [...prev, { role: 'model', text: err }])
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
      {open && (
        <div style={{
          width: 320, height: 440, background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,.18)', display: 'flex', flexDirection: 'column',
          marginBottom: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb'
        }}>
          <div style={{ background: 'var(--green)', color: '#fff', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🌾</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{t('chat.ai_assistant')}</div>
              <div style={{ fontSize: '.7rem', opacity: .8 }}>{t('app.tagline')}</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '.75rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '.4rem', alignItems: 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '.5rem .75rem', borderRadius: 12, fontSize: '.82rem', lineHeight: 1.5,
                  background: m.role === 'user' ? 'var(--green)' : '#f3f4f6',
                  color: m.role === 'user' ? '#fff' : '#111',
                  borderBottomRightRadius: m.role === 'user' ? 2 : 12,
                  borderBottomLeftRadius: m.role === 'model' ? 2 : 12,
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>
                {m.role === 'model' && m.text && (
                  <button onClick={() => speak(m.text, lang)} title="Speak"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1.1rem', flexShrink: 0 }}>
                    🔊
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f3f4f6', padding: '.5rem .75rem', borderRadius: 12, fontSize: '.82rem', color: '#666' }}>
                  {t('chat.thinking')}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '.4rem' }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('common.ask_farming')}
              style={{ flex: 1, padding: '.45rem .7rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '.82rem', outline: 'none' }}
            />
            <button onClick={toggleMic} title={listening ? 'Stop' : 'Speak'}
              style={{ background: listening ? '#ef4444' : '#f3f4f6', color: listening ? '#fff' : '#555', border: 'none', borderRadius: 8, padding: '.45rem .6rem', cursor: 'pointer', fontSize: '1rem' }}>
              {listening ? '⏹' : '🎤'}
            </button>
            <button onClick={send} disabled={loading}
              style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, padding: '.45rem .75rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 700 }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(o => !o)}
        style={{
          width: 52, height: 52, borderRadius: '50%', background: 'var(--green)',
          color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.5rem',
          boxShadow: '0 4px 16px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none'
        }}>
        {open ? '✕' : '🌾'}
      </button>
    </div>
  )
}
