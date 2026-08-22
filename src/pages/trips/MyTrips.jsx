import { useMemo, useState } from 'react'
import { Luggage, Plus, SearchX } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import EmptyState from '../../common/EmptyState'
import Searchbar from '../../common/Searchbar'
import TripCard from '../../trips/TripCard'
import { useTrips } from '../../context/trips'

const STATUS_FILTERS = ['all', 'planning', 'upcoming', 'completed']

export default function MyTrips() {
  const { trips, deleteTrip } = useTrips()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trips.filter((trip) => {
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter
      const matchesQuery =
        !q ||
        trip.name.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [trips, query, statusFilter])

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink">My trips</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {trips.length === 0
                ? 'No adventures yet — your plans will live here.'
                : `${trips.length} ${trips.length === 1 ? 'adventure' : 'adventures'} on the map.`}
            </p>
          </div>
          <Button to="/trips/new">
            <Plus className="size-4" aria-hidden />
            New trip
          </Button>
        </div>

        {trips.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Searchbar
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search by trip or destination…"
              className="lg:max-w-md"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  aria-pressed={statusFilter === status}
                  className={
                    statusFilter === status
                      ? 'cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                      : 'cursor-pointer rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-primary/40 hover:text-primary'
                  }
                >
                  <span className="capitalize">{status}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={() => deleteTrip(trip.id)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={trips.length === 0 ? Luggage : SearchX}
            title={trips.length === 0 ? 'Your journey starts here' : 'No matching trips'}
            description={
              trips.length === 0
                ? 'Create your first trip and start turning “someday” into boarding passes.'
                : `Nothing matches “${query}”. Try a different search or clear the filters.`
            }
            action={
              trips.length === 0 ? (
                <Button to="/trips/new">
                  <Plus className="size-4" aria-hidden />
                  Create your first trip
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => { setQuery(''); setStatusFilter('all') }}>
                  Clear filters
                </Button>
              )
            }
          />
        )}
      </PageContainer>
    </div>
  )
}
