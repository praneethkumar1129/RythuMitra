import { useEffect, useState } from 'react'
import { BookOpen, ExternalLink, Filter } from 'lucide-react'
import api from '../api'

const CATEGORIES = ['All', 'Income Support', 'Crop Insurance', 'Credit', 'Soil & Fertilizer', 'State Scheme']

const CATEGORY_COLOR = {
  'Income Support':  { bg: '#e8f5e9', color: '#2d7a3a' },
  'Crop Insurance':  { bg: '#eff6ff', color: '#3b82f6' },
  'Credit':          { bg: '#fef3c7', color: '#b45309' },
  'Soil & Fertilizer':{ bg: '#f3e8ff', color: '#7c3aed' },
  'State Scheme':    { bg: '#fce7f3', color: '#be185d' },
}

export default function GovSchemes() {
  const [schemes, setSchemes] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

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
    <div>
      <div className="page-title"><BookOpen size={24} /> Government Schemes & Subsidies</div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        <Filter size={16} color="var(--text-muted)" />
        {CATEGORIES.map(c => (
          <button key={c} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(scheme => {
          const colors = CATEGORY_COLOR[scheme.category] || { bg: 'var(--green-pale)', color: 'var(--green)' }
          const isOpen = expanded === scheme.id
          return (
            <div key={scheme.id} className="card" style={{ cursor: 'pointer' }}
              onClick={() => setExpanded(isOpen ? null : scheme.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{scheme.name}</span>
                    <span className="badge" style={{ background: colors.bg, color: colors.color }}>{scheme.category}</span>
                  </div>
                  <p style={{ fontSize: '.9rem', color: 'var(--text-muted)' }}>{scheme.full_name}</p>
                  <p style={{ fontSize: '.9rem', color: 'var(--green)', fontWeight: 600, marginTop: '.3rem' }}>
                    💰 {scheme.benefit}
                  </p>
                </div>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
                  onClick={e => e.stopPropagation()}>
                  <div className="grid-2" style={{ marginBottom: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '.85rem', display: 'block', marginBottom: '.3rem' }}>✅ Eligibility</strong>
                      <p style={{ fontSize: '.9rem', color: 'var(--text-muted)' }}>{scheme.eligibility}</p>
                    </div>
                    <div>
                      <strong style={{ fontSize: '.85rem', display: 'block', marginBottom: '.3rem' }}>📋 How to Apply</strong>
                      <p style={{ fontSize: '.9rem', color: 'var(--text-muted)' }}>{scheme.how_to_apply}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '.85rem', display: 'block', marginBottom: '.4rem' }}>📄 Documents Required</strong>
                    <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                      {scheme.documents.map(d => (
                        <span key={d} className="badge badge-blue">{d}</span>
                      ))}
                    </div>
                  </div>

                  <a href={scheme.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    <ExternalLink size={14} /> Apply Online
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state card">
          <BookOpen size={48} />
          <p>No schemes found for this category</p>
        </div>
      )}
    </div>
  )
}
