import { useEffect, useState } from 'react'
import { UserContext } from './user'

const STORAGE_KEY = 'globetrotter-user'

function loadUser() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('Could not load saved user.', error)
    return null
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const updateUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : patch))
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}