import { useMemo } from 'react'
import {
  ArrowLeft, Banknote, CalendarDays, MapPin, PartyPopper, RotateCcw, TrendingDown, Trophy, Users, Wallet,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import Card from '../../common/Card'
import Confetti from '../../common/Confetti'
import EmptyState from '../../common/EmptyState'
import AddExpenseForm from '../../budget/AddExpenseForm'
import CategoryBreakdown from '../../budget/CategoryBreakdown'
import ExpenseList from '../../budget/ExpenseList'
import PersonLedgerCard from '../../budget/PersonLedgerCard'
import SettlementPanel from '../../budget/SettlementPanel'
import { cn } from '../../common/cn'
import { useTrips } from '../../context/trips'
import { getCategory } from '../../data/expenseCategories'
import {
  computeCategoryTotals, computePersonLedger, formatINR, getTripMembers, simplifySettlements, sumExpenses,
} from '../../utils/budget'

function budgetMood(percent) {
  if (percent <= 0) return { text: 'Living on sunshine so far 🌞', bar: 'bg-mint-400' }
  if (percent < 50) return { text: 'Smooth sailing under budget ⛵', bar: 'bg-mint-400' }
  if (percent < 75) return { text: 'Half the treasure spent 💰', bar: 'bg-primary' }
  if (percent <= 100) return { text: 'Turbulence zone — spend wisely ✈️', bar: 'bg-caramel-400' }
  return { text: 'Mayday! Over budget 🚨', bar: 'bg-red-500' }
}

function formatDate(iso) {
  if (!iso) return '?'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function dailyAverage(trip, spent) {
  if (!trip?.startDate || !trip.endDate) return 0
  const start = new Date(`${trip.startDate}T00:00:00`)
  const end = new Date(`${trip.endDate}T00:00:00`)
  const days = Math.max(1, Math.round((end - start) / 86400000))
  return spent / days
}

export default function BudgetCalculator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, addExpense, deleteExpense, clearExpenses } = useTrips()
  const trip = trips.find((t) => t.id === id)

  // Hooks stay above the early return so hook order never changes.
  const members = useMemo(() => getTripMembers(trip), [trip])
  const expenses = useMemo(() => (Array.isArray(trip?.expenses) ? trip.expenses : []), [trip])
  const ledger = useMemo(() => computePersonLedger(members, expenses), [members, expenses])
  const transfers = useMemo(() => simplifySettlements(ledger), [ledger])
  const categoryTotals = useMemo(() => computeCategoryTotals(expenses), [expenses])

  const spent = sumExpenses(expenses)
  const budget = Number(trip?.budget) || 0
  const remaining = budget - spent
  const isSolo = !trip || trip.mode !== 'group' || members.length <= 1
  const allSquare = expenses.length > 0 && transfers.length === 0 && remaining >= 0

  if (!trip) {
    return (
      <div className="min-h-svh">
        <Navbar />
        <PageContainer>
          <EmptyState
            icon={Wallet}
            title="Trip not found"
            description="This trip may have been deleted or the link is incorrect."
            action={<Button to="/budget" variant="secondary">Back to Budget</Button>}
          />
        </PageContainer>
      </div>
    )
  }

  const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const overBudget = remaining < 0
  const perPerson = members.length > 0 ? spent / members.length : spent
  const mood = budgetMood(spent === 0 ? 0 : percent)

  // Fun badges for the person-wise cards.
  const badgesByName = new Map(members.map((name) => [name, []]))
  if (expenses.length > 0) {
    const payers = ledger.filter((p) => p.paid > 0)
    if (!isSolo && payers.length >= 2) {
      const topPayer = [...payers].sort((a, b) => b.paid - a.paid)[0]
      badgesByName.get(topPayer.name)?.push('💸 Big Wallet')
      const sharers = ledger.filter((p) => p.share > 0)
      if (sharers.length >= 2) {
        const zen = [...sharers].sort((a, b) => a.share - b.share)[0]
        if (zen.name !== topPayer.name) badgesByName.get(zen.name)?.push('🧘 Zen Spender')
      }
    }
    for (const person of ledger) {
      if (person.paid === 0 && person.share > 0) badgesByName.get(person.name)?.push('🪶 Freeloader')
    }
  }

  const biggestSpend = expenses.length > 0 ? [...expenses].sort((a, b) => b.amount - a.amount)[0] : null
  const topPayer = ledger.length > 1 ? [...ledger].sort((a, b) => b.paid - a.paid)[0] : null

  const stats = [
    { label: 'Total spent', value: formatINR(spent), icon: Banknote },
    { label: 'Trip budget', value: formatINR(budget), icon: Wallet },
    {
      label: overBudget ? 'Over budget' : 'Remaining',
      value: formatINR(Math.abs(remaining)),
      icon: TrendingDown,
      danger: overBudget,
    },
    { label: isSolo ? 'Your spend' : `Per traveller (${members.length})`, value: formatINR(perPerson), icon: Users },
  ]

  return (
    <div className="min-h-svh">
      {/* Remounts (and replays) whenever the ledger changes while everyone is square. */}
      {allSquare && <Confetti key={expenses.length} seed={expenses.length} />}

      <Navbar />
      <PageContainer size="lg">
        <button
          type="button"
          onClick={() => navigate('/budget')}
          className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Budget hub
        </button>

        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{trip.name}</h1>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong">
                {isSolo ? '🎒 Solo adventure' : `👥 Squad of ${members.length}`}
              </span>
            </div>
            {!isSolo && (
              <ul className="mt-2 flex flex-wrap gap-1">
                {members.map((member) => (
                  <li key={member} className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                    {member}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{trip.destination}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
            </p>
          </div>
          {expenses.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => clearExpenses(trip.id)}>
              <RotateCcw className="size-3.5" aria-hidden />
              Reset ledger
            </Button>
          )}
        </header>

        {/* Fuel gauge */}
        <Card className="mb-8 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, danger }) => (
              <div key={label}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold tracking-wide text-ink-muted uppercase sm:text-xs">{label}</p>
                  <Icon className={cn('size-4 shrink-0', danger ? 'text-red-500' : 'text-primary')} aria-hidden />
                </div>
                <p className={cn('font-display mt-1 text-xl font-semibold tabular-nums sm:text-2xl', danger ? 'text-red-500' : 'text-ink')}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div aria-hidden className="mt-5 h-3 w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-line">
            <div
              className={cn('h-full rounded-full transition-all duration-500', mood.bar)}
              style={{ width: `${Math.max(percent, spent > 0 ? 2 : 0)}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className={cn('font-semibold', overBudget ? 'text-red-500' : 'text-ink-muted')}>
              {percent}% of budget used · {mood.text}
            </span>
            {overBudget && <span className="font-semibold text-red-500">Blown past by {formatINR(Math.abs(remaining))}</span>}
          </div>
        </Card>

        {/* Calculator */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AddExpenseForm
              key={members.join('|')}
              members={members}
              onAdd={(expense) => addExpense(trip.id, expense)}
            />
            <ExpenseList expenses={expenses} onDelete={(expenseId) => deleteExpense(trip.id, expenseId)} />
          </div>

          <div className="space-y-6">
            <CategoryBreakdown totals={categoryTotals} />
            <Card className="p-5">
              <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
                <Trophy className="size-4 text-caramel-500" aria-hidden />
                Trip highlights
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm">
                <li className="flex items-start justify-between gap-3">
                  <span className="shrink-0 text-ink-muted">Biggest splurge</span>
                  <span className="text-right font-medium text-ink">
                    {biggestSpend ? `${getCategory(biggestSpend.category).emoji} ${biggestSpend.title}` : '—'}
                    {biggestSpend && (
                      <span className="ml-1 font-mono text-xs tabular-nums text-ink-muted">{formatINR(biggestSpend.amount)}</span>
                    )}
                  </span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="shrink-0 text-ink-muted">Top contributor</span>
                  <span className="text-right font-medium text-ink">
                    {topPayer ? `${topPayer.name} · ${formatINR(topPayer.paid)}` : '—'}
                  </span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="shrink-0 text-ink-muted">Daily average</span>
                  <span className="font-mono font-medium tabular-nums text-ink">{formatINR(dailyAverage(trip, spent))}</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Final person-wise ledger */}
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="font-display flex items-center gap-2 text-xl font-semibold text-ink">
              <PartyPopper className="size-5 text-primary" aria-hidden />
              The final ledger
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">
              Who paid what vs. who should pay what — person-wise contributions settled at trip&apos;s end.
            </p>
          </div>

          <div className={cn('grid gap-4', members.length === 1 ? 'sm:max-w-sm' : 'sm:grid-cols-2 lg:grid-cols-3')}>
            {ledger.map((person) => (
              <PersonLedgerCard key={person.name} person={person} badges={badgesByName.get(person.name) || []} />
            ))}
          </div>

          <div className={cn('mt-4', members.length === 1 && 'sm:max-w-sm')}>
            <SettlementPanel transfers={transfers} />
          </div>
        </section>
      </PageContainer>
    </div>
  )
}
