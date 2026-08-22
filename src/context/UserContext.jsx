import { useEffect, useState } from 'react'
import { DEMO_USER } from '../data/mockData'
import { UserContext } from './user'

const STORAGE_KEY = 'globetrotter-user'

function loadUser() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    if (parsed && parsed.name) return parsed
  } catch (error) {
    console.warn('Could not load saved profile, falling back to demo user.', error)
  }
  return DEMO_USER
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }, [user])

  const updateUser = (patch) => setUser((prev) => ({ ...prev, ...patch }))

  return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>
}
