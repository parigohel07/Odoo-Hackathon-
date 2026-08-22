import { useMemo, useState } from 'react'
import { Banknote, Calculator, PiggyBank, TrendingDown, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import Button from '../common/Button'
import { cn } from '../common/cn'
import { useTrips } from '../context/trips'
import { formatINR, getTripExpenses, getTripMembers, getTripSpent } from '../utils/budget'

const MODE_FILTERS = [
  { value: 'all', label: 'All trips', emoji: '🌍' },
  { value: 'solo', label: 'Solo travelling', emoji: '🎒' },
  { value: 'group', label: 'Group travelling', emoji: '👥' },
]

export default function Budget() {
  const { trips } = useTrips()
  const [modeFilter, setModeFilter] = useState('all')

  const rows = useMemo(
    () =>
      trips.map((trip) => {
        const sections = trip.sections || []
        const planned = sections.reduce((sum, s) => sum + (Number(s.budget) || 0), 0)
        const spent = getTripSpent(trip)
        const budget = Number(trip.budget) || 0
        const members = getTripMembers(trip)
        const isSolo = trip.mode !== 'group' || members.length <= 1
        return {
          id: trip.id,
          name: trip.name,
          destination: trip.destination,
          status: trip.status,
          isSolo,
          squadSize: members.length,
          expenseCount: getTripExpenses(trip).length,
          budget,
          spent,
          planned,
          percent: budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0,
          over: spent > budget && budget > 0,
        }
      }),
    [trips],
  )

  const filtered = modeFilter === 'all' ? rows : rows.filter((row) => (modeFilter === 'solo') === row.isSolo)

  const totals = filtered.reduce(
    (acc, row) => ({
      budget: acc.budget + row.budget,
      spent: acc.spent + row.spent,
      planned: acc.planned + row.planned,
    }),
    { budget: 0, spent: 0, planned: 0 },
  )
  const remaining = totals.budget - totals.spent
  const soloCount = rows.filter((row) => row.isSolo).length

  if (trips.length === 0) {
    return (
      <div className="min-h-svh">
        <Navbar />
        <PageContainer>
          <EmptyState
            icon={Wallet}
            title="No budgets to track yet"
            description="Create a trip with a budget and every rupee will be tracked here."
            action={<Button to="/trips/new">Create a trip</Button>}
          />
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer size="lg">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Budget</p>
          <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink">Every rupee, accounted for</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Track budgets across all your journeys — then open the calculator to log spends and split them person-wise.
          </p>
        </header>

        {/* Solo / Group filters */}
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by travel style">
          {MODE_FILTERS.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setModeFilter(value)}
              aria-pressed={modeFilter === value}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95',
                modeFilter === value
                  ? 'bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                  : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
              )}
            >
              <span role="img" aria-hidden>{emoji}</span>
              {label}
              <span className={cn('rounded-full px-1.5 text-[11px] font-bold tabular-nums', modeFilter === value ? 'bg-white/25 dark:bg-espresso-950/20' : 'bg-surface-2')}>
                {value === 'solo' ? soloCount : value === 'group' ? rows.length - soloCount : rows.length}
              </span>
            </button>
          ))}
        </div>

        <section aria-label="Budget totals" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total budgets', value: formatINR(totals.budget), icon: Wallet },
            { label: 'Planned in sections', value: formatINR(totals.planned), icon: PiggyBank },
            { label: 'Spent so far', value: formatINR(totals.spent), icon: Banknote },
            { label: remaining < 0 ? 'Over budget' : 'Remaining', value: formatINR(Math.abs(remaining)), icon: TrendingDown, danger: remaining < 0 },
          ].map(({ label, value, icon: Icon, danger }) => (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
                <Icon className={cn('size-4 shrink-0', danger ? 'text-red-500' : 'text-primary')} aria-hidden />
              </div>
              <p className={cn('font-display mt-1.5 text-2xl font-semibold tabular-nums', danger ? 'text-red-500' : 'text-ink')}>
                {value}
              </p>
            </Card>
          ))}
        </section>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={modeFilter === 'solo' ? 'No solo adventures yet' : 'No group adventures yet'}
            description={
              modeFilter === 'solo'
                ? 'Pack a bag and pick a direction — a solo trip budget will live here.'
                : 'Gather your squad and plan something together.'
            }
            action={<Button to="/trips/new">Plan one now</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((row) => (
              <li key={row.id} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <Link
                  to={`/trips/${row.id}`}
                  className="block rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display font-bold text-ink">{row.name}</p>
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          row.isSolo ? 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300' : 'bg-lav-100 text-lav-600 dark:bg-lav-500/15 dark:text-lav-300',
                        )}>
                          {row.isSolo ? `🎒 Solo` : `👥 Squad of ${row.squadSize}`}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-muted">
                        {row.destination}{row.expenseCount > 0 && ` · ${row.expenseCount} logged ${row.expenseCount === 1 ? 'expense' : 'expenses'}`}
                      </p>
                    </div>
                    <div className="font-mono flex flex-wrap items-center gap-x-5 gap-y-1 text-xs tabular-nums">
                      <span className="text-ink-muted">Planned <span className="font-semibold text-ink">{formatINR(row.planned)}</span></span>
                      <span className="text-ink-muted">Spent <span className={cn('font-semibold', row.over ? 'text-red-500' : 'text-ink')}>{formatINR(row.spent)}</span></span>
                      <span className="text-ink-muted">Budget <span className="font-semibold text-ink">{formatINR(row.budget)}</span></span>
                    </div>
                  </div>
                  <div aria-hidden className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={cn('h-full rounded-full transition-all duration-300', row.over ? 'bg-red-500' : row.percent >= 75 ? 'bg-caramel-400' : 'bg-primary')}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <p className={cn('mt-1.5 text-right text-xs font-medium', row.over ? 'text-red-500' : 'text-ink-muted')}>
                    {row.percent}% of budget used
                  </p>
                </Link>
                <Link
                  to={`/trips/${row.id}/budget`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-semibold text-primary shadow-card transition-all duration-200 hover:border-primary/40 hover:bg-primary-soft hover:shadow-card-hover sm:w-44"
                  aria-label={`Open expense calculator for ${row.name}`}
                >
                  <Calculator className="size-4" aria-hidden />
                  Open calculator
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageContainer>
    </div>
  )
}
