import { useState } from 'react'
import { useLang } from '../context/LangContext'
import { Leaf, TrendingUp, Droplets, Layers, ArrowRight } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const SOIL_TYPES    = ['clay', 'sandy', 'loamy', 'black']
const WATER_SOURCES = ['borewell', 'canal', 'rain']

export default function CropRecommendation() {
  const { t, lang } = useLang()
  const [form, setForm]     = useState({ soil_type: 'loamy', location: '', water_source: 'borewell', land_size: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.location || !form.land_size) return toast.error(t('croprec.fill_all'))
    setLoading(true)
    try {
      const { data } = await api.post('/api/crop_recommendation', { ...form, land_size: parseFloat(form.land_size) })
      setResult(data)
    } catch {
      toast.error(t('common.error'))
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <div style={{ background: 'var(--green-pale)', borderRadius: 10, padding: '8px', display: 'flex' }}>
          <Leaf size={22} color="var(--green)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.3px' }}>{t('croprec.title')}</h1>
          <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{t('croprec.subtitle')}</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <form className="card" onSubmit={submit}>
          <div className="section-title">{t('croprec.land_details')}</div>

          <div className="form-group">
            <label>{t('croprec.soil_type')}</label>
            <select value={form.soil_type} onChange={e => set('soil_type', e.target.value)}>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} {t('croprec.soil_suffix')}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>{t('croprec.location_district')}</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              placeholder={t('croprec.location_placeholder')} required />
          </div>

          <div className="form-group">
            <label>{t('croprec.water_source')}</label>
            <select value={form.water_source} onChange={e => set('water_source', e.target.value)}>
              {WATER_SOURCES.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>{t('croprec.land_size_acres')}</label>
            <input type="number" min="0.1" step="0.1" value={form.land_size}
              onChange={e => set('land_size', e.target.value)} placeholder="e.g. 2.5" required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? t('common.analyzing') : <><Leaf size={16} /> {t('croprec.get_recommendations')}</>}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading && <div className="spinner" />}

          {result && (
            <>
              <div className="card">
                <div className="section-title"><TrendingUp size={16} color="var(--green)" /> {t('croprec.recommended_crops')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {result.recommended_crops.map((c, i) => (
                    <div key={c.crop} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.75rem', background: i === 0 ? 'var(--green-pale)' : 'var(--bg)', borderRadius: 10, border: i === 0 ? '1.5px solid #86efac' : '1px solid var(--border)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: i === 0 ? 'var(--green)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#fff' : 'var(--text-muted)', fontWeight: 800, fontSize: '.9rem', flexShrink: 0 }}>
                        #{i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{c.crop}</div>
                        <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>
                          {t('croprec.yield_per_acre')}: {c.yield_per_acre} &nbsp;·&nbsp; {t('croprec.profit_per_acre')}: {c.profit_per_acre}
                        </div>
                      </div>
                      <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--green)', textAlign: 'right' }}>
                        {c.total_profit_estimate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.land_division?.length > 0 && (
                <div className="card">
                  <div className="section-title"><Layers size={16} color="var(--blue)" /> {t('croprec.land_division')}</div>
                  <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
                    {t('croprec.land_division_desc')}
                  </p>
                  {result.land_division.map(d => (
                    <div key={d.crop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem .75rem', background: 'var(--bg)', borderRadius: 8, marginBottom: '.4rem', border: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 600, fontSize: '.88rem' }}>{d.crop}</span>
                      <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '.88rem' }}>{d.acres} {t('croprec.acres')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="card">
                <div className="section-title"><Droplets size={16} color="var(--blue)" /> {t('croprec.farming_tips')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  {result.tips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: '.6rem', padding: '.55rem .75rem', background: 'var(--bg)', borderRadius: 8, fontSize: '.85rem', alignItems: 'flex-start' }}>
                      <ArrowRight size={14} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="empty-state card">
              <Leaf size={44} />
              <p>{t('croprec.fill_details')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
