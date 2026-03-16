import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => ({
    token:     localStorage.getItem('token')        || null,
    farmer_id: localStorage.getItem('farmer_id')    || null,
    name:      localStorage.getItem('farmer_name')  || null,
  }))

  const login = useCallback((data) => {
    localStorage.setItem('token',       data.token)
    localStorage.setItem('farmer_id',   data.farmer_id)
    localStorage.setItem('farmer_name', data.name)
    setAuth({ token: data.token, farmer_id: data.farmer_id, name: data.name })
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setAuth({ token: null, farmer_id: null, name: null })
  }, [])

  const updateName = useCallback((name) => {
    localStorage.setItem('farmer_name', name)
    setAuth(a => ({ ...a, name }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...auth, isLoggedIn: !!auth.token, login, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
