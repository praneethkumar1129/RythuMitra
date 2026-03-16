import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Leaf, Bug, Briefcase, LogOut, MapPin, Droplets, Layers } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

export default function Profile() {
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const farmer_id = localStorage.getItem('farmer_id')
  const farmer_name = localStorage.getItem('farmer_name')

  useEffect(() => {
    if (!farmer_id) { navigate('/login'); return }
    api.get(`/api/farmer/${farmer_id}/history`)
      .then(r => setHistory(r.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.clear()
    toast.success('Logged out')
    navigate('/login')
  }

  if (loading) return <div className="spinner" />

  const { farmer, disease_reports, crop_searches, jobs_posted } = history || {}

  return (
    <div>
      {/* Header */}
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
                <span><MapPin size={14} style={{ verticalAlign: 'middle' }} /> {farmer?.location}</span>
                <span><Layers size={14} style={{ verticalAlign: 'middle' }} /> {farmer?.land_size} acres</span>
                <span><Droplets size={14} style={{ verticalAlign: 'middle' }} /> {farmer?.water_source}</span>
              </div>
            </div>
          </div>
          <button className="btn" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }} onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Crops */}
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

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Crop Searches',    value: crop_searches?.length || 0,    icon: '🌾', color: 'var(--green)' },
          { label: 'Disease Reports',  value: disease_reports?.length || 0,  icon: '🐛', color: 'var(--red)' },
          { label: 'Jobs Posted',      value: jobs_posted?.length || 0,      icon: '💼', color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Crop Search History */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
            <Leaf size={18} color="var(--green)" /> Crop Search History
          </h3>
          {crop_searches?.length === 0 && <div className="empty-state card"><p>No crop searches yet</p></div>}
          {crop_searches?.map((c, i) => (
            <div key={i} className="card" style={{ marginBottom: '.75rem', borderLeft: '4px solid var(--green)' }}>
              <div style={{ fontWeight: 600, marginBottom: '.3rem' }}>{c.location} — {c.soil_type} soil</div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>
                💧 {c.water_source} &nbsp;|&nbsp; 📐 {c.land_size} acres
              </div>
              <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap' }}>
                {c.recommended_crops?.map(crop => (
                  <span key={crop} className="badge badge-green">{crop}</span>
                ))}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>
                {new Date(c.searched_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        {/* Disease Report History */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
            <Bug size={18} color="var(--red)" /> Disease Report History
          </h3>
          {disease_reports?.length === 0 && <div className="empty-state card"><p>No disease reports yet</p></div>}
          {disease_reports?.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: '.75rem', borderLeft: `4px solid ${r.severity === 'High' ? 'var(--red)' : 'var(--amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                <span style={{ fontWeight: 700 }}>{r.disease_name}</span>
                <span className={`badge ${r.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>{r.severity}</span>
              </div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>
                🌿 {r.crop_type}
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
                {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          ))}

          {/* Jobs Posted */}
          <h3 style={{ fontWeight: 700, margin: '1rem 0 .75rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
            <Briefcase size={18} color="var(--amber)" /> Jobs Posted
          </h3>
          {jobs_posted?.length === 0 && <div className="empty-state card"><p>No jobs posted yet</p></div>}
          {jobs_posted?.map((j, i) => (
            <div key={i} className="card" style={{ marginBottom: '.75rem', borderLeft: '4px solid var(--amber)' }}>
              <div style={{ fontWeight: 700, marginBottom: '.3rem' }}>{j.crop_type} Work</div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                📍 {j.location} &nbsp;|&nbsp; ₹{j.salary}/day &nbsp;|&nbsp; {j.workers_required} workers
              </div>
              <div style={{ fontSize: '.85rem', marginTop: '.3rem' }}>
                👥 {j.applicants?.length || 0} applicants
                <span className={`badge ${j.status === 'open' ? 'badge-green' : 'badge-red'}`} style={{ marginLeft: '.5rem' }}>
                  {j.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
