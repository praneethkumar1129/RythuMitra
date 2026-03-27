import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import api from '../api'

const CATEGORIES = ['All', 'Income Support', 'Crop Insurance', 'Credit', 'Soil & Fertilizer', 'State Scheme']
const CATEGORY_STYLE = {
  'Income Support':    { bg: '#e8f5e9', color: '#2d7a3a' },
  'Crop Insurance':    { bg: '#eff6ff', color: '#3b82f6' },
  'Credit':            { bg: '#fef3c7', color: '#b45309' },
  'Soil & Fertilizer': { bg: '#f3e8ff', color: '#7c3aed' },
  'State Scheme':      { bg: '#fce7f3', color: '#be185d' },
}

const TE_CATEGORIES = {
  'All': 'అన్నీ', 'Income Support': 'ఆదాయ మద్దతు', 'Crop Insurance': 'పంట బీమా',
  'Credit': 'రుణం', 'Soil & Fertilizer': 'నేల & ఎరువు', 'State Scheme': 'రాష్ట్ర పథకం'
}

export default function GovSchemes() {
  const { t, lang } = useLang()
  const [schemes, setSchemes]   = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/api/gov_schemes')
      .then(r => { setSchemes(r.data.schemes); setFiltered(r.data.schemes) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(category === 'All' ? schemes : schemes.filter(s => s.category === category))
  }, [category, schemes])

  if (loading) return <div className="spinner" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <div style={{ background: '#f3e8ff', borderRadius: 10, padding: '8px', display: 'flex' }}>
          <BookOpen size={22} color="#7c3aed" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.3px' }}>
            {lang === 'te' ? 'ప్రభుత్వ పథకాలు' : 'Government Schemes'}
          </h1>
          <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {lang === 'te' ? 'ఈరోజు దరఖాస్తు చేసుకోగల సబ్సిడీలు & పథకాలు' : 'Subsidies & schemes you can apply for today'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{
              padding: '.3rem .85rem', borderRadius: 7, border: '1.5px solid', cursor: 'pointer',
              fontSize: '.8rem', fontWeight: 600, fontFamily: 'inherit', transition: 'all .15s',
              background: category === c ? 'var(--green)' : 'transparent',
              color: category === c ? '#fff' : 'var(--green)',
              borderColor: 'var(--green)',
            }}>
            {lang === 'te' ? TE_CATEGORIES[c] : c}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '-.75rem' }}>
        {lang === 'te' ? `${filtered.length} పథకాలు చూపిస్తున్నారు` : `Showing ${filtered.length} scheme${filtered.length !== 1 ? 's' : ''}`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
        {filtered.map(scheme => {
          const style = CATEGORY_STYLE[scheme.category] || { bg: 'var(--green-pale)', color: 'var(--green)' }
          const isOpen = expanded === scheme.id
          return (
            <div key={scheme.id} className="card" style={{ cursor: 'pointer' }}
              onClick={() => setExpanded(isOpen ? null : scheme.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{scheme.name}</span>
                    <span className="badge" style={{ background: style.bg, color: style.color }}>
                      {lang === 'te' ? TE_CATEGORIES[scheme.category] || scheme.category : scheme.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>{scheme.full_name}</p>
                  <p style={{ fontSize: '.88rem', color: 'var(--green)', fontWeight: 600 }}>💰 {scheme.benefit}</p>
                </div>
                <div style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {isOpen && (
                <div className="fade-up" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}
                  onClick={e => e.stopPropagation()}>
                  <div className="grid-2" style={{ marginBottom: '1rem' }}>
                    <div style={{ padding: '.75rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.35rem' }}>
                        {lang === 'te' ? 'అర్హత' : 'Eligibility'}
                      </p>
                      <p style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{scheme.eligibility}</p>
                    </div>
                    <div style={{ padding: '.75rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.35rem' }}>
                        {lang === 'te' ? 'దరఖాస్తు ఎలా చేయాలి' : 'How to Apply'}
                      </p>
                      <p style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{scheme.how_to_apply}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.5rem' }}>
                      {lang === 'te' ? 'అవసరమైన పత్రాలు' : 'Documents Required'}
                    </p>
                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      {scheme.documents.map(d => <span key={d} className="badge badge-blue">{d}</span>)}
                    </div>
                  </div>

                  <a href={scheme.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    <ExternalLink size={13} /> {lang === 'te' ? 'ఆన్లైన్లో దరఖాస్తు చేయండి' : 'Apply Online'}
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state card">
          <BookOpen size={44} />
          <p>{lang === 'te' ? 'ఈ వర్గానికి పథకాలు లేవు' : 'No schemes found for this category'}</p>
        </div>
      )}
    </div>
  )
}
