import { useMemo } from 'react'
import { CalendarDays, Compass, MapPin, Users, Wallet } from 'lucide-react'
import { useParams } from 'react-router-dom'
import EmptyState from '../common/EmptyState'
import Button from '../common/Button'
import Card from '../common/Card'
import { cn } from '../common/cn'

const GRADIENTS = ['from-candy-300 via-lav-300 to-mint-200']

function formatDate(iso) {
  if (!iso) return '?'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ShareTrip() {
  const { id } = useParams()

  let trip = null
  try {
    const stored = window.localStorage.getItem('globetrotter-trips')
    const trips = stored ? JSON.parse(stored) : []
    if (Array.isArray(trips)) trip = trips.find((t) => t.id === id) || null
  } catch {
    trip = null
  }

  const sections = useMemo(
    () => (trip ? [...(trip.sections || [])].sort((a, b) => (a.startDate || '').localeCompare(b.startDate || '')) : []),
    [trip],
  )

  if (!trip) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-page px-4">
        <div className="w-full max-w-md">
          <EmptyState
            icon={Compass}
            title="This shared itinerary is unavailable"
            description="The link may be incorrect, or the traveller may have deleted this trip."
            action={<Button to="/" variant="secondary">Visit GlobeTrotter</Button>}
          />
        </div>
      </div>
    )
  }

  const plannedTotal = sections.reduce((sum, s) => sum + (Number(s.budget) || 0), 0)

  return (
    <div className="min-h-svh bg-page">
      <header className={cn('relative overflow-hidden bg-linear-to-br', trip.gradient || GRADIENTS[0])}>
        <div aria-hidden className="absolute inset-0 bg-espresso-950/35" />
        <div className="relative mx-auto flex max-w-3xl flex-col gap-2 px-6 py-14 text-center sm:py-16">
          <span className="font-display mx-auto mb-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
            Shared via GlobeTrotter
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{trip.name}</h1>
          <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-white/85">
            <span className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{trip.destination}</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </span>
            <span className="flex items-center gap-1.5"><Users className="size-4" aria-hidden />{trip.travelers} travellers</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {sections.length > 0 ? (
          <>
            <ol className="relative space-y-4 border-l border-line pl-6">
              {sections.map((section, index) => (
                <li key={section.id} className="relative">
                  <span aria-hidden className="absolute top-5 -left-[31px] size-3 rounded-full bg-primary ring-4 ring-page" />
                  <Card hoverable className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Stop {index + 1}</p>
                        <h2 className="font-display mt-1 text-base font-bold text-ink">{section.description || 'Untitled stop'}</h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                          <CalendarDays className="size-3.5" aria-hidden />
                          {formatDate(section.startDate)} – {formatDate(section.endDate)}
                        </p>
                      </div>
                      <span className="font-mono shrink-0 rounded-lg bg-surface-2 px-3 py-1.5 text-sm font-semibold text-ink">
                        ₹{(Number(section.budget) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>

            <Card className="mt-8 p-6">
              <p className="flex items-center justify-between text-sm font-semibold text-ink">
                Planned route value
                <span className="font-mono tabular-nums">₹{plannedTotal.toLocaleString('en-IN')}</span>
              </p>
            </Card>
          </>
        ) : (
          <EmptyState
            icon={Wallet}
            title="Nothing planned yet"
            description="This traveller hasn't added any stops to share so far — check back later."
          />
        )}

        <footer className="mt-12 border-t border-line pt-6 text-center">
          <p className="font-display text-lg font-bold text-ink">
            Globe<span className="text-primary">Trotter</span>
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Plan trips worth remembering.{' '}
            <a href="/" className="font-semibold text-primary hover:underline">Start your own</a>
          </p>
        </footer>
      </main>
    </div>
  )
}
