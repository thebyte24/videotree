import { useState } from 'react'
import { apiLogin, apiLogout, isLoggedIn } from '../api/client'
import { AdminAuthContext } from './AdminAuthContext.js'

export function AdminAuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn())

  async function login(password) {
    try {
      await apiLogin(password)
      setLoggedIn(true)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  function logout() {
    apiLogout()
    setLoggedIn(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn: loggedIn, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
