import { ArrowRight, CalendarDays, CircleCheck, Compass, Luggage, MapPinPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import { useUser } from '../context/user'
import { useTrips } from '../context/trips'

const ACTIONS = [
  {
    to: '/trips/new',
    icon: MapPinPlus,
    title: 'Create Trips',
    text: 'Start a fresh adventure — pick dates, budget and a cover style.',
    accent: 'bg-candy-100 text-candy-600 dark:bg-candy-500/15 dark:text-candy-300',
    ring: 'hover:border-candy-500/50 hover:shadow-candy-500/20',
  },
  {
    to: '/trips',
    icon: Luggage,
    title: 'My Trips',
    text: 'Review your plans, track budgets and keep every journey on course.',
    accent: 'bg-lav-100 text-lav-600 dark:bg-lav-500/15 dark:text-lav-300',
    ring: 'hover:border-lav-500/50 hover:shadow-lav-500/20',
  },
  {
    to: '/explore',
    icon: Compass,
    title: 'Explore',
    text: 'Browse destinations with day and budget estimates before you commit.',
    accent: 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300',
    ring: 'hover:border-mint-500/50 hover:shadow-mint-500/20',
  },
]

export default function Dashboard() {
  const { trips } = useTrips()
  const { user } = useUser()
  const upcoming = trips.filter((trip) => trip.status === 'upcoming').length
  const planning = trips.filter((trip) => trip.status === 'planning').length
  const completed = trips.filter((trip) => trip.status === 'completed').length

  const stats = [
    { label: 'Total trips', value: trips.length, icon: Luggage },
    { label: 'Upcoming', value: upcoming, icon: ArrowRight },
    { label: 'In planning', value: planning, icon: CalendarDays },
    { label: 'Completed', value: completed, icon: CircleCheck },
  ]

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <section className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">GlobeTrotter HQ</p>
          <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {trips.length === 0
              ? 'Your travel desk is empty — start by creating your first trip.'
              : 'Your journeys at a glance. Pick up where you left off, or dream up something new.'}
          </p>
        </section>

        <section aria-label="Trip statistics" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
                <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              </div>
              <p className="font-display mt-2 text-3xl font-semibold tabular-nums text-ink">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {ACTIONS.map(({ to, icon: Icon, title, text, accent, ring }) => (
            <Link key={to} to={to} aria-label={title} className="group focus-visible:outline-none">
              <article
                className={`flex h-full cursor-pointer flex-col rounded-2xl border border-line bg-surface p-7 shadow-card transition-all duration-200 group-focus-visible:outline-2 group-focus-visible:outline-primary group-hover:-translate-y-1 group-hover:shadow-card-hover ${ring}`}
              >
                <span className={`flex size-12 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <h2 className="font-display mt-5 text-xl font-semibold text-ink">{title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </article>
            </Link>
          ))}
        </section>
      </PageContainer>
    </div>
  )
}
