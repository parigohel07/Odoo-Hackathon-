import { useEffect, useState } from 'react'
import { TRIPS } from '../data/mockData'
import { TripsContext } from './trips'

const STORAGE_KEY = 'globetrotter-trips'

function loadTrips() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    return Array.isArray(parsed) ? parsed : TRIPS
  } catch (error) {
    console.warn('Could not load saved trips, falling back to demo data.', error)
    return TRIPS
  }
}

export function TripsProvider({ children }) {
  const [trips, setTrips] = useState(loadTrips)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  }, [trips])

  const addTrip = (trip) => {
    setTrips((prev) => [{ ...trip, id: `t-${Date.now().toString(36)}` }, ...prev])
  }

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id))
  }

  const updateTrip = (id, patch) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, ...(typeof patch === 'function' ? patch(trip) : patch) } : trip)),
    )
  }

  return (
    <TripsContext.Provider value={{ trips, addTrip, deleteTrip, updateTrip }}>
      {children}
    </TripsContext.Provider>
  )
}
