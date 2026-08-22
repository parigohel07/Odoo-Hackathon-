import { createContext, useContext } from 'react'

export const TripsContext = createContext(null)

export function useTrips() {
  const context = useContext(TripsContext)
  if (!context) throw new Error('useTrips must be used within a TripsProvider')
  return context
}
