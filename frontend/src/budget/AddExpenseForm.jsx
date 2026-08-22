import { useState } from 'react'
import { CircleAlert, Equal, SlidersHorizontal, Sparkles } from 'lucide-react'
import Button from '../common/Button'
import Card from '../common/Card'
import { EXPENSE_CATEGORIES } from '../data/expenseCategories'
import { formatINR } from '../utils/budget'
import { cn } from '../common/cn'

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: 'food',
  splitMode: 'equal',
}

export default function AddExpenseForm({ members, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [paidBy, setPaidBy] = useState(members[0] ?? '')
  const [participants, setParticipants] = useState(() => new Set(members))
  const [customShares, setCustomShares] = useState({})
  const [errors, setErrors] = useState({})

  // Guard against renamed/removed members.
  const payer = members.includes(paidBy) ? paidBy : (members[0] ?? '')
  const activeMembers = members.filter((member) => participants.has(member))
  const amount = Number(form.amount) || 0
  const customTotal = activeMembers.reduce((sum, member) => sum + (Number(customShares[member]) || 0), 0)

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const toggleParticipant = (member) => {
    setParticipants((prev) => {
      const next = new Set(prev)
      if (next.has(member)) next.delete(member)
      else next.add(member)
      return next
    })
  }

  const setShare = (member, value) => {
    setCustomShares((prev) => ({ ...prev, [member]: value }))
    setErrors((prev) => ({ ...prev, customShares: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'What was this for?'
    if (!(amount > 0)) next.amount = 'Enter an amount above zero.'
    if (activeMembers.length === 0) next.participants = 'Pick at least one person.'
    if (form.splitMode === 'custom' && Math.abs(customTotal - amount) > 0.5) {
      next.customShares = `Custom shares must add up to ${formatINR(amount)} (currently ${formatINR(customTotal)}).`
    }
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    onAdd({
      title: form.title.trim(),
      amount,
      category: form.category,
      paidBy: payer,
      participants: activeMembers,
      splitMode: form.splitMode,
      customShares:
        form.splitMode === 'custom'
          ? Object.fromEntries(activeMembers.map((m) => [m, Number(customShares[m]) || 0]))
          : {},
    })
    setForm((prev) => ({ ...EMPTY_FORM, category: prev.category }))
    setParticipants(new Set(members))
    setCustomShares({})
    setErrors({})
  }

  const inputClass =
    'h-11 w-full rounded-xl border bg-page text-sm text-ink transition-all placeholder:text-ink-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none'

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
        <Sparkles className="size-5 text-primary" aria-hidden />
        Log a spend
      </h3>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
          <div className="space-y-1.5">
            <input
              aria-label="Expense title"
              placeholder="Beach shack dinner, rickshaw ride…"
              value={form.title}
              onChange={update('title')}
              className={cn(inputClass, errors.title ? 'border-red-400' : 'border-line')}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                {errors.title}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-ink-muted">₹</span>
              <input
                type="number"
                min="0"
                step="10"
                aria-label="Amount"
                placeholder="0"
                value={form.amount}
                onChange={update('amount')}
                className={cn(inputClass, 'pr-4 pl-7', errors.amount ? 'border-red-400' : 'border-line')}
              />
            </div>
            {errors.amount && (
              <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">Category</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Expense category">
            {EXPENSE_CATEGORIES.map(({ value, label, emoji, tint }) => (
              <button
                key={value}
                type="button"
                title={label}
                aria-pressed={form.category === value}
                onClick={() => setForm((prev) => ({ ...prev, category: value }))}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95',
                  form.category === value
                    ? cn(tint, 'ring-2 ring-primary/40')
                    : 'border border-line bg-surface text-ink-muted hover:border-primary/40',
                )}
              >
                <span role="img">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="paid-by" className="block text-sm font-medium text-ink">Paid by</label>
            <select
              id="paid-by"
              value={payer}
              onChange={(event) => setPaidBy(event.target.value)}
              className={cn(inputClass, 'cursor-pointer appearance-none border-line')}
            >
              {members.map((member) => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-ink">Split</p>
            <div className="flex gap-2">
              {[
                { value: 'equal', label: 'Equal', icon: Equal },
                { value: 'custom', label: 'Custom', icon: SlidersHorizontal },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, splitMode: value }))}
                  aria-pressed={form.splitMode === value}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all active:scale-95',
                    form.splitMode === value
                      ? 'bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                      : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Split between</p>
            <div className="flex gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setParticipants(new Set(members))}
                className="cursor-pointer rounded-full px-2 py-1 text-primary hover:bg-primary-soft"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setParticipants(new Set())}
                className="cursor-pointer rounded-full px-2 py-1 text-ink-muted hover:bg-surface-2"
              >
                None
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => {
              const active = participants.has(member)
              return (
                <button
                  key={member}
                  type="button"
                  onClick={() => toggleParticipant(member)}
                  aria-pressed={active}
                  className={cn(
                    'cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95',
                    active
                      ? 'bg-mint-100 text-mint-600 ring-1 ring-mint-400 dark:bg-mint-500/15 dark:text-mint-300'
                      : 'border border-line bg-surface text-ink-muted opacity-60 hover:opacity-100',
                  )}
                >
                  {active ? '✓ ' : ''}{member}
                </button>
              )
            })}
          </div>
          {errors.participants && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden />
              {errors.participants}
            </p>
          )}
        </div>

        {form.splitMode === 'custom' && (
          <div className="space-y-2 rounded-xl bg-surface-2 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
              <span>Exact amounts per person</span>
              <span className={cn(amount > 0 && Math.abs(customTotal - amount) <= 0.5 && 'text-mint-600 dark:text-mint-300')}>
                {formatINR(customTotal)} / {formatINR(amount)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {members.map((member) => {
                const included = participants.has(member)
                return (
                  <label key={member} className={cn('block rounded-lg bg-surface px-2.5 py-1.5', !included && 'opacity-40')}>
                    <span className="block truncate text-[11px] font-medium text-ink-muted">{member}</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      disabled={!included}
                      value={customShares[member] ?? ''}
                      onChange={(event) => setShare(member, event.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-sm font-semibold tabular-nums text-ink outline-none"
                    />
                  </label>
                )
              })}
            </div>
            {errors.customShares && (
              <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                {errors.customShares}
              </p>
            )}
          </div>
        )}

        <Button type="submit">
          Add expense
        </Button>
      </form>
    </Card>
  )
}
