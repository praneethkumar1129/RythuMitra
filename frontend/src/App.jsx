import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CropRecommendation from './pages/CropRecommendation'
import DiseaseDetection from './pages/DiseaseDetection'
import CropDemand from './pages/CropDemand'
import Jobs from './pages/Jobs'
import Weather from './pages/Weather'
import GovSchemes from './pages/GovSchemes'
import { Sprout, Home, Leaf, Bug, BarChart2, Briefcase, Cloud, BookOpen, Menu, X, User, LogIn } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/',        label: 'Home',    icon: Home },
  { to: '/crops',   label: 'Crops',   icon: Leaf },
  { to: '/disease', label: 'Disease', icon: Bug },
  { to: '/demand',  label: 'Market',  icon: BarChart2 },
  { to: '/jobs',    label: 'Jobs',    icon: Briefcase },
  { to: '/weather', label: 'Weather', icon: Cloud },
  { to: '/schemes', label: 'Schemes', icon: BookOpen },
]

const navLinkStyle = ({ isActive }) => ({
  display: 'flex', alignItems: 'center', gap: '.3rem',
  padding: '.4rem .7rem', borderRadius: 8, textDecoration: 'none',
  color: '#fff', fontSize: '.85rem', fontWeight: 500,
  background: isActive ? 'rgba(255,255,255,.2)' : 'transparent',
})

function Navbar() {
  const [open, setOpen] = useState(false)
  const farmerName = localStorage.getItem('farmer_name')
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <nav style={{ background: 'var(--green)', color: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem 1rem' }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 700, fontSize: '1.2rem', color: '#fff', textDecoration: 'none' }}>
          <Sprout size={24} /> RythuMitra
        </NavLink>

        <button className="btn" style={{ background: 'transparent', color: '#fff', display: 'none' }}
          id="menu-btn" onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul style={{ display: 'flex', gap: '.25rem', listStyle: 'none', flexWrap: 'wrap', alignItems: 'center' }} id="nav-links">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} style={navLinkStyle}>
                <Icon size={15} /> {label}
              </NavLink>
            </li>
          ))}

          {/* Divider + logged-in name shown after Schemes */}
          {isLoggedIn && (
            <li style={{ display: 'flex', alignItems: 'center', gap: '.25rem',
              borderLeft: '1px solid rgba(255,255,255,.3)', paddingLeft: '.5rem', marginLeft: '.25rem' }}>
              <span style={{ fontSize: '.8rem', opacity: .75 }}>👋</span>
              <span style={{ fontSize: '.85rem', fontWeight: 600, color: '#fff' }}>
                {farmerName || 'Farmer'}
              </span>
            </li>
          )}

          {/* Profile / Login button */}
          <li>
            {isLoggedIn ? (
              <NavLink to="/profile" style={({ isActive }) => ({
                ...navLinkStyle({ isActive }),
                fontWeight: 600,
                background: isActive ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.15)',
              })}>
                <User size={15} /> Profile
              </NavLink>
            ) : (
              <NavLink to="/login" style={() => ({
                display: 'flex', alignItems: 'center', gap: '.3rem',
                padding: '.4rem .7rem', borderRadius: 8, textDecoration: 'none',
                color: '#fff', fontSize: '.85rem', fontWeight: 600,
                background: 'rgba(255,255,255,.15)',
              })}>
                <LogIn size={15} /> Login
              </NavLink>
            )}
          </li>
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
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile"  element={<Profile />} />
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
