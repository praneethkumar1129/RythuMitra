import { useState } from 'react'
import { Cloud, Thermometer, Droplets, Wind, AlertTriangle, Search } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const LOCATIONS = ['Hyderabad', 'Warangal', 'Guntur', 'Karimnagar', 'Nellore', 'Khammam', 'Nizamabad', 'Vijayawada']

const CONDITION_EMOJI = {
  'Partly Cloudy': '⛅', 'Sunny': '☀️', 'Hot & Dry': '🌵', 'Cloudy': '☁️',
  'Humid': '💧', 'Clear': '🌤️', 'Heavy Rain': '🌧️', 'Thunderstorm': '⛈️',
}

export default function Weather() {
  const [location, setLocation] = useState('Hyderabad')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    if (!location) return
    setLoading(true)
    try {
      const { data } = await api.get(`/api/weather/${encodeURIComponent(location)}`)
      setWeather(data)
    } catch {
      toast.error('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const emoji = weather ? (CONDITION_EMOJI[weather.condition] || '🌤️') : ''

  return (
    <div>
      <div className="page-title"><Cloud size={24} /> Weather & Disaster Alerts</div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="Enter city or district..." style={{ flex: 1, minWidth: 200 }}
            onKeyDown={e => e.key === 'Enter' && fetch()} />
          <button className="btn btn-primary" onClick={fetch} disabled={loading}>
            <Search size={16} /> {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginTop: '.75rem' }}>
          {LOCATIONS.map(l => (
            <button key={l} className={`btn btn-sm ${location === l ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setLocation(l) }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="spinner" />}

      {weather && !loading && (
        <>
          {/* Alert Banner */}
          {weather.alert && (
            <div style={{ background: '#fef3c7', border: '1px solid var(--amber)', borderRadius: 12,
              padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <AlertTriangle size={24} color="var(--amber)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#92400e' }}>⚠️ Weather Alert</strong>
                <p style={{ color: '#78350f', fontSize: '.9rem', marginTop: '.2rem' }}>{weather.alert}</p>
              </div>
            </div>
          )}

          {/* Main Weather Card */}
          <div className="card" style={{ marginBottom: '1.25rem', background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '.9rem', opacity: .85, marginBottom: '.25rem' }}>📍 {weather.location}</div>
                <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>{weather.temp}°C</div>
                <div style={{ fontSize: '1.1rem', marginTop: '.25rem' }}>{emoji} {weather.condition}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                <StatRow icon={<Droplets size={18} />} label="Humidity" value={`${weather.humidity}%`} />
                <StatRow icon={<Cloud size={18} />} label="Rain Chance" value={`${weather.rain_chance}%`} />
              </div>
            </div>
          </div>

          {/* Farming Advice */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🌾 Farming Advice for Today</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {getFarmingAdvice(weather).map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '.6rem', padding: '.6rem .75rem',
                  background: 'var(--green-pale)', borderRadius: 8, fontSize: '.9rem' }}>
                  <span>{tip.icon}</span><span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!weather && !loading && (
        <div className="empty-state card">
          <Cloud size={48} />
          <p>Select a location or search to get weather information and farming alerts</p>
        </div>
      )}
    </div>
  )
}

function StatRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.9rem' }}>
      {icon} <span style={{ opacity: .85 }}>{label}:</span> <strong>{value}</strong>
    </div>
  )
}

function getFarmingAdvice(w) {
  const tips = []
  if (w.rain_chance > 60) {
    tips.push({ icon: '🌧️', text: 'High rain chance — avoid pesticide spraying today' })
    tips.push({ icon: '🌾', text: 'Ensure proper drainage in your fields to prevent waterlogging' })
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
