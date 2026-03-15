import { useState, useEffect } from 'react'
import { Briefcase, Plus, MapPin, Clock, IndianRupee, Users, X } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const CROPS = ['Rice', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Wheat', 'Soybean', 'Onion', 'Sugarcane']

export default function Jobs() {
  const [tab, setTab] = useState('browse') // browse | post
  const [jobs, setJobs] = useState([])
  const [location, setLocation] = useState('Warangal')
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState(null) // job_id
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
    } catch {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const postJob = async (e) => {
    e.preventDefault()
    if (!postForm.location || !postForm.salary) return toast.error('Fill all required fields')
    try {
      await api.post('/api/create_job', { ...postForm, salary: parseFloat(postForm.salary), workers_required: parseInt(postForm.workers_required) })
      toast.success('Job posted successfully!')
      setTab('browse')
      fetchJobs()
    } catch {
      toast.error('Failed to post job')
    }
  }

  const applyJob = async (job_id) => {
    if (!applyForm.worker_name || !applyForm.phone) return toast.error('Enter your name and phone')
    try {
      await api.post('/api/apply_job', { job_id, ...applyForm })
      toast.success('Application submitted!')
      setApplying(null)
      setApplyForm({ worker_name: '', phone: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Application failed')
    }
  }

  return (
    <div>
      <div className="page-title"><Briefcase size={24} /> Farm Job Marketplace</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${tab === 'browse' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('browse')}>
          Browse Jobs
        </button>
        <button className={`btn ${tab === 'post' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('post')}>
          <Plus size={16} /> Post a Job
        </button>
      </div>

      {tab === 'browse' && (
        <>
          {/* Search */}
          <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem' }}>
            <input value={location} onChange={e => setLocation(e.target.value)}
              placeholder="Enter location to search jobs..." style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={fetchJobs}>Search</button>
          </div>

          {loading && <div className="spinner" />}

          {!loading && jobs.length === 0 && (
            <div className="empty-state card">
              <Briefcase size={48} />
              <p>No jobs found near <strong>{location}</strong>. Try a different location.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map(job => (
              <div key={job.job_id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{job.crop_type} Farm Work</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '.4rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><MapPin size={14} />{job.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><Clock size={14} />{job.working_hours}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><IndianRupee size={14} />₹{job.salary}/day</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}><Users size={14} />{job.workers_required} workers needed</span>
                    </div>
                    {job.description && <p style={{ marginTop: '.4rem', fontSize: '.85rem' }}>{job.description}</p>}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setApplying(job.job_id)}>Apply Now</button>
                </div>

                {/* Inline Apply Form */}
                {applying === job.job_id && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--green-pale)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                      <strong>Apply for this job</strong>
                      <X size={18} style={{ cursor: 'pointer' }} onClick={() => setApplying(null)} />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Your Name</label>
                        <input value={applyForm.worker_name} onChange={e => setApplyForm(f => ({ ...f, worker_name: e.target.value }))} placeholder="Full name" />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input value={applyForm.phone} onChange={e => setApplyForm(f => ({ ...f, phone: e.target.value }))} placeholder="Mobile number" />
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => applyJob(job.job_id)}>Submit Application</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'post' && (
        <form className="card" onSubmit={postJob} style={{ maxWidth: 560 }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Post a Farm Job</h3>

          <div className="grid-2">
            <div className="form-group">
              <label>Crop Type</label>
              <select value={postForm.crop_type} onChange={e => setPostForm(f => ({ ...f, crop_type: e.target.value }))}>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Daily Salary (₹) *</label>
              <input type="number" min="1" value={postForm.salary}
                onChange={e => setPostForm(f => ({ ...f, salary: e.target.value }))} placeholder="e.g. 400" required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Working Hours</label>
              <input value={postForm.working_hours}
                onChange={e => setPostForm(f => ({ ...f, working_hours: e.target.value }))} placeholder="e.g. 6 AM - 3 PM" />
            </div>
            <div className="form-group">
              <label>Workers Required</label>
              <input type="number" min="1" value={postForm.workers_required}
                onChange={e => setPostForm(f => ({ ...f, workers_required: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input value={postForm.location}
              onChange={e => setPostForm(f => ({ ...f, location: e.target.value }))} placeholder="Village / District" required />
          </div>

          <div className="form-group">
            <label>Job Description (optional)</label>
            <textarea rows={3} value={postForm.description}
              onChange={e => setPostForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Any additional details about the work..." />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            📢 Post Job
          </button>
        </form>
      )}
    </div>
  )
}
