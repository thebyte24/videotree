import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import './Admin.css'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(password)
    if (result.ok) {
      navigate('/admin/dashboard')
    } else {
      setError(result.error || 'Incorrect password. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">VT</div>
        <h1 className="admin-login__title">Admin Panel</h1>
        <p className="admin-login__sub">VideoTree Studio</p>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <label className="admin-login__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="admin-login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            required
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button
            type="submit"
            className="admin-login__btn"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
