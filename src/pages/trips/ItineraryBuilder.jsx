import { ArrowLeft, Calendar, Plus, Sparkles, Star, Trash2, Wallet } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import Card from '../../common/Card'
import EmptyState from '../../common/EmptyState'
import { cn } from '../../common/cn'
import { useTrips } from '../../context/trips'
import { generateSuggestions, mapEmbedUrl } from '../../data/suggestions'

const uid = () => Math.random().toString(36).slice(2, 10)

export default function ItineraryBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, updateTrip } = useTrips()
  const trip = trips.find((t) => t.id === id)

  const suggestions = trip ? generateSuggestions(trip.destination, 6) : []
  const selectedNames = new Set((trip?.sections || []).map((s) => s.description))

  if (!trip) {
    return (
      <div className="min-h-svh">
        <Navbar />
        <PageContainer>
          <EmptyState
            icon={Wallet}
            title="Trip not found"
            description="This trip may have been deleted or the link is incorrect."
            action={<Button to="/trips" variant="secondary">Back to My Trips</Button>}
          />
        </PageContainer>
      </div>
    )
  }

  const sections = trip.sections || []
  const totalBudget = sections.reduce((sum, s) => sum + (Number(s.budget) || 0), 0)
  const mapUrl = mapEmbedUrl([
    trip.destination,
    ...sections.filter((s) => s.description).map((s) => `${trip.destination} ${s.description}`.slice(0, 60)),
  ])

  const patchSections = (next) => updateTrip(trip.id, { sections: next })

  const addSection = () =>
    patchSections([...sections, { id: uid(), description: '', startDate: trip.startDate, endDate: trip.endDate, budget: 0 }])

  const updateSection = (sectionId, patch) =>
    patchSections(sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)))

  const removeSection = (sectionId) => patchSections(sections.filter((s) => s.id !== sectionId))

  const bumpBudget = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId)
    updateSection(sectionId, { budget: (Number(section.budget) || 0) + 1000 })
  }

  const addSuggestion = (activity) =>
    patchSections([
      ...sections,
      { id: uid(), description: activity.name, startDate: trip.startDate, endDate: trip.endDate, budget: activity.cost },
    ])

  const inputClass =
    'w-full rounded-xl border border-line bg-page px-3 py-2 text-sm text-ink transition-all placeholder:text-ink-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none'

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <button
          type="button"
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to itinerary
        </button>

        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display flex items-center gap-2 text-3xl font-semibold tracking-tight text-ink">
              Build itinerary — {trip.name}
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
              {trip.startDate} → {trip.endDate}
            </p>
          </div>
          <Card className="flex items-center gap-2 px-4 py-2.5">
            <Wallet className="size-4 text-primary" aria-hidden />
            <span className="font-mono text-sm font-semibold tabular-nums text-ink">
              ₹{totalBudget.toLocaleString('en-IN')}
            </span>
          </Card>
        </header>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={section.id} className="p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-display text-sm font-bold text-ink">Section {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  aria-label={`Remove section ${index + 1}`}
                  title="Remove section"
                  className="cursor-pointer rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>

              <textarea
                rows={2}
                placeholder="Transport, hotel, activity — anything that belongs to this section"
                value={section.description}
                onChange={(event) => updateSection(section.id, { description: event.target.value })}
                className={cn(inputClass, 'mb-3 h-auto resize-none')}
              />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Calendar className="size-4 shrink-0 text-ink-muted" aria-hidden />
                  <input
                    type="date"
                    aria-label={`Section ${index + 1} start date`}
                    className="rounded-lg border border-line bg-page px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                    value={section.startDate}
                    onChange={(event) => updateSection(section.id, { startDate: event.target.value })}
                  />
                  <span className="text-xs text-ink-muted">to</span>
                  <input
                    type="date"
                    aria-label={`Section ${index + 1} end date`}
                    className="rounded-lg border border-line bg-page px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                    value={section.endDate}
                    onChange={(event) => updateSection(section.id, { endDate: event.target.value })}
                  />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-ink-muted">Budget</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    aria-label={`Section ${index + 1} budget`}
                    className="font-mono w-24 rounded-lg border border-line bg-page px-2 py-1.5 text-xs tabular-nums text-ink focus:border-primary focus:outline-none"
                    value={section.budget}
                    onChange={(event) => updateSection(section.id, { budget: Number(event.target.value) })}
                  />
                  <button
                    type="button"
                    onClick={() => bumpBudget(section.id)}
                    title="Add ₹1,000"
                    aria-label="Add ₹1,000 to budget"
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg bg-primary-soft font-semibold text-primary-strong transition-colors hover:bg-candy-200 dark:hover:bg-espresso-800"
                  >
                    <Plus className="size-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <button
          type="button"
          onClick={addSection}
          className="mt-4 mb-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line py-4 text-sm font-semibold text-ink-muted transition-colors hover:border-primary/50 hover:bg-surface hover:text-primary"
        >
          <Plus className="size-4" aria-hidden />
          Add another section
        </button>

        <section className="mb-10">
          <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <Sparkles className="size-5 text-caramel-500" aria-hidden />
            Suggestions for {trip.destination.split(',')[0]}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((activity) => {
              const added = selectedNames.has(activity.name)
              return (
                <li key={activity.id}>
                  <button
                    type="button"
                    disabled={added}
                    onClick={() => addSuggestion(activity)}
                    className={cn(
                      'h-full w-full rounded-xl border p-4 text-left transition-all duration-200',
                      added
                        ? 'cursor-default border-primary/60 bg-primary-soft'
                        : 'cursor-pointer border-line bg-surface hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card-hover',
                    )}
                  >
                    <p className="flex items-start justify-between gap-2 text-sm font-semibold text-ink">
                      {activity.name}
                      {added && <Star className="mt-0.5 size-3.5 shrink-0 fill-primary text-primary" aria-hidden />}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{activity.category} · {activity.duration}h · ★ {activity.rating}</p>
                    <p className="font-mono mt-2 text-xs font-semibold text-ink">₹{activity.cost.toLocaleString('en-IN')}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {mapUrl && (
          <section>
            <h2 className="font-display mb-4 text-xl font-semibold text-ink">Route preview</h2>
            <Card className="overflow-hidden">
              <iframe title={`builder-map-${trip.id}`} src={mapUrl} width="100%" height="280" loading="lazy" style={{ border: 0 }} />
            </Card>
          </section>
        )}

        <div className="mt-8 flex justify-end">
          <Button to={`/trips/${trip.id}`} variant="primary">
            Done
          </Button>
        </div>
      </PageContainer>
    </div>
  )
}
