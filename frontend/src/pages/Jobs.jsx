import { useState, useEffect } from 'react'
import { Briefcase, Plus, MapPin, Clock, IndianRupee, Users, X, Search } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const CROPS = ['Rice', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Wheat', 'Soybean', 'Onion', 'Sugarcane']

export default function Jobs() {
  const [tab, setTab]         = useState('browse')
  const [jobs, setJobs]       = useState([])
  const [location, setLocation] = useState('Warangal')
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(null)
  const [applyForm, setApplyForm] = useState({ worker_name: '', phone: '' })
  const [postForm, setPostForm] = useState({
    crop_type: 'Rice', salary: '', working_hours: '6 AM - 3 PM',
    location: '', workers_required: 1, description: '',
    farmer_id: localStorage.getItem('farmer_id') || ''
  })

  const fetchJobs = async () => {
    if (!location) return
    setLoading(true)
    try {
      const { data } = await api.get('/api/jobs_nearby', { params: { location } })
      setJobs(data.jobs)
    } catch { toast.error('Failed to load jobs') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs() }, [])

  const postJob = async (e) => {
    e.preventDefault()
    if (!postForm.location || !postForm.salary) return toast.error('Fill all required fields')
    try {
      await api.post('/api/create_job', { ...postForm, salary: parseFloat(postForm.salary), workers_required: parseInt(postForm.workers_required) })
      toast.success('Job posted!')
      setTab('browse'); fetchJobs()
    } catch { toast.error('Failed to post job') }
  }

  const applyJob = async (job_id) => {
    if (!applyForm.worker_name || !applyForm.phone) return toast.error('Enter your name and phone')
    try {
      await api.post('/api/apply_job', { job_id, ...applyForm })
      toast.success('Application submitted!')
      setApplying(null); setApplyForm({ worker_name: '', phone: '' })
    } catch (err) { toast.error(err.response?.data?.detail || 'Application failed') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{ background: 'var(--amber-pale)', borderRadius: 10, padding: '8px', display: 'flex' }}>
            <Briefcase size={22} color="var(--amber)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.3px' }}>Farm Job Marketplace</h1>
            <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>Find or post agricultural work near you</p>
          </div>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
          {[{ key: 'browse', label: 'Browse Jobs' }, { key: 'post', label: 'Post a Job', icon: <Plus size={14} /> }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.4rem .9rem',
                borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '.83rem', fontWeight: 600, transition: 'all .15s',
                background: tab === t.key ? 'var(--green)' : 'transparent',
                color: tab === t.key ? '#fff' : 'var(--text-muted)',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'browse' && (
        <>
          {/* Search bar */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input value={location} onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                  placeholder="Search by location..." style={{ paddingLeft: '2.4rem' }} />
              </div>
              <button className="btn btn-primary" onClick={fetchJobs} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {loading && <div className="spinner" />}

          {!loading && jobs.length === 0 && (
            <div className="empty-state card">
              <Briefcase size={44} />
              <p>No jobs found near <strong>{location}</strong>. Try a different location.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            {jobs.map(job => (
              <div key={job.job_id} className="card" style={{ borderLeft: '4px solid var(--amber)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>{job.crop_type} Farm Work</h3>
                    <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                      {[
                        { icon: <MapPin size={13} />, text: job.location },
                        { icon: <Clock size={13} />, text: job.working_hours },
                        { icon: <IndianRupee size={13} />, text: `₹${job.salary}/day` },
                        { icon: <Users size={13} />, text: `${job.workers_required} workers` },
                      ].map((item, i) => (
                        <span key={i} className="info-row">{item.icon} {item.text}</span>
                      ))}
                    </div>
                    {job.description && <p style={{ marginTop: '.5rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>{job.description}</p>}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setApplying(applying === job.job_id ? null : job.job_id)}>
                    {applying === job.job_id ? 'Cancel' : 'Apply Now'}
                  </button>
                </div>

                {applying === job.job_id && (
                  <div className="fade-up" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--green-pale)', borderRadius: 10, border: '1px solid #86efac' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '.9rem' }}>Apply for this job</span>
                      <button onClick={() => setApplying(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
                    </div>
                    <div className="grid-2">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Your Name</label>
                        <input value={applyForm.worker_name} onChange={e => setApplyForm(f => ({ ...f, worker_name: e.target.value }))} placeholder="Full name" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Phone Number</label>
                        <input value={applyForm.phone} onChange={e => setApplyForm(f => ({ ...f, phone: e.target.value }))} placeholder="Mobile number" />
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '.75rem' }} onClick={() => applyJob(job.job_id)}>
                      Submit Application
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'post' && (
        <form className="card" onSubmit={postJob} style={{ maxWidth: 580 }}>
          <div className="section-title"><Plus size={16} color="var(--green)" /> Post a Farm Job</div>
          <div className="grid-2">
            <div className="form-group">
              <label>Crop Type</label>
              <select value={postForm.crop_type} onChange={e => setPostForm(f => ({ ...f, crop_type: e.target.value }))}>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Daily Salary (₹)</label>
              <input type="number" min="1" value={postForm.salary} onChange={e => setPostForm(f => ({ ...f, salary: e.target.value }))} placeholder="e.g. 400" required />
            </div>
            <div className="form-group">
              <label>Working Hours</label>
              <input value={postForm.working_hours} onChange={e => setPostForm(f => ({ ...f, working_hours: e.target.value }))} placeholder="e.g. 6 AM - 3 PM" />
            </div>
            <div className="form-group">
              <label>Workers Required</label>
              <input type="number" min="1" value={postForm.workers_required} onChange={e => setPostForm(f => ({ ...f, workers_required: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input value={postForm.location} onChange={e => setPostForm(f => ({ ...f, location: e.target.value }))} placeholder="Village / District" required />
          </div>
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea rows={3} value={postForm.description} onChange={e => setPostForm(f => ({ ...f, description: e.target.value }))} placeholder="Any additional details..." />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Briefcase size={16} /> Post Job
          </button>
        </form>
      )}
    </div>
  )
}
