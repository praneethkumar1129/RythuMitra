import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import CropRecommendation from './pages/CropRecommendation'
import DiseaseDetection from './pages/DiseaseDetection'
import CropDemand from './pages/CropDemand'
import Jobs from './pages/Jobs'
import Weather from './pages/Weather'
import GovSchemes from './pages/GovSchemes'
import { Sprout, Home, UserPlus, Leaf, Bug, BarChart2, Briefcase, Cloud, BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/',           label: 'Home',       icon: Home },
  { to: '/register',   label: 'Register',   icon: UserPlus },
  { to: '/crops',      label: 'Crops',      icon: Leaf },
  { to: '/disease',    label: 'Disease',    icon: Bug },
  { to: '/demand',     label: 'Market',     icon: BarChart2 },
  { to: '/jobs',       label: 'Jobs',       icon: Briefcase },
  { to: '/weather',    label: 'Weather',    icon: Cloud },
  { to: '/schemes',    label: 'Schemes',    icon: BookOpen },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{ background: 'var(--green)', color: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 700, fontSize: '1.2rem' }}>
          <Sprout size={24} /> RythuMitra
        </div>
        <button className="btn" style={{ background: 'transparent', color: '#fff', display: 'none' }}
          id="menu-btn" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <ul style={{ display: 'flex', gap: '.25rem', listStyle: 'none', flexWrap: 'wrap' }} id="nav-links">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '.3rem',
                  padding: '.4rem .7rem', borderRadius: 8, textDecoration: 'none',
                  color: '#fff', fontSize: '.85rem', fontWeight: 500,
                  background: isActive ? 'rgba(255,255,255,.2)' : 'transparent',
                })}>
                <Icon size={15} /> {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <style>{`
        @media(max-width:768px){
          #menu-btn{display:flex!important}
          #nav-links{display:${open ? 'flex' : 'none'}!important;flex-direction:column;padding:.5rem 1rem 1rem}
        }
      `}</style>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <main className="container" style={{ padding: '1.5rem 1rem' }}>
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crops"    element={<CropRecommendation />} />
          <Route path="/disease"  element={<DiseaseDetection />} />
          <Route path="/demand"   element={<CropDemand />} />
          <Route path="/jobs"     element={<Jobs />} />
          <Route path="/weather"  element={<Weather />} />
          <Route path="/schemes"  element={<GovSchemes />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
