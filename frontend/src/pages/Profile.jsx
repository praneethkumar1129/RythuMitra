import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Leaf, Bug, Briefcase, LogOut, MapPin, Droplets, Layers, Edit2, Save, Phone, Clock, LogIn } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const WATER_SOURCES = ['borewell', 'canal', 'rain']

function fmt(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Profile() {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('crops')
  const [editing, setEditing]   = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving]     = useState(false)
  const { logout: authLogout, updateName, farmer_id } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const load = () => {
    if (!farmer_id) { navigate('/auth'); return }
    api.get(`/api/farmer/${farmer_id}/history`)
      .then(r => {
        setData(r.data)
        const f = r.data.farmer
        setEditForm({ name: f.name, location: f.location, land_size: f.land_size, water_source: f.water_source, phone: f.phone || '', crops: f.crops || [] })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const logout = () => { authLogout(); toast.success(t('profile.logout')); }

  const saveEdit = async () => {
    setSaving(true)
    try {
      const { data: res } = await api.put(`/api/farmer/${farmer_id}`, { ...editForm, land_size: parseFloat(editForm.land_size) })
      localStorage.setItem('farmer_name', res.farmer.name)
      updateName(res.farmer.name)
      setData(d => ({ ...d, farmer: res.farmer }))
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="spinner" />

  const { farmer, disease_reports = [], crop_searches = [], jobs_posted = [], login_history = [] } = data || {}

  const TABS = [
    { key: 'crops',   label: t('profile.crop_history'),    icon: <Leaf size={14} />,     count: crop_searches.length },
    { key: 'disease', label: t('profile.disease_history'),  icon: <Bug size={14} />,      count: disease_reports.length },
    { key: 'jobs',    label: t('profile.my_jobs'),          icon: <Briefcase size={14} />, count: jobs_posted.length },
    { key: 'logins',  label: t('profile.login_history'),    icon: <LogIn size={14} />,    count: login_history.length },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e5c2a, #3a9647)', borderRadius: 16, padding: '2rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: '2px solid rgba(255,255,255,.3)', fontWeight: 800, fontSize: '1.5rem' }}>
              {farmer?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.3px' }}>{farmer?.name}</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '.35rem', fontSize: '.83rem', opacity: .85 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><MapPin size={13} />{farmer?.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><Layers size={13} />{farmer?.land_size} acres</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><Droplets size={13} />{farmer?.water_source}</span>
                {farmer?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><Phone size={13} />{farmer.phone}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button onClick={() => setEditing(e => !e)}
              style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.4rem .85rem', borderRadius: 8, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.12)', color: '#fff', cursor: 'pointer', fontSize: '.83rem', fontWeight: 600, fontFamily: 'inherit' }}>
              <Edit2 size={14} /> {editing ? t('profile.cancel') : t('profile.edit')}
            </button>
            <button onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.4rem .85rem', borderRadius: 8, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.12)', color: '#fff', cursor: 'pointer', fontSize: '.83rem', fontWeight: 600, fontFamily: 'inherit' }}>
              <LogOut size={14} /> {t('profile.logout')}
            </button>
          </div>
        </div>
        {farmer?.crops?.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            {farmer.crops.map(c => (
              <span key={c} style={{ background: 'rgba(255,255,255,.15)', padding: '.2rem .65rem', borderRadius: 999, fontSize: '.78rem', border: '1px solid rgba(255,255,255,.2)' }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card fade-up" style={{ borderLeft: '4px solid var(--amber)' }}>
          <div className="section-title"><Edit2 size={16} color="var(--amber)" /> {t('profile.edit_profile')}</div>
          <div className="grid-2">
            <div className="form-group"><label>{t('profile.full_name')}</label><input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>{t('profile.phone')}</label><input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="form-group"><label>{t('profile.location')}</label><input value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div className="form-group"><label>{t('profile.land_size')}</label><input type="number" step="0.1" value={editForm.land_size} onChange={e => setEditForm(f => ({ ...f, land_size: e.target.value }))} /></div>
            <div className="form-group">
              <label>{t('profile.water_source')}</label>
              <select value={editForm.water_source} onChange={e => setEditForm(f => ({ ...f, water_source: e.target.value }))}>
                {WATER_SOURCES.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
            <Save size={15} /> {saving ? t('profile.saving') : t('profile.save_changes')}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid-3">
        {[
          { label: t('profile.crop_searches'),   value: crop_searches.length,  color: 'var(--green)', icon: '🌾' },
          { label: t('profile.disease_reports'), value: disease_reports.length, color: 'var(--red)',   icon: '🐛' },
          { label: t('profile.jobs_posted'),     value: jobs_posted.length,     color: 'var(--amber)', icon: '💼' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '1.25rem 1rem' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '.25rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color, fontSize: '1.7rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', borderBottom: '2px solid var(--border)', paddingBottom: '.75rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.42rem .9rem',
              borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '.83rem', fontWeight: 600, transition: 'all .15s',
              background: tab === t.key ? 'var(--green)' : 'var(--bg)',
              color: tab === t.key ? '#fff' : 'var(--text-muted)',
            }}>
            {t.icon} {t.label}
            <span style={{ background: tab === t.key ? 'rgba(255,255,255,.25)' : 'var(--border)', color: tab === t.key ? '#fff' : 'var(--text-muted)', borderRadius: 999, padding: '0 .45rem', fontSize: '.72rem', fontWeight: 700 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Crop History */}
      {tab === 'crops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {crop_searches.length === 0 && <div className="empty-state card"><Leaf size={40} /><p>{t('profile.no_crop_searches')}</p></div>}
          {crop_searches.map((c, i) => (
            <div key={i} className="card" style={{ borderLeft: '4px solid var(--green)' }}>
              <div style={{ fontWeight: 700, marginBottom: '.3rem' }}>{c.location} — {c.soil_type} soil</div>
              <div className="info-row" style={{ marginBottom: '.5rem' }}>
                <Droplets size={13} /> {c.water_source} &nbsp;·&nbsp; <Layers size={13} /> {c.land_size} acres
              </div>
              <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginBottom: '.4rem' }}>
                {c.recommended_crops?.map(crop => <span key={crop} className="badge badge-green">{crop}</span>)}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{fmt(c.searched_at)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Disease History */}
      {tab === 'disease' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {disease_reports.length === 0 && <div className="empty-state card"><Bug size={40} /><p>{t('profile.no_disease_reports')}</p></div>}
          {disease_reports.map((r, i) => (
            <div key={i} className="card" style={{ borderLeft: `4px solid ${r.severity === 'High' ? 'var(--red)' : 'var(--amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                <span style={{ fontWeight: 700 }}>{r.disease_name}</span>
                <span className={`badge ${r.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>{r.severity}</span>
              </div>
              <div className="info-row" style={{ marginBottom: '.3rem' }}>🌿 {r.crop_type}</div>
              <div style={{ fontSize: '.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{r.treatment}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>{fmt(r.date)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Jobs */}
      {tab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs_posted.length === 0 && <div className="empty-state card"><Briefcase size={40} /><p>{t('profile.no_jobs')}</p></div>}
          {jobs_posted.map((j, i) => (
            <div key={i} className="card" style={{ borderLeft: '4px solid var(--amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{j.crop_type} Work</span>
                  <span className={`badge ${j.status === 'open' ? 'badge-green' : 'badge-red'}`}>{j.status}</span>
                </div>
                <div className="info-row">
                  <MapPin size={13} /> {j.location} &nbsp;·&nbsp; ₹{j.salary}/day &nbsp;·&nbsp; {j.workers_required} workers
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '.75rem' }}>
                <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  {t('profile.applicants')} ({j.applicants?.length || 0})
                </div>
                {(!j.applicants || j.applicants.length === 0) ? (
                  <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{t('profile.no_applicants')}</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                    {j.applicants.map((a, ai) => (
                      <div key={ai} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--green-pale)', borderRadius: 8, padding: '.5rem .75rem', flexWrap: 'wrap', gap: '.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '.88rem' }}>{a.worker_name}</span>
                        <a href={`tel:${a.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: 'var(--green)', fontWeight: 600, textDecoration: 'none', fontSize: '.85rem' }}>
                          <Phone size={13} /> {a.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>{t('profile.posted')}: {fmt(j.created_at)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Login History */}
      {tab === 'logins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
          {login_history.length === 0 && <div className="empty-state card"><LogIn size={40} /><p>{t('profile.no_logins')}</p></div>}
          {login_history.map((l, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', borderLeft: `4px solid ${i === 0 ? 'var(--green)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: i === 0 ? 'var(--green-pale)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color={i === 0 ? 'var(--green)' : 'var(--text-muted)'} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.88rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    {i === 0 && <span className="badge badge-green">{t('profile.latest')}</span>}
                    {t('profile.signed_in')}
                  </div>
                  <div className="info-row" style={{ marginTop: '.15rem' }}>
                    <MapPin size={12} /> {l.location || 'Unknown'} &nbsp;·&nbsp; {l.device || 'Web'}
                  </div>
                </div>
              </div>
              <div className="info-row"><Clock size={13} /> {fmt(l.logged_in_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
