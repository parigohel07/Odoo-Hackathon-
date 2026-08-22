import { useEffect, useMemo, useState } from 'react'
import { Calendar, Compass, Earth, FileCheck, House, MapPinPlus, SearchX, Wallet, X } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import EmptyState from '../../common/EmptyState'
import Searchbar from '../../common/Searchbar'
import { cn } from '../../common/cn'
import {
  INTERNATIONAL_PLACES,
  MY_COUNTRY_PLACES,
  VISA_INFO,
  getTripDetails,
} from '../../data/destinations'

const TABS = [
  { value: 'mycountry', label: 'My Country', icon: House },
  { value: 'international', label: 'International', icon: Earth },
]

function DestinationDetail({ place, international, onClose }) {
  const details = getTripDetails(place, international)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = [
    { icon: Calendar, label: 'Days you can travel', value: details.days },
    { icon: Wallet, label: 'Comfortable budget', value: details.budget },
    ...(details.visa ? [{ icon: FileCheck, label: 'Visa', value: details.visa }] : []),
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-950/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${place} trip details`}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-surface shadow-card-hover"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <h3 className="font-display text-xl font-semibold text-ink">{place}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="cursor-pointer rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <dl className="space-y-4 px-6 py-5">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</dt>
                <dd className="font-mono mt-0.5 text-sm font-medium text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {details.visa === 'Visa on arrival*' && (
          <p className="border-t border-line px-6 py-4 text-[11px] leading-relaxed text-ink-muted">
            *Eligibility depends on your passport and existing visas — always confirm with the embassy before booking.
          </p>
        )}
      </div>
    </div>
  )
}

export default function Explore() {
  const [tab, setTab] = useState('mycountry')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const international = tab === 'international'

  const places = useMemo(() => {
    const source = international ? INTERNATIONAL_PLACES : MY_COUNTRY_PLACES
    const q = query.trim().toLowerCase()
    return q ? source.filter((place) => place.toLowerCase().includes(q)) : source
  }, [international, query])

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Explore</p>
          <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink">
            Where to next?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Not sure where to go? Browse destinations, tap one for honest day-and-budget estimates and
            start planning with confidence.
          </p>
        </header>

        <section className="relative mb-8 h-52 overflow-hidden rounded-2xl border border-line shadow-card sm:h-60">
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-br from-lav-400 via-candy-400 to-caramel-300"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-espresso-950/70 via-espresso-950/20 to-transparent"
          />
          <div className="relative flex h-full flex-col items-start justify-end gap-3 p-6 sm:p-8">
            <h2 className="font-display max-w-md text-2xl leading-snug font-semibold text-white sm:text-3xl">
              Every great trip starts with a spark of curiosity.
            </h2>
            <Button to="/trips/new" size="sm">
              <MapPinPlus className="size-4" aria-hidden />
              Start planning
            </Button>
          </div>
        </section>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            {TABS.map(({ value, label, icon: Icon }) => (
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
          <Searchbar
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
            placeholder={`Search ${international ? 'countries' : 'states & UTs'}…`}
            className="lg:max-w-xs"
          />
        </div>

        <p className="mb-4 text-sm text-ink-muted">
          {international ? (
            <>
              <span className="font-semibold text-ink">Most popular</span> · visa guidance for Indian passports
            </>
          ) : (
            'All states & union territories'
          )}
        </p>

        {places.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {places.map((place) => (
              <li key={place}>
                <button
                  type="button"
                  onClick={() => setSelected(place)}
                  className="group flex h-full w-full cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card-hover"
                >
                  <Compass
                    className="size-5 text-caramel-500 transition-transform duration-200 group-hover:-rotate-12 group-hover:text-primary"
                    aria-hidden
                  />
                  <span className="text-sm leading-snug font-semibold text-ink">{place}</span>
                  {international && (
                    <span className="text-[10px] tracking-wide text-ink-muted uppercase">
                      {VISA_INFO[place].replace('Apply beforehand', 'Visa first')}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No matches found"
            description={`Nothing matches “${query}”. Try a different spelling or clear the search.`}
            action={
              <Button variant="secondary" onClick={() => setQuery('')}>
                Clear search
              </Button>
            }
          />
        )}
      </PageContainer>

      {selected && (
        <DestinationDetail
          place={selected}
          international={international}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
