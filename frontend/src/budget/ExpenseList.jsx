import { Trash2, ReceiptText } from 'lucide-react'
import Card from '../common/Card'
import { getCategory } from '../data/expenseCategories'
import { formatINR } from '../utils/budget'

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 px-6 py-10 text-center">
        <span className="text-4xl" role="img">🧾</span>
        <h3 className="font-display text-base font-bold text-ink">No spends logged yet</h3>
        <p className="max-w-xs text-sm text-ink-muted">
          Every chai, cab and castle ticket counts — log your first expense above.
        </p>
      </Card>
    )
  }

  return (
    <Card className="divide-y divide-line overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5">
        <h3 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
          <ReceiptText className="size-5 text-primary" aria-hidden />
          Trip ledger
        </h3>
        <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink-muted">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </span>
      </div>
      <ul className="max-h-[26rem] divide-y divide-line overflow-y-auto">
        {[...expenses].reverse().map((expense) => {
          const category = getCategory(expense.category)
          const participants = Array.isArray(expense.participants) ? expense.participants : []
          return (
            <li key={expense.id} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-2/60">
              <span aria-hidden className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${category.tint}`}>
                {category.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{expense.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {category.label} · paid by <span className="font-medium">{expense.paidBy}</span> · split{' '}
                  {participants.length === 1
                    ? `solo (${formatINR(expense.amount)})`
                    : `${expense.splitMode === 'custom' ? 'custom' : 'equal'} among ${participants.length}`}
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-ink">
                {formatINR(expense.amount)}
              </span>
              <button
                type="button"
                onClick={() => onDelete(expense.id)}
                aria-label={`Delete ${expense.title}`}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-muted opacity-0 transition-all hover:bg-red-100 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:bg-red-500/15"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
