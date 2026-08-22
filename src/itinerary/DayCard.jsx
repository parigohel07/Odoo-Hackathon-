import { CalendarDays } from 'lucide-react'
import Card from '../common/Card'
import { cn } from '../common/cn'

function formatDayDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

export default function DayCard({ day, children, className = '' }) {
  const { dayNumber, date, title, items = [] } = day

  return (
    <Card className={cn('p-5', className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            <CalendarDays className="size-3.5" aria-hidden />
            Day {dayNumber} · {formatDayDate(date)}
          </p>
          <h3 className="font-display mt-1 text-base font-bold text-ink">{title || `Day ${dayNumber}`}</h3>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-muted">
            {items.length} {items.length === 1 ? 'stop' : 'stops'}
          </span>
        )}
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2.5">{children}</ul>
      ) : (
        <p className="text-sm text-ink-muted">Nothing planned yet — add your first stop.</p>
      )}
    </Card>
  )
}
