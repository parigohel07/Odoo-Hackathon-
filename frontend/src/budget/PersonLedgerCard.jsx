import Card from '../common/Card'
import { formatINR } from '../utils/budget'
import { gradientFor, initialsOf } from '../utils/avatar'
import { cn } from '../common/cn'

export default function PersonLedgerCard({ person, badges = [] }) {
  const settled = Math.abs(person.balance) < 1
  const getsBack = person.balance > 0
  const barMax = Math.max(person.paid, person.share, 1)
  const paidWidth = (person.paid / barMax) * 100
  const shareWidth = (person.share / barMax) * 100

  return (
    <Card hoverable className="flex h-full flex-col p-5">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-sm font-bold text-white shadow-sm ${gradientFor(person.name)}`}>
          {initialsOf(person.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display font-bold text-ink">{person.name}</p>
          {badges.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-ink-muted">{badges.join(' · ')}</p>
          )}
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-muted">Paid 💸</dt>
          <dd className="font-mono font-semibold tabular-nums text-ink">{formatINR(person.paid)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-muted">Fair share 🧾</dt>
          <dd className="font-mono font-semibold tabular-nums text-ink">{formatINR(person.share)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line pt-2">
          <dt className={cn('font-semibold', settled ? 'text-ink' : getsBack ? 'text-mint-600 dark:text-mint-300' : 'text-red-500')}>
            {settled ? 'Settled ✅' : getsBack ? 'Gets back 💰' : 'Owes the pot 😅'}
          </dt>
          <dd
            className={cn(
              'font-display text-lg font-bold tabular-nums',
              settled ? 'text-ink' : getsBack ? 'text-mint-600 dark:text-mint-300' : 'text-red-500',
            )}
          >
            {settled ? formatINR(0) : formatINR(person.balance, { sign: true })}
          </dd>
        </div>
      </dl>

      {!settled && (
        <div className="mt-3" aria-hidden>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="absolute inset-y-0 left-0 bg-primary/70" style={{ width: `${paidWidth}%` }} />
            <div
              className="absolute inset-y-0 left-0 border-r-2 border-dashed border-page"
              style={{ width: `${Math.min(paidWidth + shareWidth, 100)}%`, background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgb(232 172 96 / 0.55) 6px, rgb(232 172 96 / 0.55) 12px)' }}
            />
          </div>
          <p className="mt-1.5 flex justify-between text-[11px] text-ink-muted">
            <span>■ paid</span>
            <span>▨ owes</span>
          </p>
        </div>
      )}
    </Card>
  )
}
