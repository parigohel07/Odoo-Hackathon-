import { ArrowRight, Compass, Luggage, MapPinPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import { DEMO_USER } from '../data/mockData'
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
    text: 'Browse destinations and itineraries shared by travellers like you.',
    accent: 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300',
    ring: 'hover:border-mint-500/50 hover:shadow-mint-500/20',
  },
]

export default function Dashboard() {
  const { trips } = useTrips()
  const upcoming = trips.filter((trip) => trip.status === 'upcoming').length
  const planning = trips.filter((trip) => trip.status === 'planning').length

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <section className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Hey {DEMO_USER.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            {trips.length === 0
              ? 'Your travel HQ is empty — start by creating your first trip.'
              : `${trips.length} trips on the map · ${upcoming} upcoming · ${planning} in planning.`}
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {ACTIONS.map(({ to, icon: Icon, title, text, accent, ring }) => (
            <Link key={to} to={to} aria-label={title} className="group focus-visible:outline-none">
              <article
                className={`flex h-full cursor-pointer flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-200 group-focus-visible:outline-2 group-focus-visible:outline-primary group-hover:-translate-y-0.5 group-hover:shadow-card-hover ${ring}`}
              >
                <span className={`flex size-12 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <h2 className="font-display mt-4 text-lg font-bold text-ink">{title}</h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-muted">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </article>
            </Link>
          ))}
        </section>
      </PageContainer>
    </div>
  )
}
