import { useState } from 'react'
import { Cloud, Droplets, AlertTriangle, Search, Wind, Thermometer } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const LOCATIONS = ['Hyderabad', 'Warangal', 'Guntur', 'Karimnagar', 'Nellore', 'Khammam', 'Nizamabad', 'Vijayawada']
const CONDITION_EMOJI = {
  'Partly Cloudy': '⛅', 'Sunny': '☀️', 'Hot & Dry': '🌵', 'Cloudy': '☁️',
  'Humid': '💧', 'Clear': '🌤️', 'Heavy Rain': '🌧️', 'Thunderstorm': '⛈️',
}

function getFarmingAdvice(w) {
  const tips = []
  if (w.rain_chance > 60) {
    tips.push({ icon: '🌧️', text: 'High rain chance — avoid pesticide spraying today' })
    tips.push({ icon: '🌾', text: 'Ensure proper drainage to prevent waterlogging' })
  } else if (w.rain_chance < 15) {
    tips.push({ icon: '💧', text: 'Low rain — irrigate crops, especially newly sown fields' })
  }
  if (w.temp > 35) {
    tips.push({ icon: '🌡️', text: 'High temperature — water crops in early morning or evening' })
    tips.push({ icon: '🧴', text: 'Apply mulching to retain soil moisture' })
  }
  if (w.humidity > 75) {
    tips.push({ icon: '🍄', text: 'High humidity — watch for fungal diseases on crops' })
  }
  if (tips.length === 0) {
    tips.push({ icon: '✅', text: 'Good weather for farming activities today' })
    tips.push({ icon: '🌱', text: 'Suitable conditions for sowing and field work' })
  }
  return tips
}

export default function Weather() {
  const [location, setLocation] = useState('Hyderabad')
  const [weather, setWeather]   = useState(null)
  const [loading, setLoading]   = useState(false)

  const fetchWeather = async () => {
    if (!location) return
    setLoading(true)
    try {
      const { data } = await api.get(`/api/weather/${encodeURIComponent(location)}`)
      setWeather(data)
    } catch { toast.error('Failed to fetch weather data') }
    finally { setLoading(false) }
  }

  const emoji = weather ? (CONDITION_EMOJI[weather.condition] || '🌤️') : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <div style={{ background: '#e0f2fe', borderRadius: 10, padding: '8px', display: 'flex' }}>
          <Cloud size={22} color="#0ea5e9" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.3px' }}>Weather & Alerts</h1>
          <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>Real-time weather and farming advisories</p>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '.75rem', marginBottom: '.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={location} onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather()}
              placeholder="Enter city or district..." style={{ paddingLeft: '2.4rem' }} />
          </div>
          <button className="btn btn-primary" onClick={fetchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
          {LOCATIONS.map(l => (
            <button key={l} onClick={() => setLocation(l)}
              style={{
                padding: '.25rem .7rem', borderRadius: 6, border: '1.5px solid',
                cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s',
                background: location === l ? 'var(--green)' : 'transparent',
                color: location === l ? '#fff' : 'var(--green)',
                borderColor: 'var(--green)',
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="spinner" />}

      {weather && !loading && (
        <>
          {/* Alert */}
          {weather.alert && (
            <div className="alert alert-amber">
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Weather Alert</strong>
                <p style={{ marginTop: '.2rem', fontSize: '.85rem' }}>{weather.alert}</p>
              </div>
            </div>
          )}

          {/* Main weather card */}
          <div style={{ background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', borderRadius: 16, padding: '2rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '.85rem', opacity: .8, marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  📍 {weather.location}
                </p>
                <div style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>{weather.temp}°C</div>
                <div style={{ fontSize: '1.1rem', marginTop: '.4rem', opacity: .9 }}>{emoji} {weather.condition}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: <Droplets size={18} />, label: 'Humidity', value: `${weather.humidity}%` },
                  { icon: <Cloud size={18} />, label: 'Rain Chance', value: `${weather.rain_chance}%` },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', fontSize: '.9rem' }}>
                    <div style={{ opacity: .8 }}>{s.icon}</div>
                    <span style={{ opacity: .8 }}>{s.label}</span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farming advice */}
          <div className="card">
            <div className="section-title">🌾 Farming Advice for Today</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {getFarmingAdvice(weather).map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '.75rem', padding: '.65rem .85rem', background: 'var(--green-pale)', borderRadius: 8, fontSize: '.88rem', alignItems: 'flex-start', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{tip.icon}</span>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!weather && !loading && (
        <div className="empty-state card">
          <Cloud size={44} />
          <p>Select a location or search to get weather and farming alerts</p>
        </div>
      )}
    </div>
  )
}
