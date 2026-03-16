import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import toast from 'react-hot-toast'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!phone || !password) return toast.error('Enter phone and password')
    setLoading(true)
    try {
      const { data } = await api.post('/api/login', { phone, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('farmer_id', data.farmer_id)
      localStorage.setItem('farmer_name', data.name)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto' }}>
      {/* Tab Toggle */}
      <div style={{ display: 'flex', marginBottom: '1.5rem', background: 'var(--green-pale)', borderRadius: 10, padding: 4 }}>
        {['login', 'register'].map(t => (
          <button key={t} onClick={() => t === 'register' ? navigate('/register') : setTab(t)}
            className="btn" style={{
              flex: 1, justifyContent: 'center', borderRadius: 8,
              background: tab === t ? 'var(--green)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--green)',
            }}>
            {t === 'login' ? <><LogIn size={16} /> Login</> : <><UserPlus size={16} /> Register</>}
          </button>
        ))}
      </div>

      <form className="card" onSubmit={handleLogin}>
        <h2 style={{ fontWeight: 800, marginBottom: '1.25rem', color: 'var(--green)' }}>
          👨‍🌾 Farmer Login
        </h2>

        <div className="form-group">
          <label>Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="10-digit mobile number" type="tel" required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Your password" type="password" required />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginBottom: '.75rem' }}>
          {loading ? 'Logging in...' : '🔐 Login'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '.85rem', color: 'var(--text-muted)' }}>
          New farmer? <Link to="/register" style={{ color: 'var(--green)', fontWeight: 600 }}>Register here</Link>
        </p>
      </form>
    </div>
  )
}
