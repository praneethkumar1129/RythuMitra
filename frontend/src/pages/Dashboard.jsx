import { useEffect, useState } from 'react'
import { Sprout, Leaf, Bug, Briefcase, BookOpen, Cloud, BarChart2, Volume2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { speak } from '../components/VoiceAssistant'

const WELCOME_TE = 'రైతు సేవకు స్వాగతం. పంట సూచనలు, మొక్కల వ్యాధి గుర్తింపు, వ్యవసాయ ఉద్యోగాలు మరియు ప్రభుత్వ పథకాలలో నేను మీకు సహాయం చేస్తాను.'
const WELCOME_EN = 'Welcome to Rythu Seva. I will help you with crop suggestions, plant disease detection, farming jobs and government schemes.'

const FEATURES = [
  { to: '/crops',   icon: Leaf,      label: 'Crop Recommendation', desc: 'AI-powered crop suggestions based on your soil & water',  color: '#2d7a3a', bg: '#e8f5e9' },
  { to: '/disease', icon: Bug,       label: 'Disease Detection',   desc: 'Upload plant photo to detect disease instantly',           color: '#ef4444', bg: '#fee2e2' },
  { to: '/demand',  icon: BarChart2, label: 'Market Demand',       desc: 'See which crops have high demand & best prices',           color: '#3b82f6', bg: '#eff6ff' },
  { to: '/jobs',    icon: Briefcase, label: 'Farm Jobs',           desc: 'Post or find agricultural work near you',                 color: '#f59e0b', bg: '#fffbeb' },
  { to: '/weather', icon: Cloud,     label: 'Weather Alerts',      desc: 'Real-time weather & disaster alerts for your area',       color: '#06b6d4', bg: '#ecfeff' },
  { to: '/schemes', icon: BookOpen,  label: 'Govt Schemes',        desc: 'Subsidies & schemes you can apply for today',             color: '#8b5cf6', bg: '#f5f3ff' },
]

const STATS = [
  { label: 'Farmers Registered', value: '12,400+', color: 'var(--green)' },
  { label: 'Diseases Detected',  value: '3,200+',  color: 'var(--red)' },
  { label: 'Jobs Posted',        value: '890+',    color: 'var(--amber)' },
]

export default function Dashboard() {
  const [lang, setLang] = useState('te')

  useEffect(() => {
    const t = setTimeout(() => speak(WELCOME_TE, 'te-IN'), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e5c2a 0%, #2d7a3a 50%, #3a9647 100%)',
        borderRadius: 16, padding: '2.5rem 2rem', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: 60, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 14, padding: '12px', display: 'flex' }}>
            <Sprout size={36} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-.5px', lineHeight: 1 }}>Rythu Seva</h1>
            <p style={{ opacity: .75, fontSize: '.95rem', marginTop: '.2rem' }}>రైతు సేవ — Your AI Farming Assistant</p>
          </div>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem', opacity: .88, maxWidth: 560 }}>
          {lang === 'te' ? WELCOME_TE : WELCOME_EN}
        </p>

        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}
            onClick={() => speak(lang === 'te' ? WELCOME_TE : WELCOME_EN, lang === 'te' ? 'te-IN' : 'en-IN')}>
            <Volume2 size={16} /> Listen
          </button>
          <button className="btn" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}
            onClick={() => setLang(l => l === 'te' ? 'en' : 'te')}>
            {lang === 'te' ? 'Switch to English' : 'తెలుగులో చూడండి'}
          </button>
          <Link to="/auth?tab=register" className="btn" style={{ background: '#fff', color: 'var(--green)', fontWeight: 700 }}>
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3">
        {STATS.map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <div className="section-title" style={{ marginBottom: '1.1rem' }}>
          <Sprout size={18} color="var(--green)" /> Our Services
        </div>
        <div className="grid-2">
          {FEATURES.map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: bg, borderRadius: 10, padding: '10px', flexShrink: 0 }}>
                  <Icon size={24} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.2rem', color: 'var(--text)' }}>{label}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
