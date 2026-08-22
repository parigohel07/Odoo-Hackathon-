import { useMemo } from 'react'
import { Banknote, PiggyBank, TrendingDown, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import Button from '../common/Button'
import { cn } from '../common/cn'
import { useTrips } from '../context/trips'

export default function Budget() {
  const { trips } = useTrips()

  const rows = useMemo(
    () =>
      trips.map((trip) => {
        const sections = trip.sections || []
        const planned = sections.reduce((sum, s) => sum + (Number(s.budget) || 0), 0)
        const spent = Number(trip.spent) || 0
        const budget = Number(trip.budget) || 0
        return {
          id: trip.id,
          name: trip.name,
          destination: trip.destination,
          budget,
          spent,
          planned,
          percent: budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0,
          over: spent > budget && budget > 0,
        }
      }),
    [trips],
  )

  const totals = rows.reduce(
    (acc, row) => ({
      budget: acc.budget + row.budget,
      spent: acc.spent + row.spent,
      planned: acc.planned + row.planned,
    }),
    { budget: 0, spent: 0, planned: 0 },
  )
  const remaining = totals.budget - totals.spent

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
      <PageContainer>
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Budget</p>
          <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink">Every rupee, accounted for</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            A combined view of budgets, section plans and spending across all your journeys.
          </p>
        </header>

        <section aria-label="Budget totals" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total budgets', value: totals.budget, icon: Wallet },
            { label: 'Planned in sections', value: totals.planned, icon: PiggyBank },
            { label: 'Spent so far', value: totals.spent, icon: Banknote },
            { label: remaining < 0 ? 'Over budget' : 'Remaining', value: Math.abs(remaining), icon: TrendingDown, danger: remaining < 0 },
          ].map(({ label, value, icon: Icon, danger }) => (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
                <Icon className={cn('size-4 shrink-0', danger ? 'text-red-500' : 'text-primary')} aria-hidden />
              </div>
              <p className={cn('font-display mt-1.5 text-2xl font-semibold tabular-nums', danger ? 'text-red-500' : 'text-ink')}>
                ₹{value.toLocaleString('en-IN')}
              </p>
            </Card>
          ))}
        </section>

        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                to={`/trips/${row.id}`}
                className="block rounded-2xl border border-line bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                  <div>
                    <p className="font-display font-bold text-ink">{row.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{row.destination}</p>
                  </div>
                  <div className="font-mono flex flex-wrap items-center gap-x-5 gap-y-1 text-xs tabular-nums">
                    <span className="text-ink-muted">Planned <span className="font-semibold text-ink">₹{row.planned.toLocaleString('en-IN')}</span></span>
                    <span className="text-ink-muted">Spent <span className={cn('font-semibold', row.over ? 'text-red-500' : 'text-ink')}>₹{row.spent.toLocaleString('en-IN')}</span></span>
                    <span className="text-ink-muted">Budget <span className="font-semibold text-ink">₹{row.budget.toLocaleString('en-IN')}</span></span>
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
            </li>
          ))}
        </ul>
      </PageContainer>
    </div>
  )
}
