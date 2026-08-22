import { useEffect, useState } from 'react'
import { TripsContext } from './trips'
import { useUser } from './user'

function getStorageKey(user) {
  const userId = user?.id || user?.email

  return userId
    ? `globetrotter-trips-${userId}`
    : 'globetrotter-trips'
}

function loadTrips(user) {
  try {
    const key = getStorageKey(user)
    const stored = window.localStorage.getItem(key)

    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Could not load saved trips.', error)
    return []
  }
}

export function TripsProvider({ children }) {
  const { user } = useUser()

  const [trips, setTrips] = useState(() => loadTrips(user))

  // When a different user logs in, load that user's trips.
  useEffect(() => {
    setTrips(loadTrips(user))
  }, [user?.id, user?.email])

  // Save trips separately for each logged-in user.
  useEffect(() => {
    if (!user) return

    const key = getStorageKey(user)

    window.localStorage.setItem(
      key,
      JSON.stringify(trips),
    )
  }, [trips, user?.id, user?.email])

  const addTrip = (trip) => {
    setTrips((prev) => [
      {
        ...trip,
        id: `t-${Date.now().toString(36)}`,
      },
      ...prev,
    ])
  }

  const deleteTrip = (id) => {
    setTrips((prev) =>
      prev.filter((trip) => trip.id !== id),
    )
  }

  const updateTrip = (id, patch) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              ...(typeof patch === 'function'
                ? patch(trip)
                : patch),
            }
          : trip,
      ),
    )
  }

  const addExpense = (tripId, expense) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              expenses: [
                ...(Array.isArray(trip.expenses)
                  ? trip.expenses
                  : []),
                {
                  ...expense,
                  id: `e-${Date.now().toString(36)}-${Math.random()
                    .toString(36)
                    .slice(2, 6)}`,
                },
              ],
            }
          : trip,
      ),
    )
  }

  const deleteExpense = (tripId, expenseId) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId &&
        Array.isArray(trip.expenses)
          ? {
              ...trip,
              expenses: trip.expenses.filter(
                (expense) => expense.id !== expenseId,
              ),
            }
          : trip,
      ),
    )
  }

  const clearExpenses = (tripId) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, expenses: [] }
          : trip,
      ),
    )
  }

  return (
    <TripsContext.Provider
      value={{
        trips,
        addTrip,
        deleteTrip,
        updateTrip,
        addExpense,
        deleteExpense,
        clearExpenses,
      }}
    >
      {children}
    </TripsContext.Provider>
  )
}