import { useState } from 'react'
import { UserPlus, Plus, X } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'
import VoiceAssistant from '../components/VoiceAssistant'

const WATER_SOURCES = ['borewell', 'canal', 'rain']
const COMMON_CROPS = ['Rice', 'Wheat', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Soybean', 'Onion', 'Sugarcane']

export default function Register() {
  const [form, setForm] = useState({ name: '', location: '', land_size: '', water_source: 'borewell', crops: [], phone: '' })
  const [cropInput, setCropInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addCrop = (crop) => {
    const c = crop.trim()
    if (c && !form.crops.includes(c)) set('crops', [...form.crops, c])
    setCropInput('')
  }

  const removeCrop = (c) => set('crops', form.crops.filter(x => x !== c))

  const handleVoice = (text) => {
    // Simple voice parsing: fill name if empty
    if (!form.name) set('name', text)
    else toast(text, { icon: '🎤' })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.location || !form.land_size) return toast.error('Please fill all required fields')
    if (form.crops.length === 0) return toast.error('Add at least one crop')
    setLoading(true)
    try {
      const { data } = await api.post('/api/register_farmer', { ...form, land_size: parseFloat(form.land_size) })
      localStorage.setItem('token', data.token)
      localStorage.setItem('farmer_id', data.farmer_id)
      setRegistered(data)
      toast.success('Registration successful!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (registered) return (
    <div className="card" style={{ maxWidth: 500, margin: '2rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: 3 + 'rem', marginBottom: '.5rem' }}>🎉</div>
      <h2 style={{ color: 'var(--green)', marginBottom: '.5rem' }}>Welcome, {form.name}!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your farmer profile has been created successfully.</p>
      <div style={{ background: 'var(--green-pale)', borderRadius: 8, padding: '1rem', marginBottom: '1rem', textAlign: 'left' }}>
        <div><strong>Farmer ID:</strong> <code style={{ fontSize: '.8rem' }}>{registered.farmer_id}</code></div>
        <div><strong>Location:</strong> {form.location}</div>
        <div><strong>Land:</strong> {form.land_size} acres</div>
        <div><strong>Crops:</strong> {form.crops.join(', ')}</div>
      </div>
      <button className="btn btn-primary" onClick={() => setRegistered(null)}>Register Another</button>
    </div>
  )

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-title"><UserPlus size={24} /> Farmer Registration</div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '.75rem', color: 'var(--text-muted)', fontSize: '.9rem' }}>
          🎤 You can speak your name or use the form below
        </p>
        <VoiceAssistant onTranscript={handleVoice} lang="te-IN"
          welcomeText="దయచేసి మీ పేరు, స్థానం మరియు భూమి వివరాలు చెప్పండి." />
      </div>

      <form className="card" onSubmit={submit}>
        <div className="grid-2">
          <div className="form-group">
            <label>Full Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="మీ పేరు / Your name" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile number" />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Location / Village *</label>
            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Warangal, Guntur" required />
          </div>
          <div className="form-group">
            <label>Land Size (acres) *</label>
            <input type="number" min="0.1" step="0.1" value={form.land_size}
              onChange={e => set('land_size', e.target.value)} placeholder="e.g. 2.5" required />
          </div>
        </div>

        <div className="form-group">
          <label>Water Source *</label>
          <select value={form.water_source} onChange={e => set('water_source', e.target.value)}>
            {WATER_SOURCES.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Current / Planned Crops *</label>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
            {COMMON_CROPS.map(c => (
              <button key={c} type="button"
                className={`btn btn-sm ${form.crops.includes(c) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => form.crops.includes(c) ? removeCrop(c) : addCrop(c)}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input value={cropInput} onChange={e => setCropInput(e.target.value)}
              placeholder="Type other crop name..."
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCrop(cropInput))} />
            <button type="button" className="btn btn-secondary" onClick={() => addCrop(cropInput)}><Plus size={16} /></button>
          </div>
          {form.crops.length > 0 && (
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
              {form.crops.map(c => (
                <span key={c} className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  {c} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeCrop(c)} />
                </span>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Registering...' : '✅ Register Farmer'}
        </button>
      </form>
    </div>
  )
}
