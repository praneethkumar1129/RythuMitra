import { useState } from 'react'
import { Leaf, TrendingUp, Droplets, Layers } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const SOIL_TYPES   = ['clay', 'sandy', 'loamy', 'black']
const WATER_SOURCES = ['borewell', 'canal', 'rain']

export default function CropRecommendation() {
  const [form, setForm] = useState({ soil_type: 'loamy', location: '', water_source: 'borewell', land_size: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.location || !form.land_size) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      const { data } = await api.post('/api/crop_recommendation', { ...form, land_size: parseFloat(form.land_size) })
      setResult(data)
    } catch {
      toast.error('Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-title"><Leaf size={24} /> Crop Recommendation</div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Form */}
        <form className="card" onSubmit={submit}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Enter Land Details</h3>

          <div className="form-group">
            <label>Soil Type</label>
            <select value={form.soil_type} onChange={e => set('soil_type', e.target.value)}>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Soil</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Location / District</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              placeholder="e.g. Warangal, Guntur, Nellore" required />
          </div>

          <div className="form-group">
            <label>Water Source</label>
            <select value={form.water_source} onChange={e => set('water_source', e.target.value)}>
              {WATER_SOURCES.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Land Size (acres)</label>
            <input type="number" min="0.1" step="0.1" value={form.land_size}
              onChange={e => set('land_size', e.target.value)} placeholder="e.g. 2.5" required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Analyzing...' : '🌱 Get Recommendations'}
          </button>
        </form>

        {/* Results */}
        <div>
          {loading && <div className="spinner" />}

          {result && (
            <>
              {/* Crop Cards */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '.75rem', color: 'var(--green)' }}>
                  <TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: '.4rem' }} />
                  Recommended Crops
                </h3>
                {result.recommended_crops.map((c, i) => (
                  <div key={c.crop} className="card" style={{ marginBottom: '.75rem', borderLeft: `4px solid var(--green)` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>#{i + 1} {c.crop}</span>
                      <span className="badge badge-green">Best Pick</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>
                      <span>📦 Yield: {c.yield_per_acre}</span>
                      <span>💰 Profit: {c.profit_per_acre}</span>
                    </div>
                    <div style={{ fontSize: '.85rem', color: 'var(--green)', marginTop: '.3rem' }}>
                      Total estimate: {c.total_profit_estimate}
                    </div>
                  </div>
                ))}
              </div>

              {/* Land Division */}
              {result.land_division?.length > 0 && (
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '.75rem' }}>
                    <Layers size={18} style={{ verticalAlign: 'middle', marginRight: '.4rem' }} />
                    Smart Land Division
                  </h3>
                  <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
                    Divide your land to reduce risk and maximize profit:
                  </p>
                  {result.land_division.map(d => (
                    <div key={d.crop} style={{ display: 'flex', justifyContent: 'space-between',
                      padding: '.5rem .75rem', background: 'var(--green-pale)', borderRadius: 8, marginBottom: '.4rem' }}>
                      <span style={{ fontWeight: 600 }}>{d.crop}</span>
                      <span style={{ color: 'var(--green)', fontWeight: 700 }}>{d.acres} acres</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '.75rem' }}>
                  <Droplets size={18} style={{ verticalAlign: 'middle', marginRight: '.4rem' }} />
                  Farming Tips
                </h3>
                {result.tips.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem', fontSize: '.9rem' }}>
                    <span>💡</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="empty-state card">
              <Leaf size={48} />
              <p>Fill in your land details to get AI-powered crop recommendations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
