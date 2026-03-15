import { useState, useRef } from 'react'
import { Bug, Upload, X, ExternalLink } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const CROPS = ['Rice', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Wheat', 'Soybean', 'Onion', 'Sugarcane']

const SEVERITY_COLOR = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-green' }

export default function DiseaseDetection() {
  const [cropType, setCropType] = useState('Rice')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please upload an image file')
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const submit = async () => {
    if (!image) return toast.error('Please upload a plant image')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('crop_type', cropType)
      fd.append('farmer_id', localStorage.getItem('farmer_id') || '')
      fd.append('image', image)
      const { data } = await api.post('/api/detect_disease', fd)
      setResult(data)
    } catch {
      toast.error('Detection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => { setImage(null); setPreview(null); setResult(null) }

  return (
    <div>
      <div className="page-title"><Bug size={24} /> Plant Disease Detection</div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Upload Panel */}
        <div className="card">
          <div className="form-group">
            <label>Select Crop Type</label>
            <select value={cropType} onChange={e => setCropType(e.target.value)}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !preview && fileRef.current.click()}
            style={{
              border: '2px dashed var(--border)', borderRadius: 12, padding: '2rem',
              textAlign: 'center', cursor: preview ? 'default' : 'pointer',
              background: preview ? 'transparent' : 'var(--bg)', position: 'relative',
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => !preview && (e.currentTarget.style.borderColor = 'var(--green)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />

            {preview ? (
              <>
                <img src={preview} alt="plant" style={{ maxHeight: 220, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }} />
                <button className="btn btn-danger btn-sm" onClick={clear}
                  style={{ position: 'absolute', top: 8, right: 8 }}>
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <Upload size={40} color="var(--text-muted)" style={{ marginBottom: '.5rem' }} />
                <p style={{ fontWeight: 600 }}>Drop plant image here or click to upload</p>
                <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>JPEG, PNG, WEBP — max 5MB</p>
              </>
            )}
          </div>

          <button className="btn btn-primary" disabled={!image || loading}
            onClick={submit} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            {loading ? 'Analyzing...' : '🔍 Detect Disease'}
          </button>
        </div>

        {/* Result Panel */}
        <div>
          {loading && <div className="spinner" />}

          {result && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--red)' }}>{result.disease_name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{result.crop_type} • Confidence: {result.confidence}</p>
                </div>
                <span className={`badge ${SEVERITY_COLOR[result.severity] || 'badge-amber'}`}>
                  {result.severity} Severity
                </span>
              </div>

              <Section title="🔬 Symptoms" content={result.symptoms} />
              <Section title="💊 Treatment" content={result.treatment} />
              <Section title="🌿 Organic Remedy" content={result.organic_remedy} />

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '.85rem', display: 'block', marginBottom: '.4rem' }}>🧪 Recommended Pesticides</strong>
                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                  {result.pesticides.map(p => <span key={p} className="badge badge-red">{p}</span>)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                <a href={result.video_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <ExternalLink size={14} /> Watch Tutorial
                </a>
                {result.buy_links?.map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noreferrer" className="btn btn-amber btn-sm">
                    🛒 Buy {result.pesticides[i]}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="empty-state card">
              <Bug size={48} />
              <p>Upload a photo of your plant to detect diseases instantly</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, content }) {
  return (
    <div style={{ marginBottom: '.85rem' }}>
      <strong style={{ fontSize: '.85rem', display: 'block', marginBottom: '.25rem' }}>{title}</strong>
      <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{content}</p>
    </div>
  )
}
