import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Leaf, Bug, Briefcase, LogOut, MapPin, Droplets, Layers, Edit2, Save, X, Phone, Clock, LogIn } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const WATER_SOURCES = ['borewell', 'canal', 'rain']
const TABS = ['profile', 'crops', 'disease', 'jobs', 'logins']

function fmt(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Profile() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('profile')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving]   = useState(false)
  const { logout: authLogout, updateName, farmer_id } = useAuth()
  const navigate = useNavigate()

  const load = () => {
    if (!farmer_id) { navigate('/auth'); return }
    api.get(`/api/farmer/${farmer_id}/history`)
      .then(r => {
        setData(r.data)
        setEditForm({
          name: r.data.farmer.name,
          location: r.data.farmer.location,
          land_size: r.data.farmer.land_size,
          water_source: r.data.farmer.water_source,
          phone: r.data.farmer.phone || '',
          crops: r.data.farmer.crops || [],
        })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const logout = () => {
    authLogout()
    toast.success('Logged out successfully')
    navigate('/auth')
  }

  const saveEdit = async () => {
    setSaving(true)
    try {
      const { data: res } = await api.put(`/api/farmer/${farmer_id}`, {
        ...editForm,
        land_size: parseFloat(editForm.land_size),
      })
      localStorage.setItem('farmer_name', res.farmer.name)
      updateName(res.farmer.name)
      setData(d => ({ ...d, farmer: res.farmer }))
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="spinner" />

  const { farmer, disease_reports = [], crop_searches = [], jobs_posted = [], login_history = [] } = data || {}

  return (
    <div>
      {/* ── Header Card ── */}
      <div className="card" style={{ background: 'linear-gradient(135deg,#2d7a3a,#4caf50)', color: '#fff', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
              👨🌾
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>{farmer?.name}</h2>
              <div style={{ opacity: .85, fontSize: '.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '.25rem' }}>
                <span><MapPin size={13} style={{ verticalAlign: 'middle' }} /> {farmer?.location}</span>
                <span><Layers size={13} style={{ verticalAlign: 'middle' }} /> {farmer?.land_size} acres</span>
                <span><Droplets size={13} style={{ verticalAlign: 'middle' }} /> {farmer?.water_source}</span>
                {farmer?.phone && <span><Phone size={13} style={{ verticalAlign: 'middle' }} /> {farmer.phone}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}
              onClick={() => setEditing(e => !e)}>
              <Edit2 size={14} /> {editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }} onClick={logout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
        {farmer?.crops?.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            {farmer.crops.map(c => (
              <span key={c} style={{ background: 'rgba(255,255,255,.2)', padding: '.2rem .7rem', borderRadius: 999, fontSize: '.8rem' }}>
                🌱 {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Form ── */}
      {editing && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--amber)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>✏️ Edit Profile</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Land Size (acres)</label>
              <input type="number" step="0.1" value={editForm.land_size} onChange={e => setEditForm(f => ({ ...f, land_size: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Water Source</label>
              <select value={editForm.water_source} onChange={e => setEditForm(f => ({ ...f, water_source: e.target.value }))}>
                {WATER_SOURCES.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Crop Searches',   value: crop_searches.length,  icon: '🌾', color: 'var(--green)' },
          { label: 'Disease Reports', value: disease_reports.length, icon: '🐛', color: 'var(--red)' },
          { label: 'Jobs Posted',     value: jobs_posted.length,     icon: '💼', color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {[
          { key: 'crops',   label: '🌾 Crop History' },
          { key: 'disease', label: '🐛 Disease History' },
          { key: 'jobs',    label: '💼 My Jobs' },
          { key: 'logins',  label: '🔐 Login History' },
        ].map(t => (
          <button key={t.key} className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Crop Search History ── */}
      {tab === 'crops' && (
        <div>
          {crop_searches.length === 0 && <div className="empty-state card"><Leaf size={40} /><p>No crop searches yet. Try the Crop Recommendation page!</p></div>}
          {crop_searches.map((c, i) => (
            <div key={i} className="card" style={{ marginBottom: '.75rem', borderLeft: '4px solid var(--green)' }}>
              <div style={{ fontWeight: 700, marginBottom: '.3rem' }}>{c.location} — {c.soil_type} soil</div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>
                💧 {c.water_source} &nbsp;|&nbsp; 📐 {c.land_size} acres
              </div>
              <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginBottom: '.4rem' }}>
                {c.recommended_crops?.map(crop => <span key={crop} className="badge badge-green">{crop}</span>)}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{fmt(c.searched_at)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Disease History ── */}
      {tab === 'disease' && (
        <div>
          {disease_reports.length === 0 && <div className="empty-state card"><Bug size={40} /><p>No disease reports yet.</p></div>}
          {disease_reports.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: '.75rem', borderLeft: `4px solid ${r.severity === 'High' ? 'var(--red)' : 'var(--amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                <span style={{ fontWeight: 700 }}>{r.disease_name}</span>
                <span className={`badge ${r.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>{r.severity}</span>
              </div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>🌿 {r.crop_type}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>{r.treatment}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{fmt(r.date)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Jobs Posted + Applicants ── */}
      {tab === 'jobs' && (
        <div>
          {jobs_posted.length === 0 && <div className="empty-state card"><Briefcase size={40} /><p>No jobs posted yet.</p></div>}
          {jobs_posted.map((j, i) => (
            <div key={i} className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.5rem' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{j.crop_type} Work</span>
                  <span className={`badge ${j.status === 'open' ? 'badge-green' : 'badge-red'}`} style={{ marginLeft: '.5rem' }}>{j.status}</span>
                </div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                  📍 {j.location} &nbsp;|&nbsp; ₹{j.salary}/day &nbsp;|&nbsp; {j.workers_required} workers needed
                </div>
              </div>

              {/* Applicants List */}
              <div style={{ marginTop: '.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '.85rem', marginBottom: '.4rem', color: 'var(--text-muted)' }}>
                  👥 Applicants ({j.applicants?.length || 0})
                </div>
                {(!j.applicants || j.applicants.length === 0) ? (
                  <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No applicants yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                    {j.applicants.map((a, ai) => (
                      <div key={ai} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'var(--green-pale)', borderRadius: 8, padding: '.5rem .75rem', flexWrap: 'wrap', gap: '.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '.9rem' }}>👤 {a.worker_name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '.85rem' }}>
                          <a href={`tel:${a.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '.3rem',
                            color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>
                            <Phone size={14} /> {a.phone}
                          </a>
                          <span style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>{fmt(a.applied_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>Posted: {fmt(j.created_at)}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Login History ── */}
      {tab === 'logins' && (
        <div>
          {login_history.length === 0 && <div className="empty-state card"><LogIn size={40} /><p>No login history yet.</p></div>}
          {login_history.map((l, i) => (
            <div key={i} className="card" style={{ marginBottom: '.6rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem',
              borderLeft: `4px solid ${i === 0 ? 'var(--green)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: '1.4rem' }}>🔐</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.9rem' }}>
                    {i === 0 ? <span className="badge badge-green" style={{ marginRight: '.4rem' }}>Latest</span> : null}
                    Logged in
                  </div>
                  <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} style={{ verticalAlign: 'middle' }} /> {l.location} &nbsp;|&nbsp; 📱 {l.device || 'web'}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <Clock size={14} /> {fmt(l.logged_in_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
