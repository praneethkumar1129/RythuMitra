import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'
import api from '../api'

const TREND_ICON  = { up: TrendingUp, down: TrendingDown, stable: Minus }
const TREND_COLOR = { up: 'var(--green)', down: 'var(--red)', stable: 'var(--amber)' }
const TREND_BG    = { up: 'var(--green-pale)', down: '#fee2e2', stable: 'var(--amber-pale)' }

export default function CropDemand() {
  const { t, lang } = useLang()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView]       = useState('bar')

  useEffect(() => {
    api.get('/api/crop_demand')
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  const sorted    = [...data].sort((a, b) => b.demand_index - a.demand_index)
  const byPrice   = [...data].sort((a, b) => b.market_price - a.market_price)
  const byFarmers = [...data].sort((a, b) => b.farmers_growing - a.farmers_growing)

  const views = [
    { key: 'bar',   label: lang === 'te' ? 'బార్ చార్ట్' : 'Bar Chart' },
    { key: 'line',  label: lang === 'te' ? 'ధర ట్రెండ్' : 'Price Trend' },
    { key: 'table', label: lang === 'te' ? 'టేబుల్' : 'Table' },
  ]

  const summaryCards = [
    { label: lang === 'te' ? 'అత్యధిక డిమాండ్' : 'Highest Demand', value: sorted[0]?.crop,    sub: `${lang === 'te' ? 'ఇండెక్స్' : 'Index'}: ${sorted[0]?.demand_index}`, color: 'var(--green)', bg: 'var(--green-pale)' },
    { label: lang === 'te' ? 'బెస్ట్ ధర' : 'Best Price',         value: byPrice[0]?.crop,   sub: `₹${byPrice[0]?.market_price}/${lang === 'te' ? 'క్వింటల్' : 'quintal'}`,  color: 'var(--amber)', bg: 'var(--amber-pale)' },
    { label: lang === 'te' ? 'ఎక్కువగా పండించే' : 'Most Grown',  value: byFarmers[0]?.crop, sub: `${byFarmers[0]?.farmers_growing} ${lang === 'te' ? 'రైతులు' : 'farmers'}`, color: 'var(--blue)',  bg: '#eff6ff' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <div style={{ background: '#eff6ff', borderRadius: 10, padding: '8px', display: 'flex' }}>
          <BarChart2 size={22} color="var(--blue)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.3px' }}>
            {lang === 'te' ? 'మార్కెట్ డిమాండ్' : 'Market Demand'}
          </h1>
          <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {lang === 'te' ? 'పంట ధరలు, డిమాండ్ ట్రెండ్స్ & మార్కెట్ ఇన్సైట్స్' : 'Crop prices, demand trends and market insights'}
          </p>
        </div>
      </div>

      <div className="grid-3">
        {summaryCards.map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color, marginBottom: '.15rem' }}>{s.value}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.2rem' }}>{s.label}</div>
            <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 3, border: '1px solid var(--border)', width: 'fit-content' }}>
        {views.map(v => (
          <button key={v.key} onClick={() => setView(v.key)}
            style={{
              padding: '.38rem .9rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '.83rem', fontWeight: 600, transition: 'all .15s',
              background: view === v.key ? 'var(--green)' : 'transparent',
              color: view === v.key ? '#fff' : 'var(--text-muted)',
            }}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'bar' && (
        <div className="card">
          <div className="section-title">
            {lang === 'te' ? 'రైతులు పెంచుతున్న పంటలు vs డిమాండ్ ఇండెక్స్' : 'Farmers Growing vs Demand Index'}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="crop" angle={-40} textAnchor="end" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: '.85rem' }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '.83rem' }} />
              <Bar yAxisId="left" dataKey="farmers_growing" name={lang === 'te' ? 'రైతులు పెంచుతున్నారు' : 'Farmers Growing'} fill="#4caf50" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="demand_index" name={lang === 'te' ? 'డిమాండ్ ఇండెక్స్' : 'Demand Index'} fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'line' && (
        <div className="card">
          <div className="section-title">
            {lang === 'te' ? 'మార్కెట్ ధర ట్రెండ్ (₹/క్వింటల్)' : 'Market Price Trend (₹/quintal)'}
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="crop" angle={-40} textAnchor="end" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip formatter={v => `₹${v}`} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: '.85rem' }} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: '.83rem' }} />
              <Line type="monotone" dataKey="market_price" name={lang === 'te' ? 'మార్కెట్ ధర (₹)' : 'Market Price (₹)'} stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'table' && (
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--green-pale)', borderBottom: '2px solid var(--border)' }}>
                {[
                  lang === 'te' ? 'పంట' : 'Crop',
                  lang === 'te' ? 'రైతులు పెంచుతున్నారు' : 'Farmers Growing',
                  lang === 'te' ? 'డిమాండ్ ఇండెక్స్' : 'Demand Index',
                  lang === 'te' ? 'మార్కెట్ ధర' : 'Market Price',
                  lang === 'te' ? 'ధోరణి' : 'Trend',
                ].map(h => (
                  <th key={h} style={{ padding: '.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--green)', fontSize: '.78rem', textTransform: 'uppercase', letterSpacing: '.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const Icon = TREND_ICON[row.trend]
                return (
                  <tr key={row.crop} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg)' }}>
                    <td style={{ padding: '.7rem 1rem', fontWeight: 700 }}>{row.crop}</td>
                    <td style={{ padding: '.7rem 1rem', color: 'var(--text-muted)' }}>{row.farmers_growing.toLocaleString()}</td>
                    <td style={{ padding: '.7rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${row.demand_index}%`, height: '100%', background: 'var(--green)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{row.demand_index}</span>
                      </div>
                    </td>
                    <td style={{ padding: '.7rem 1rem', fontWeight: 700 }}>₹{row.market_price}</td>
                    <td style={{ padding: '.7rem 1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', padding: '.2rem .6rem', borderRadius: 6, fontSize: '.78rem', fontWeight: 700, background: TREND_BG[row.trend], color: TREND_COLOR[row.trend] }}>
                        <Icon size={13} /> {row.trend}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ background: 'var(--amber-pale)', borderLeft: '4px solid var(--amber)', borderRadius: 10, padding: '1rem 1.25rem', fontSize: '.88rem', lineHeight: 1.6 }}>
        <strong>💡 {lang === 'te' ? 'AI ఇన్సైట్' : 'AI Insight'}:</strong>{' '}
        {lang === 'te'
          ? 'కూరగాయలు, టమాటా మరియు ఉల్లిపాయలకు ఈ సీజన్లో అత్యధిక డిమాండ్ ఉంది. మంచి లాభాల కోసం వీటిని పండించడం పరిగణించండి.'
          : 'Vegetables, Tomato and Onion have the highest demand index this season. Consider growing these for better profit margins.'}
      </div>
    </div>
  )
}
