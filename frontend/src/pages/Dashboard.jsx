import { useEffect } from 'react'
import { useLang } from '../context/LangContext'
import { Sprout, Leaf, Bug, Briefcase, BookOpen, Cloud, BarChart2, Volume2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { speak } from '../components/VoiceAssistant'

export default function Dashboard() {
  const { lang, t } = useLang()

  const FEATURES = [
    { to: '/crops',   icon: Leaf,      label: t('dashboard.features.crop_rec'), desc: t('dashboard.feature_desc.crop_rec'),  color: '#2d7a3a', bg: '#e8f5e9' },
    { to: '/disease', icon: Bug,       label: t('dashboard.features.disease_detection'), desc: t('dashboard.feature_desc.disease_detection'), color: '#ef4444', bg: '#fee2e2' },
    { to: '/demand',  icon: BarChart2, label: t('dashboard.features.market_demand'), desc: t('dashboard.feature_desc.market_demand'), color: '#3b82f6', bg: '#eff6ff' },
    { to: '/jobs',    icon: Briefcase, label: t('dashboard.features.farm_jobs'), desc: t('dashboard.feature_desc.farm_jobs'), color: '#f59e0b', bg: '#fffbeb' },
    { to: '/weather', icon: Cloud,     label: t('dashboard.features.weather_alerts'), desc: t('dashboard.feature_desc.weather_alerts'), color: '#06b6d4', bg: '#ecfeff' },
    { to: '/schemes', icon: BookOpen,  label: t('dashboard.features.govt_schemes'), desc: t('dashboard.feature_desc.govt_schemes'), color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  const STATS = [
    { label: t('dashboard.stats.farmers_registered'), value: '12,400+', color: 'var(--green)' },
    { label: t('dashboard.stats.diseases_detected'),  value: '3,200+',  color: 'var(--red)' },
    { label: t('dashboard.stats.jobs_posted'),        value: '890+',    color: 'var(--amber)' },
  ]

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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-.5px', lineHeight: 1 }}>{t('app.title')}</h1>
          <p style={{ opacity: .75, fontSize: '.95rem', marginTop: '.2rem' }}>{t('app.tagline')}</p>
        </div>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem', opacity: .88, maxWidth: 560 }}>
{t('common.welcome')}
        </p>

        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.25)' }}
onClick={() => speak(t('common.welcome'), lang)}>
            <Volume2 size={16} /> {t('common.speak')}
          </button>
          {/* Global toggle in navbar, remove local */}
          <Link to="/auth?tab=register" className="btn" style={{ background: '#fff', color: 'var(--green)', fontWeight: 700 }}>
            {t('dashboard.get_started')} <ArrowRight size={15} />
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
          <Sprout size={18} color="var(--green)" /> {t('common.ourServices')}
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
