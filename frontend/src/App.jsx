import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'

import Dashboard        from './pages/Dashboard'
import Auth             from './pages/Auth'
import Profile          from './pages/Profile'
import CropRecommendation from './pages/CropRecommendation'
import DiseaseDetection from './pages/DiseaseDetection'
import CropDemand       from './pages/CropDemand'
import Jobs             from './pages/Jobs'
import Weather          from './pages/Weather'
import GovSchemes       from './pages/GovSchemes'

import { Sprout, Home, Leaf, Bug, BarChart2, Briefcase, Cloud, BookOpen, Menu, X, User, LogIn } from 'lucide-react'
import ChatBot from './components/ChatBot'
import InstallPWA from './components/InstallPWA'

const NAV = [
  { to: '/',        label: 'Home',    icon: Home },
  { to: '/crops',   label: 'Crops',   icon: Leaf },
  { to: '/disease', label: 'Disease', icon: Bug },
  { to: '/demand',  label: 'Market',  icon: BarChart2 },
  { to: '/jobs',    label: 'Jobs',    icon: Briefcase },
  { to: '/weather', label: 'Weather', icon: Cloud },
  { to: '/schemes', label: 'Schemes', icon: BookOpen },
]

const linkStyle = ({ isActive }) => ({
  display: 'flex', alignItems: 'center', gap: '.3rem',
  padding: '.38rem .7rem', borderRadius: 7, textDecoration: 'none',
  color: isActive ? '#fff' : 'rgba(255,255,255,.82)', fontSize: '.83rem', fontWeight: isActive ? 600 : 400,
  background: isActive ? 'rgba(255,255,255,.2)' : 'transparent',
  transition: 'all .15s',
})

function Navbar() {
  const [open, setOpen] = useState(false)
  const { isLoggedIn, name } = useAuth()

  return (
    <nav style={{
      background: 'var(--green)', color: '#fff', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 0 rgba(255,255,255,.08), 0 4px 16px rgba(0,0,0,.18)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 1rem' }}>

        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '.55rem', fontWeight: 800, fontSize: '1.18rem', color: '#fff', textDecoration: 'none', letterSpacing: '-.3px' }}>
          <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 8, padding: '5px', display: 'flex', alignItems: 'center' }}>
            <Sprout size={18} />
          </div>
          Rythu Seva
        </NavLink>

        <button id="menu-btn"
          style={{ background: 'rgba(255,255,255,.12)', color: '#fff', display: 'none', border: 'none', borderRadius: 8, padding: '.4rem .5rem', cursor: 'pointer' }}
          onClick={() => setOpen(o => !o)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <ul style={{ display: 'flex', gap: '.05rem', listStyle: 'none', flexWrap: 'wrap', alignItems: 'center', margin: 0, padding: 0 }} id="nav-links">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} style={linkStyle}>
                <Icon size={14} /> {label}
              </NavLink>
            </li>
          ))}

          {isLoggedIn && (
            <li style={{ borderLeft: '1px solid rgba(255,255,255,.2)', paddingLeft: '.65rem', marginLeft: '.4rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 700, border: '1.5px solid rgba(255,255,255,.3)' }}>
                {name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '.83rem', fontWeight: 600 }}>{name}</span>
            </li>
          )}

          <li>
            {isLoggedIn ? (
              <NavLink to="/profile" style={({ isActive }) => ({
                ...linkStyle({ isActive }),
                background: isActive ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.2)',
                fontWeight: 600,
              })}>
                <User size={14} /> Profile
              </NavLink>
            ) : (
              <NavLink to="/auth" style={() => ({
                display: 'flex', alignItems: 'center', gap: '.3rem',
                padding: '.38rem .85rem', borderRadius: 7, textDecoration: 'none',
                color: 'var(--green)', fontSize: '.83rem', fontWeight: 700,
                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.12)',
              })}>
                <LogIn size={14} /> Login
              </NavLink>
            )}
          </li>
        </ul>
      </div>
      <style>{`
        @media(max-width:768px){
          #menu-btn { display:flex !important }
          #nav-links { display:${open ? 'flex' : 'none'} !important; flex-direction:column; padding:.5rem 1rem 1rem; width:100%; gap:.15rem; border-top:1px solid rgba(255,255,255,.1); margin-top:.1rem }
        }
      `}</style>
    </nav>
  )
}

function Protected({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  if (!isLoggedIn) return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  return children
}

function GuestOnly({ children }) {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/auth"    element={<GuestOnly><Auth /></GuestOnly>} />
          <Route path="/login"   element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth?tab=register" replace />} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/crops"   element={<CropRecommendation />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/demand"  element={<CropDemand />} />
          <Route path="/jobs"    element={<Jobs />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/schemes" element={<GovSchemes />} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatBot />
      <InstallPWA />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
