import { useMemo, useState } from 'react'
import {
  ArrowLeft, CalendarDays, Check, MapPin, MapPinPlus, Pencil, Share2, Users, Wallet,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import Card from '../../common/Card'
import EmptyState from '../../common/EmptyState'
import { cn } from '../../common/cn'
import { useTrips } from '../../context/trips'
import { mapEmbedUrl } from '../../data/suggestions'

const STATUS_STYLES = {
  upcoming: 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300',
  planning: 'bg-lav-100 text-lav-600 dark:bg-lav-500/15 dark:text-lav-300',
  completed: 'bg-surface-2 text-ink-muted',
}

function formatDate(iso) {
  if (!iso) return '?'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips } = useTrips()
  const [copied, setCopied] = useState(false)
  const trip = trips.find((t) => t.id === id)

  const sections = useMemo(
    () => [...(trip?.sections || [])].sort((a, b) => (a.startDate || '').localeCompare(b.startDate || '')),
    [trip],
  )
  const plannedTotal = sections.reduce((sum, s) => sum + (Number(s.budget) || 0), 0)

  if (!trip) {
    return (
      <div className="min-h-svh">
        <Navbar />
        <PageContainer>
          <EmptyState
            icon={MapPin}
            title="Trip not found"
            description="This trip may have been deleted or the link is incorrect."
            action={<Button to="/trips" variant="secondary">Back to My Trips</Button>}
          />
        </PageContainer>
      </div>
    )
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/share/${trip.id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const mapUrl = mapEmbedUrl([
    trip.destination,
    ...sections.filter((s) => s.description).map((s) => `${trip.destination} ${s.description}`.slice(0, 60)),
  ])

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <button
          type="button"
          onClick={() => navigate('/trips')}
          className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All trips
        </button>

        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">{trip.name}</h1>
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize', STATUS_STYLES[trip.status] || STATUS_STYLES.completed)}>
                {trip.status}
              </span>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{trip.destination}</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
              <span className="flex items-center gap-1.5"><Users className="size-4" aria-hidden />{trip.travelers} travellers</span>
            </p>
            {trip.notes && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{trip.notes}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
              {copied ? 'Link copied' : 'Share'}
            </Button>
            <Button to={`/trips/${trip.id}/edit`}>
              <Pencil className="size-4" aria-hidden />
              Edit itinerary
            </Button>
          </div>
        </header>

        <section aria-label="Trip totals" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Stops planned', value: sections.length },
            { label: 'Sections budget', value: `₹${plannedTotal.toLocaleString('en-IN')}` },
            { label: 'Spent so far', value: `₹${(trip.spent || 0).toLocaleString('en-IN')}` },
            { label: 'Trip budget', value: `₹${(trip.budget || 0).toLocaleString('en-IN')}` },
          ].map(({ label, value }) => (
            <Card key={label} className="p-5">
              <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
              <p className="font-display mt-1.5 text-2xl font-semibold tabular-nums text-ink">{value}</p>
            </Card>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <MapPinPlus className="size-5 text-primary" aria-hidden />
            Itinerary
          </h2>
          {sections.length > 0 ? (
            <ol className="relative space-y-4 border-l border-line pl-6">
              {sections.map((section, index) => (
                <li key={section.id} className="relative">
                  <span className="absolute top-5 -left-[31px] flex size-3 items-center justify-center rounded-full bg-primary ring-4 ring-page" aria-hidden />
                  <Card hoverable className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-wide text-primary uppercase">Stop {index + 1}</p>
                        <h3 className="font-display mt-1 text-base font-bold text-ink">{section.description || 'Untitled stop'}</h3>
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
          ) : (
            <EmptyState
              icon={Wallet}
              title="No stops yet"
              description="Build your itinerary by adding stops — transport, hotels, activities and more."
              action={<Button to={`/trips/${trip.id}/edit`}>Build itinerary</Button>}
            />
          )}
        </section>

        {mapUrl && (
          <section>
            <h2 className="font-display mb-4 text-xl font-semibold text-ink">Route preview</h2>
            <Card className="overflow-hidden">
              <iframe title={`route-map-${trip.id}`} src={mapUrl} width="100%" height="280" loading="lazy" style={{ border: 0 }} />
            </Card>
          </section>
        )}
      </PageContainer>
    </div>
  )
}
