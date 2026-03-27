import { useState } from 'react'
import { LogIn, UserPlus, Eye, EyeOff, Plus, X, Sprout } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const WATER_SOURCES = ['borewell', 'canal', 'rain']
const COMMON_CROPS  = ['Rice', 'Wheat', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Soybean', 'Onion', 'Sugarcane']

export default function Auth() {
  const [tab, setTab]           = useState(() => new URLSearchParams(window.location.search).get('tab') === 'register' ? 'register' : 'login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const { t }                   = useLang()
  const navigate                = useNavigate()
  const location                = useLocation()
  const from                    = location.state?.from || '/'

  const [loginForm, setLoginForm] = useState({ phone: '', password: '' })
  const [regForm, setRegForm]     = useState({ name: '', phone: '', password: '', location: '', land_size: '', water_source: 'borewell', crops: [] })
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
      toast.success(`Welcome back, ${data.name}!`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed. Check phone & password.')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regForm.name || !regForm.location || !regForm.land_size) return toast.error('Fill name, location and land size')
    if (regForm.crops.length === 0) return toast.error('Select at least one crop')
    if (!regForm.phone) return toast.error('Phone number is required')
    if (!regForm.password) return toast.error('Set a password')
    setLoading(true)
    try {
      const { data } = await api.post('/api/register_farmer', { ...regForm, land_size: parseFloat(regForm.land_size) })
      login(data)
      toast.success(`Welcome to Rythu Seva, ${data.name}!`)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>

      {/* Brand header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: 'var(--green)', borderRadius: 14, marginBottom: '.75rem' }}>
          <Sprout size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.4px' }}>{t('app.title')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', marginTop: '.2rem' }}>{t('app.tagline')}</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: '#e9ecef', borderRadius: 10, padding: 4, marginBottom: '1.5rem' }}>
        {[
          { key: 'login',    label: t('auth.sign_in'),  icon: <LogIn size={15} /> },
          { key: 'register', label: t('auth.create_account'), icon: <UserPlus size={15} /> },
        ].map(tab_item => (
          <button key={tab_item.key} onClick={() => setTab(tab_item.key)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem',
              padding: '.55rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '.88rem', fontWeight: 600, transition: 'all .2s',
              background: tab === tab_item.key ? '#fff' : 'transparent',
              color: tab === tab_item.key ? 'var(--green)' : 'var(--text-muted)',
              boxShadow: tab === tab_item.key ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
            }}>
            {tab_item.icon} {tab_item.label}
          </button>
        ))}
      </div>

      {/* LOGIN */}
      {tab === 'login' && (
        <form className="card fade-up" onSubmit={handleLogin}>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '.3rem' }}>{t('auth.welcome_back')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginBottom: '1.5rem' }}>{t('auth.sign_in_subtitle')}</p>

          <div className="form-group">
            <label>{t('auth.phone')}</label>
            <input type="tel" value={loginForm.phone}
              onChange={e => setLoginForm(f => ({ ...f, phone: e.target.value }))}
              placeholder={t('auth.phone_placeholder')} maxLength={10} required autoFocus />
          </div>

          <div className="form-group">
            <label>{t('auth.password')}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                placeholder={t('auth.password_placeholder')} style={{ paddingRight: '2.8rem' }} required />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '.25rem' }}>
            {loading ? t('common.loading') : <><LogIn size={16} /> {t('auth.sign_in')}</>}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.88rem', color: 'var(--text-muted)' }}>
            {t('auth.new_to_rythuseva')}{' '}
            <button type="button" onClick={() => setTab('register')}
              style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', fontSize: '.88rem' }}>
              {t('auth.create_account')} →
            </button>
          </p>
        </form>
      )}

      {/* REGISTER */}
      {tab === 'register' && (
        <form className="card fade-up" onSubmit={handleRegister}>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '.3rem' }}>{t('auth.create_account')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginBottom: '1.5rem' }}>{t('auth.join_thousands')}</p>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('auth.full_name')}</label>
              <input value={regForm.name} onChange={e => setReg('name', e.target.value)} placeholder={t('auth.full_name')} required />
            </div>
            <div className="form-group">
              <label>{t('auth.phone')}</label>
              <input type="tel" value={regForm.phone} onChange={e => setReg('phone', e.target.value)} placeholder={t('auth.phone_placeholder')} maxLength={10} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('auth.location')}</label>
              <input value={regForm.location} onChange={e => setReg('location', e.target.value)} placeholder={t('auth.location')} required />
            </div>
            <div className="form-group">
              <label>{t('auth.land_size')}</label>
              <input type="number" min="0.1" step="0.1" value={regForm.land_size} onChange={e => setReg('land_size', e.target.value)} placeholder="e.g. 2.5" required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>{t('auth.water_source')}</label>
              <select value={regForm.water_source} onChange={e => setReg('water_source', e.target.value)}>
                {WATER_SOURCES.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('auth.password')}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={regForm.password}
                  onChange={e => setReg('password', e.target.value)} placeholder={t('auth.password_placeholder')} style={{ paddingRight: '2.8rem' }} required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>{t('auth.your_crops')}</label>
            <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', marginBottom: '.6rem' }}>
              {COMMON_CROPS.map(c => (
                <button key={c} type="button"
                  style={{
                    padding: '.28rem .7rem', borderRadius: 6, border: '1.5px solid', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s',
                    background: regForm.crops.includes(c) ? 'var(--green)' : 'transparent',
                    color: regForm.crops.includes(c) ? '#fff' : 'var(--green)',
                    borderColor: 'var(--green)',
                  }}
                  onClick={() => regForm.crops.includes(c) ? setReg('crops', regForm.crops.filter(x => x !== c)) : addCrop(c)}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input value={cropInput} onChange={e => setCropInput(e.target.value)} placeholder="Other crop..."
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCrop(cropInput))} />
              <button type="button" className="btn btn-secondary" onClick={() => addCrop(cropInput)}><Plus size={16} /></button>
            </div>
            {regForm.crops.length > 0 && (
              <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginTop: '.6rem' }}>
                {regForm.crops.map(c => (
                  <span key={c} className="badge badge-green" style={{ cursor: 'pointer', gap: '.3rem' }}
                    onClick={() => setReg('crops', regForm.crops.filter(x => x !== c))}>
                    {c} <X size={10} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? t('common.loading') : <><UserPlus size={16} /> {t('auth.register_farmer')}</>}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.88rem', color: 'var(--text-muted)' }}>
            {t('auth.welcome_back')}?{' '}
            <button type="button" onClick={() => setTab('login')}
              style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', fontSize: '.88rem' }}>
              {t('auth.sign_in')} →
            </button>
          </p>
        </form>
      )}
    </div>
  )
}
