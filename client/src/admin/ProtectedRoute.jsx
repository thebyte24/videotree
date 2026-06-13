import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAdminAuth()
  return isLoggedIn ? children : <Navigate to="/admin" replace />
}
