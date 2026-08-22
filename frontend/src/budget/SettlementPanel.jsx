import { ArrowRight, HandCoins } from 'lucide-react'
import Card from '../common/Card'
import { formatINR } from '../utils/budget'

export default function SettlementPanel({ transfers }) {
  return (
    <Card className="p-5">
      <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
        <HandCoins className="size-4 text-primary" aria-hidden />
        Settle up — fewest handovers
      </h3>

      {transfers.length === 0 ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-mint-100 px-4 py-3.5 dark:bg-mint-500/10">
          <span className="text-2xl" role="img">🎉</span>
          <p className="text-sm font-semibold text-mint-600 dark:text-mint-300">
            Everyone&apos;s square! Not a single rupee changes hands.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-1 text-xs text-ink-muted">The shortest route to zero debts:</p>
          <ul className="mt-3 space-y-2">
            {transfers.map(({ from, to, amount }, index) => (
              <li
                key={`${from}-${to}-${index}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <span className="truncate rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-strong">{from}</span>
                  <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
                  <span className="truncate rounded-full bg-caramel-100 px-2.5 py-1 text-xs font-semibold text-caramel-600 dark:bg-caramel-500/15 dark:text-caramel-300">{to}</span>
                </span>
                <span className="font-mono shrink-0 text-sm font-bold tabular-nums text-ink">{formatINR(amount)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
