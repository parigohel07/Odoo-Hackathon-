import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import Button from '../common/Button'
import { cn } from '../common/cn'
import { useTrips } from '../context/trips'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function CalendarTimeline() {
  const { trips } = useTrips()
  const [offset, setOffset] = useState(0)

  const base = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth() + offset, 1)
  }, [offset])

  const year = base.getFullYear()
  const month = base.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = useMemo(() => {
    const cells = [...Array(firstWeekday).fill(null)]
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
      cells.push({
        day,
        dateStr,
        trips: trips.filter((trip) => trip.startDate <= dateStr && trip.endDate >= dateStr),
      })
    }
    return cells
  }, [firstWeekday, daysInMonth, year, month, trips])

  const upcoming = useMemo(
    () =>
      trips
        .filter((trip) => trip.startDate >= new Date().toISOString().slice(0, 10))
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [trips],
  )

  const monthLabel = base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  if (trips.length === 0) {
    return (
      <div className="min-h-svh">
        <Navbar />
        <PageContainer>
          <EmptyState
            icon={CalendarDays}
            title="Your calendar is waiting"
            description="Once you plan a trip it will appear here on the timeline."
            action={<Button to="/trips/new">Plan a trip</Button>}
          />
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer size="lg">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Calendar</p>
            <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink">Trip timeline</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOffset((o) => o - 1)}
              aria-label="Previous month"
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <span className="font-display min-w-44 text-center text-lg font-semibold text-ink">{monthLabel}</span>
            <button
              type="button"
              onClick={() => setOffset((o) => o + 1)}
              aria-label="Next month"
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </header>

        <Card className="mb-10 overflow-hidden p-4 sm:p-6">
          <div className="mb-2 grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((weekday) => (
              <p key={weekday} className="py-1 text-center text-[11px] font-semibold tracking-wide text-ink-muted uppercase">
                {weekday}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((cell, index) =>
              cell ? (
                <div
                  key={cell.dateStr}
                  className={cn(
                    'min-h-16 rounded-lg border p-1.5 sm:min-h-20',
                    cell.trips.length > 0 ? 'border-primary/30 bg-primary-soft' : 'border-line bg-page',
                  )}
                >
                  <p className={cn('text-[11px] font-semibold tabular-nums', cell.trips.length > 0 ? 'text-primary-strong' : 'text-ink-muted')}>
                    {cell.day}
                  </p>
                  {cell.trips.slice(0, 2).map((trip) => (
                    <Link
                      key={trip.id}
                      to={`/trips/${trip.id}`}
                      title={trip.name}
                      className="mt-0.5 block truncate rounded bg-surface px-1 py-0.5 text-[9px] leading-tight font-semibold text-ink shadow-sm transition-colors hover:text-primary sm:text-[10px]"
                    >
                      {trip.name}
                    </Link>
                  ))}
                  {cell.trips.length > 2 && (
                    <p className="px-1 text-[9px] font-medium text-primary-strong">+{cell.trips.length - 2} more</p>
                  )}
                </div>
              ) : (
                <div key={`blank-${index}`} aria-hidden />
              ),
            )}
          </div>
        </Card>

        <section>
          <h2 className="font-display mb-4 text-xl font-semibold text-ink">Upcoming departures</h2>
          {upcoming.length > 0 ? (
            <ul className="space-y-3">
              {upcoming.map((trip) => (
                <li key={trip.id}>
                  <Link
                    to={`/trips/${trip.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-5 py-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
                  >
                    <div>
                      <p className="font-semibold text-ink">{trip.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                        <MapPin className="size-3.5" aria-hidden />
                        {trip.destination}
                      </p>
                    </div>
                    <span className="font-mono rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong">
                      {new Date(`${trip.startDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-muted">No upcoming departures — time to dream bigger.</p>
          )}
        </section>
      </PageContainer>
    </div>
  )
}
