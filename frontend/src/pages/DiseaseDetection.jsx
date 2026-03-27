import { useState, useRef } from 'react'
import { useLang } from '../context/LangContext'
import { Bug, Upload, X, Play, ShoppingCart } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

const CROPS = ['Rice', 'Cotton', 'Tomato', 'Chilli', 'Maize', 'Groundnut', 'Wheat', 'Soybean', 'Onion', 'Sugarcane']
const SEVERITY_COLOR  = { High: 'badge-red', Medium: 'badge-amber', Low: 'badge-green' }
const SEVERITY_BORDER = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--green)' }

export default function DiseaseDetection() {
  const { t, lang } = useLang()
  const [cropType, setCropType] = useState('Rice')
  const [image, setImage]       = useState(null)
  const [preview, setPreview]   = useState(null)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error(t('disease.upload_image_file'))
    if (file.size > 5 * 1024 * 1024) return toast.error(t('disease.image_size'))
    setImage(file); setPreview(URL.createObjectURL(file)); setResult(null)
  }

  const submit = async () => {
    if (!image) return toast.error(t('disease.upload_image'))
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('crop_type', cropType)
      fd.append('farmer_id', localStorage.getItem('farmer_id') || '')
      fd.append('image', image)
      const { data } = await api.post('/api/detect_disease', fd)
      setResult(data)
    } catch { toast.error(t('common.error')) }
    finally { setLoading(false) }
  }

  const clear = () => { setImage(null); setPreview(null); setResult(null) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <div style={{ background: '#fee2e2', borderRadius: 10, padding: '8px', display: 'flex' }}>
          <Bug size={22} color="var(--red)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.3px' }}>
            {t('disease.title')}
          </h1>
          <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {t('disease.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{t('disease.crop_type')}</label>
            <select value={cropType} onChange={e => setCropType(e.target.value)}>
              {CROPS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
            onDragOver={e => e.preventDefault()}
            onClick={() => !preview && fileRef.current.click()}
            style={{
              border: `2px dashed ${preview ? 'var(--green)' : 'var(--border)'}`,
              borderRadius: 12, padding: preview ? '1rem' : '2.5rem',
              textAlign: 'center', cursor: preview ? 'default' : 'pointer',
              background: preview ? 'var(--green-pale)' : 'var(--bg)',
              position: 'relative', transition: 'all .2s',
            }}
          >
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />
            {preview ? (
              <>
                <img src={preview} alt="plant" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'cover', display: 'block', margin: '0 auto' }} />
                <button onClick={clear} style={{ position: 'absolute', top: 8, right: 8, background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <div style={{ width: 52, height: 52, background: 'var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .75rem' }}>
                  <Upload size={24} color="var(--text-muted)" />
                </div>
                <p style={{ fontWeight: 600, fontSize: '.9rem', marginBottom: '.25rem' }}>
                  {t('disease.drop_image')}
                </p>
                <p style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>JPEG, PNG, WEBP — max 5MB</p>
              </>
            )}
          </div>

          <button className="btn btn-primary" disabled={!image || loading} onClick={submit} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? t('common.analyzing') : <><Bug size={16} /> {t('disease.detect_btn')}</>}
          </button>
        </div>

        <div>
          {loading && <div className="spinner" />}

          {result && (
            <div className="card fade-up" style={{ borderTop: `4px solid ${SEVERITY_BORDER[result.severity] || 'var(--amber)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--red)', marginBottom: '.2rem' }}>{result.disease_name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.83rem' }}>{result.crop_type} · {t('disease.confidence')}: {result.confidence}</p>
                </div>
                <span className={`badge ${SEVERITY_COLOR[result.severity] || 'badge-amber'}`}>{result.severity} {t('disease.severity')}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem', marginBottom: '1.25rem' }}>
                <InfoBlock label={t('disease.symptoms')} content={result.symptoms} />
                <InfoBlock label={t('disease.treatment')} content={result.treatment} />
                <InfoBlock label={t('disease.organic_remedy')} content={result.organic_remedy} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.5rem' }}>
                  {t('disease.recommended_pesticides')}
                </p>
                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                  {result.pesticides.map(p => <span key={p} className="badge badge-red">{p}</span>)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <a href={result.video_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  <Play size={13} /> {t('disease.watch_tutorial')}
                </a>
                {result.buy_links?.map((link, i) => (
                  <a key={i} href={link} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: 'var(--amber-pale)', color: '#b45309', border: '1px solid #fcd34d' }}>
                    <ShoppingCart size={13} /> {t('disease.buy')} {result.pesticides[i]}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="empty-state card">
              <Bug size={44} />
              <p>{t('disease.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, content }) {
  return (
    <div style={{ padding: '.75rem', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.3rem' }}>{label}</p>
      <p style={{ fontSize: '.88rem', lineHeight: 1.6, color: 'var(--text)' }}>{content}</p>
    </div>
  )
}
