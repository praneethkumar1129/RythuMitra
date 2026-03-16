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
  padding: '.4rem .7rem', borderRadius: 8, textDecoration: 'none',
  color: '#fff', fontSize: '.85rem', fontWeight: 500,
  background: isActive ? 'rgba(255,255,255,.22)' : 'transparent',
  transition: 'background .15s',
})

function Navbar() {
  const [open, setOpen] = useState(false)
  const { isLoggedIn, name } = useAuth()

  return (
    <nav style={{ background: 'var(--green)', color: '#fff', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,.15)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.75rem 1rem' }}>

        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontWeight: 800, fontSize: '1.2rem', color: '#fff', textDecoration: 'none' }}>
          <Sprout size={24} /> RythuMitra
        </NavLink>

        <button className="btn" id="menu-btn"
          style={{ background: 'transparent', color: '#fff', display: 'none' }}
          onClick={() => setOpen(o => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul style={{ display: 'flex', gap: '.2rem', listStyle: 'none', flexWrap: 'wrap', alignItems: 'center' }} id="nav-links">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} style={linkStyle}>
                <Icon size={15} /> {label}
              </NavLink>
            </li>
          ))}

          {/* Logged-in farmer name */}
          {isLoggedIn && (
            <li style={{ borderLeft: '1px solid rgba(255,255,255,.3)', paddingLeft: '.6rem', marginLeft: '.2rem',
              display: 'flex', alignItems: 'center', gap: '.3rem' }}>
              <span style={{ fontSize: '.8rem', opacity: .8 }}>👋</span>
              <span style={{ fontSize: '.85rem', fontWeight: 700 }}>{name}</span>
            </li>
          )}

          {/* Profile / Login */}
          <li>
            {isLoggedIn ? (
              <NavLink to="/profile" style={({ isActive }) => ({
                ...linkStyle({ isActive }),
                fontWeight: 700,
                background: isActive ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.15)',
              })}>
                <User size={15} /> Profile
              </NavLink>
            ) : (
              <NavLink to="/auth" style={() => ({
                display: 'flex', alignItems: 'center', gap: '.3rem',
                padding: '.4rem .8rem', borderRadius: 8, textDecoration: 'none',
                color: 'var(--green)', fontSize: '.85rem', fontWeight: 700,
                background: '#fff', transition: 'opacity .15s',
              })}>
                <LogIn size={15} /> Login
              </NavLink>
            )}
          </li>
        </ul>
      </div>
      <style>{`
        @media(max-width:768px){
          #menu-btn { display:flex !important }
          #nav-links { display:${open ? 'flex' : 'none'} !important; flex-direction:column; padding:.5rem 1rem 1rem; width:100% }
        }
      `}</style>
    </nav>
  )
}

// Redirect to /auth if not logged in, remembers where user was going
function Protected({ children }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  if (!isLoggedIn) return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  return children
}

// Redirect to / if already logged in
function GuestOnly({ children }) {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '1.5rem 1rem' }}>
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
