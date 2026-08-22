import { Navigate } from 'react-router-dom'

const SESSION_KEY = 'globetrotter-session'

export function getSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(session) {
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...session, signedInAt: new Date().toISOString() }),
  )
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

export function RequireAuth({ children }) {
  if (!getSession()) return <Navigate to="/login" replace />
  return children
}

export function RedirectIfAuthed({ children }) {
  if (getSession()) return <Navigate to="/" replace />
  return children
}
