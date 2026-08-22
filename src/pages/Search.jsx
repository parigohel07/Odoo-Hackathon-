import { useMemo, useState } from 'react'
import { Check, Clock, Compass, Globe, House, MapPinPlus, Plus, SearchX, Star } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import Searchbar from '../common/Searchbar'
import { cn } from '../common/cn'
import { useTrips } from '../context/trips'
import { INTERNATIONAL_PLACES, MY_COUNTRY_PLACES } from '../data/destinations'
import { ACTIVITY_CATEGORIES, TRENDING_PLACES, generateSuggestions } from '../data/suggestions'

const uid = () => Math.random().toString(36).slice(2, 10)

export default function SearchPage() {
  const { trips, updateTrip } = useTrips()
  const [tab, setTab] = useState('cities')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [targetTripId, setTargetTripId] = useState('')
  const [addedIds, setAddedIds] = useState({})

  const cities = useMemo(() => {
    const source = [...MY_COUNTRY_PLACES, ...INTERNATIONAL_PLACES]
    const q = query.trim().toLowerCase()
    return q ? source.filter((place) => place.toLowerCase().includes(q)) : []
  }, [query])

  const activities = useMemo(
    () => (query.trim() ? generateSuggestions(query.trim(), 8, category) : []),
    [query, category],
  )

  const targetTrip = trips.find((trip) => trip.id === targetTripId) || null

  const addToTrip = (activity) => {
    if (!targetTrip) return
    updateTrip(targetTrip.id, (trip) => ({
      sections: [
        ...(trip.sections || []),
        {
          id: uid(),
          description: activity.name,
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: activity.cost,
        },
      ],
    }))
    setAddedIds((prev) => ({ ...prev, [activity.id]: true }))
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [activity.id]: false })), 1500)
  }

  const selectClass =
    'cursor-pointer rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-primary/40 focus:outline-none'

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Search</p>
          <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink">Find a place or an activity</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Search any city to start a trip around it, or search an activity type and drop results straight into an existing itinerary.
          </p>
        </header>

        <div className="mb-6 flex gap-2">
          {[
            { value: 'cities', label: 'City search', icon: House },
            { value: 'activities', label: 'Activity search', icon: Compass },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                tab === value
                  ? 'bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                  : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <Searchbar
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder={tab === 'cities' ? 'Try “Goa”, “Kyoto”, “Kerala”…' : 'Try “food”, “hike”, “museum”…'}
            className="lg:max-w-md"
          />
          {tab === 'activities' && (
            <>
              <select aria-label="Filter by category" className={selectClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                aria-label="Add results to trip"
                className={cn(selectClass, 'lg:ml-auto')}
                value={targetTripId}
                onChange={(event) => setTargetTripId(event.target.value)}
              >
                <option value="">Add to trip…</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>{trip.name}</option>
                ))}
              </select>
            </>
          )}
        </div>

        {tab === 'cities' ? (
          cities.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-ink-muted">{cities.length} destinations match — pick one to plan a trip there.</p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {cities.slice(0, 30).map((place) => (
                  <li key={place}>
                    <Button to={`/trips/new?destination=${encodeURIComponent(place)}`} variant="outline" size="sm" className="h-auto w-full flex-col gap-1.5 py-4 normal-case">
                      <Globe className="size-5 text-caramel-500" aria-hidden />
                      <span className="text-xs leading-snug font-semibold">{place}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="font-display mb-3 text-lg font-semibold text-ink">Trending now</h2>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                  {TRENDING_PLACES.map((place) => (
                    <li key={place}>
                      <Button to={`/trips/new?destination=${encodeURIComponent(place)}`} variant="outline" size="sm" className="h-auto w-full flex-col gap-1.5 py-4">
                        <MapPinPlus className="size-5 text-primary" aria-hidden />
                        <span className="text-xs font-semibold">{place}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
              <EmptyState
                icon={Compass}
                title="Search the world"
                description="Start typing above to find cities and regions — every result can become a new trip."
              />
            </div>
          )
        ) : activities.length > 0 ? (
          <>
            {!targetTripId && (
              <p className="mb-4 rounded-xl bg-surface-2 px-4 py-3 text-xs text-ink-muted">
                Select a trip in “Add to trip…” above to attach activities to its itinerary.
              </p>
            )}
            <ul className="space-y-2.5">
              {activities.map((activity) => {
                const added = addedIds[activity.id]
                return (
                  <li
                    key={activity.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-card"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{activity.name}</p>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-ink-muted">
                        <span>{activity.category}</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" aria-hidden />{activity.duration}h</span>
                        <span className="flex items-center gap-1"><Star className="size-3" aria-hidden />{activity.rating}</span>
                        <span className="font-mono font-semibold text-ink">₹{activity.cost.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!targetTrip || added}
                      onClick={() => addToTrip(activity)}
                      className={cn(
                        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all',
                        added
                          ? 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300'
                          : 'bg-primary text-white hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40 dark:text-espresso-950',
                      )}
                    >
                      {added ? <Check className="size-3.5" aria-hidden /> : <Plus className="size-3.5" aria-hidden />}
                      {added ? 'Added' : 'Add'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="Type to search activities"
            description="Enter an activity type like food, hike, museum or nightlife to get instant suggestions with costs."
          />
        )}
      </PageContainer>
    </div>
  )
}
