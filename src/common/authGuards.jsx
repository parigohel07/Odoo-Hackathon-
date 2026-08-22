import { Navigate } from 'react-router-dom'
import { getSession } from './session'

export function RequireAuth({ children }) {
  if (!getSession()) return <Navigate to="/login" replace />
  return children
}

export function RedirectIfAuthed({ children }) {
  if (getSession()) return <Navigate to="/" replace />
  return children
}
