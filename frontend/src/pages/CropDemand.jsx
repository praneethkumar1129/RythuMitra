import { useEffect, useState } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts'
import api from '../api'

const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus }
const TREND_COLOR = { up: 'var(--green)', down: 'var(--red)', stable: 'var(--amber)' }

export default function CropDemand() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('bar') // bar | line | table

  useEffect(() => {
    api.get('/api/crop_demand')
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  const sorted = [...data].sort((a, b) => b.demand_index - a.demand_index)

  return (
    <div>
      <div className="page-title"><BarChart2 size={24} /> Crop Market Demand</div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Highest Demand', value: sorted[0]?.crop, sub: `Demand Index: ${sorted[0]?.demand_index}`, color: 'var(--green)' },
          { label: 'Best Price',     value: [...data].sort((a,b) => b.market_price - a.market_price)[0]?.crop,
            sub: `₹${[...data].sort((a,b) => b.market_price - a.market_price)[0]?.market_price}/quintal`, color: 'var(--amber)' },
          { label: 'Most Grown',     value: [...data].sort((a,b) => b.farmers_growing - a.farmers_growing)[0]?.crop,
            sub: `${[...data].sort((a,b) => b.farmers_growing - a.farmers_growing)[0]?.farmers_growing} farmers`, color: 'var(--blue)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
            <div style={{ fontSize: '.85rem', fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        {['bar', 'line', 'table'].map(v => (
          <button key={v} className={`btn btn-sm ${view === v ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setView(v)}>
            {v.charAt(0).toUpperCase() + v.slice(1)} View
          </button>
        ))}
      </div>

      {/* Charts */}
      {view === 'bar' && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Farmers Growing vs Demand Index</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" angle={-40} textAnchor="end" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar yAxisId="left" dataKey="farmers_growing" name="Farmers Growing" fill="#4caf50" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="demand_index" name="Demand Index" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'line' && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Market Price Trend (₹/quintal)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" angle={-40} textAnchor="end" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Legend verticalAlign="top" />
              <Line type="monotone" dataKey="market_price" name="Market Price (₹)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'table' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--green-pale)' }}>
                {['Crop', 'Farmers Growing', 'Demand Index', 'Market Price', 'Trend'].map(h => (
                  <th key={h} style={{ padding: '.65rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--green)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const Icon = TREND_ICON[row.trend]
                return (
                  <tr key={row.crop} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg)' }}>
                    <td style={{ padding: '.65rem 1rem', fontWeight: 600 }}>{row.crop}</td>
                    <td style={{ padding: '.65rem 1rem' }}>{row.farmers_growing.toLocaleString()}</td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <div style={{ width: `${row.demand_index}%`, maxWidth: 80, height: 8, background: 'var(--green)', borderRadius: 4 }} />
                        <span>{row.demand_index}</span>
                      </div>
                    </td>
                    <td style={{ padding: '.65rem 1rem', fontWeight: 600 }}>₹{row.market_price}</td>
                    <td style={{ padding: '.65rem 1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: TREND_COLOR[row.trend], fontWeight: 600 }}>
                        <Icon size={16} /> {row.trend}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Tip */}
      <div className="card" style={{ background: 'var(--amber-pale)', borderLeft: '4px solid var(--amber)', marginTop: '1rem' }}>
        <strong>💡 AI Insight:</strong> Vegetables, Tomato and Onion have the highest demand index this season.
        Consider growing these for better profit margins. Avoid Sugarcane if you are in a water-scarce area.
      </div>
    </div>
  )
}
