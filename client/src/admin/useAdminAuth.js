import { useContext } from 'react'
import { AdminAuthContext } from './AdminAuthContext.js'

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
