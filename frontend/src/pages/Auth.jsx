import { useState } from 'react'
import { LogIn, UserPlus, Eye, EyeOff, Plus, X } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const WATER_SOURCES = ['borewell', 'canal', 'rain']
const COMMON_CROPS  = ['Rice', 'Wheat', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Soybean', 'Onion', 'Sugarcane']

export default function Auth() {
  const [tab, setTab]           = useState(() => new URLSearchParams(window.location.search).get('tab') === 'register' ? 'register' : 'login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()
  const location                = useLocation()
  const from                    = location.state?.from || '/'

  // Login state
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' })

  // Register state
  const [regForm, setRegForm] = useState({
    name: '', phone: '', password: '', location: '',
    land_size: '', water_source: 'borewell', crops: [],
  })
  const [cropInput, setCropInput] = useState('')

  const setReg = (k, v) => setRegForm(f => ({ ...f, [k]: v }))

  const addCrop = (c) => {
    const crop = c.trim()
    if (crop && !regForm.crops.includes(crop)) setReg('crops', [...regForm.crops, crop])
    setCropInput('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginForm.phone || !loginForm.password) return toast.error('Enter phone and password')
    setLoading(true)
    try {
      const { data } = await api.post('/api/login', loginForm)
      login(data)
      toast.success(`Welcome back, ${data.name}! 👋`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed. Check phone & password.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regForm.name || !regForm.location || !regForm.land_size)
      return toast.error('Fill name, location and land size')
    if (regForm.crops.length === 0) return toast.error('Select at least one crop')
    if (!regForm.phone) return toast.error('Phone number is required to login later')
    if (!regForm.password) return toast.error('Set a password to login later')
    setLoading(true)
    try {
      const { data } = await api.post('/api/register_farmer', {
        ...regForm, land_size: parseFloat(regForm.land_size),
      })
      login(data)
      toast.success(`Registered! Welcome, ${data.name}! 🎉`)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'var(--green-pale)', borderRadius: 12, padding: 4, marginBottom: '1.5rem' }}>
        {[
          { key: 'login',    label: 'Login',    icon: <LogIn size={16} /> },
          { key: 'register', label: 'Register', icon: <UserPlus size={16} /> },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="btn" style={{
              flex: 1, justifyContent: 'center', borderRadius: 10, gap: '.4rem',
              background: tab === t.key ? 'var(--green)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--green)',
              fontWeight: 700, transition: 'all .2s',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── LOGIN FORM ── */}
      {tab === 'login' && (
        <form className="card" onSubmit={handleLogin} style={{ animation: 'fadeIn .2s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.25rem' }}>👨‍🌾</div>
            <h2 style={{ fontWeight: 800, color: 'var(--green)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Login to your RythuMitra account</p>
          </div>

          <div className="form-group">
            <label>📱 Phone Number</label>
            <input type="tel" value={loginForm.phone}
              onChange={e => setLoginForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Enter your 10-digit mobile number"
              maxLength={10} required autoFocus />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Enter your password"
                style={{ paddingRight: '2.5rem' }} required />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '.75rem', fontSize: '1rem', marginTop: '.5rem' }}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.9rem', color: 'var(--text-muted)' }}>
            New to RythuMitra?{' '}
            <button type="button" onClick={() => setTab('register')}
              style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem' }}>
              Register here →
            </button>
          </p>
        </form>
      )}

      {/* ── REGISTER FORM ── */}
      {tab === 'register' && (
        <form className="card" onSubmit={handleRegister} style={{ animation: 'fadeIn .2s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.25rem' }}>🌱</div>
            <h2 style={{ fontWeight: 800, color: 'var(--green)' }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Join thousands of farmers on RythuMitra</p>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>👤 Full Name *</label>
              <input value={regForm.name} onChange={e => setReg('name', e.target.value)}
                placeholder="మీ పేరు / Your name" required />
            </div>
            <div className="form-group">
              <label>📱 Phone *</label>
              <input type="tel" value={regForm.phone} onChange={e => setReg('phone', e.target.value)}
                placeholder="10-digit number" maxLength={10} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>📍 Location *</label>
              <input value={regForm.location} onChange={e => setReg('location', e.target.value)}
                placeholder="Village / District" required />
            </div>
            <div className="form-group">
              <label>📐 Land Size (acres) *</label>
              <input type="number" min="0.1" step="0.1" value={regForm.land_size}
                onChange={e => setReg('land_size', e.target.value)} placeholder="e.g. 2.5" required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>💧 Water Source</label>
              <select value={regForm.water_source} onChange={e => setReg('water_source', e.target.value)}>
                {WATER_SOURCES.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>🔒 Password *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={regForm.password}
                  onChange={e => setReg('password', e.target.value)}
                  placeholder="Set a password" style={{ paddingRight: '2.5rem' }} required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Crop selector */}
          <div className="form-group">
            <label>🌾 Your Crops *</label>
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
              {COMMON_CROPS.map(c => (
                <button key={c} type="button"
                  className={`btn btn-sm ${regForm.crops.includes(c) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => regForm.crops.includes(c)
                    ? setReg('crops', regForm.crops.filter(x => x !== c))
                    : addCrop(c)}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input value={cropInput} onChange={e => setCropInput(e.target.value)}
                placeholder="Other crop..."
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCrop(cropInput))} />
              <button type="button" className="btn btn-secondary" onClick={() => addCrop(cropInput)}>
                <Plus size={16} />
              </button>
            </div>
            {regForm.crops.length > 0 && (
              <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                {regForm.crops.map(c => (
                  <span key={c} className="badge badge-green"
                    style={{ display: 'flex', alignItems: 'center', gap: '.3rem', cursor: 'pointer' }}
                    onClick={() => setReg('crops', regForm.crops.filter(x => x !== c))}>
                    {c} <X size={11} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '.75rem', fontSize: '1rem' }}>
            {loading ? '⏳ Registering...' : '✅ Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.9rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <button type="button" onClick={() => setTab('login')}
              style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem' }}>
              Login here →
            </button>
          </p>
        </form>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
    </div>
  )
}
