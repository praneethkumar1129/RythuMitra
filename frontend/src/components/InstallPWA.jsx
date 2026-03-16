import { useState, useEffect } from 'react'

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      setPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  async function install() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setShow(false)
  }

  return (
    <div style={{
      position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 999,
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14,
      boxShadow: '0 4px 20px rgba(0,0,0,.15)', padding: '1rem',
      display: 'flex', flexDirection: 'column', gap: '.6rem', maxWidth: 260
    }}>
      <button onClick={() => setShow(false)}
        style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#999' }}>
        ✕
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <span style={{ fontSize: '1.8rem' }}>🌾</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Install RythuMitra</div>
          <div style={{ fontSize: '.75rem', color: '#666' }}>Add to your home screen</div>
        </div>
      </div>
      <button onClick={install}
        style={{
          background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8,
          padding: '.5rem', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer'
        }}>
        📲 Install App
      </button>
    </div>
  )
}
