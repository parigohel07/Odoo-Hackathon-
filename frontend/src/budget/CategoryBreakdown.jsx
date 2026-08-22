import { ChartPie } from 'lucide-react'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import { getCategory } from '../data/expenseCategories'
import { formatINR } from '../utils/budget'

export default function CategoryBreakdown({ totals }) {
  const total = totals.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <Card className="p-5">
      <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
        <ChartPie className="size-4 text-primary" aria-hidden />
        Where the money went
      </h3>

      {totals.length === 0 ? (
        <EmptyState icon={ChartPie} title="Nothing to slice yet" description="Log expenses and watch the categories fill up." className="px-0 py-8" />
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {totals.map(({ value, amount }) => {
              const category = getCategory(value)
              const percent = total > 0 ? Math.round((amount / total) * 100) : 0
              return (
                <li key={value}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-1.5 font-medium text-ink">
                      <span role="img" aria-hidden>{category.emoji}</span>
                      <span className="truncate">{category.label}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-ink-muted">
                      {formatINR(amount)} · {percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={category.tint.includes('candy')
                        ? 'h-full rounded-full bg-candy-400'
                        : category.tint.includes('lav')
                          ? 'h-full rounded-full bg-lav-400'
                          : category.tint.includes('mint')
                            ? 'h-full rounded-full bg-mint-400'
                            : category.tint.includes('caramel')
                              ? 'h-full rounded-full bg-caramel-400'
                              : 'h-full rounded-full bg-espresso-300'}
                      style={{ width: `${Math.max(percent, 3)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 rounded-xl bg-primary-soft px-3 py-2.5 text-xs font-medium text-primary-strong">
            🏆 Top spend this trip: {getCategory(totals[0].value).emoji} {getCategory(totals[0].value).label} — no regrets, only memories.
          </p>
        </>
      )}
    </Card>
  )
}
