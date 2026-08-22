import { Wallet } from 'lucide-react'
import Card from '../common/Card'
import { cn } from '../common/cn'

export default function BudgetSummary({ budget, spent, currency = '₹', className = '' }) {
  const remaining = budget - spent
  const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  const overBudget = remaining < 0

  const rows = [
    { label: 'Total budget', value: `${currency}${budget.toLocaleString('en-IN')}` },
    { label: 'Spent so far', value: `${currency}${spent.toLocaleString('en-IN')}` },
    {
      label: overBudget ? 'Over budget' : 'Remaining',
      value: `${currency}${Math.abs(remaining).toLocaleString('en-IN')}`,
      strong: true,
    },
  ]

  return (
    <Card className={cn('p-5', className)}>
      <h3 className="font-display flex items-center gap-2 text-base font-bold text-ink">
        <Wallet className="size-4 text-primary" aria-hidden />
        Budget summary
      </h3>

      <dl className="mt-4 space-y-2.5 text-sm">
        {rows.map(({ label, value, strong }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className={strong ? 'font-semibold text-ink' : 'text-ink-muted'}>{label}</dt>
            <dd className={cn('tabular-nums', strong ? (overBudget ? 'font-bold text-red-500' : 'font-bold text-mint-600 dark:text-mint-300') : 'font-medium text-ink')}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
          <span>{percent}% used</span>
          <span>{overBudget ? 'Over budget!' : 'On track'}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percent}% of budget spent`}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              overBudget ? 'bg-red-500' : percent >= 75 ? 'bg-caramel-400' : 'bg-primary',
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
