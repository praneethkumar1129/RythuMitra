import { useEffect, useState } from 'react'
import { Sprout, Leaf, Bug, Briefcase, BookOpen, Cloud, BarChart2, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { speak } from '../components/VoiceAssistant'

const WELCOME_TE = 'రైతుమిత్రకు స్వాగతం. పంట సూచనలు, మొక్కల వ్యాధి గుర్తింపు, వ్యవసాయ ఉద్యోగాలు మరియు ప్రభుత్వ పథకాలలో నేను మీకు సహాయం చేస్తాను.'
const WELCOME_EN = 'Welcome to RythuMitra. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes.'

const FEATURES = [
  { to: '/crops',   icon: Leaf,     label: 'Crop Recommendation', desc: 'AI-powered crop suggestions based on your soil & water', color: '#2d7a3a' },
  { to: '/disease', icon: Bug,      label: 'Disease Detection',   desc: 'Upload plant photo to detect disease instantly',         color: '#ef4444' },
  { to: '/demand',  icon: BarChart2,label: 'Market Demand',       desc: 'See which crops have high demand & best prices',         color: '#3b82f6' },
  { to: '/jobs',    icon: Briefcase,label: 'Farm Jobs',           desc: 'Post or find agricultural work near you',               color: '#f59e0b' },
  { to: '/weather', icon: Cloud,    label: 'Weather Alerts',      desc: 'Real-time weather & disaster alerts for your area',     color: '#06b6d4' },
  { to: '/schemes', icon: BookOpen, label: 'Govt Schemes',        desc: 'Subsidies & schemes you can apply for today',           color: '#8b5cf6' },
]

export default function Dashboard() {
  const [lang, setLang] = useState('te')

  useEffect(() => {
    const timer = setTimeout(() => speak(WELCOME_TE, 'te-IN'), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="card" style={{ background: 'linear-gradient(135deg,#2d7a3a,#4caf50)', color: '#fff', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Sprout size={48} />
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>RythuMitra</h1>
            <p style={{ opacity: .85 }}>రైతుమిత్ర — Your AI Farming Assistant</p>
          </div>
        </div>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem', opacity: .9 }}>
          {lang === 'te' ? WELCOME_TE : WELCOME_EN}
        </p>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}
            onClick={() => speak(lang === 'te' ? WELCOME_TE : WELCOME_EN, lang === 'te' ? 'te-IN' : 'en-IN')}>
            <Volume2 size={18} /> Listen
          </button>
          <button className="btn btn-secondary" onClick={() => setLang(l => l === 'te' ? 'en' : 'te')}>
            {lang === 'te' ? 'Switch to English' : 'తెలుగులో చూడండి'}
          </button>
          <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--green)' }}>
            Get Started →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Farmers Registered', value: '12,400+', color: 'var(--green)' },
          { label: 'Diseases Detected',  value: '3,200+',  color: 'var(--red)' },
          { label: 'Jobs Posted',        value: '890+',    color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid-2">
        {FEATURES.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',
              transition: 'transform .15s, box-shadow .15s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <div style={{ background: color + '18', borderRadius: 10, padding: '.75rem', flexShrink: 0 }}>
                <Icon size={28} color={color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '.25rem' }}>{label}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
