import { CalendarDays, MapPin, Trash2, Users } from 'lucide-react'
import Card from '../common/Card'
import { cn } from '../common/cn'

const STATUS_STYLES = {
  upcoming: 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300',
  planning: 'bg-lav-100 text-lav-600 dark:bg-lav-500/15 dark:text-lav-300',
  completed: 'bg-surface-2 text-ink-muted',
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function TripCard({ trip, onDelete, className = '' }) {
  const { name, destination, startDate, endDate, status, budget, spent, travelers, imageUrl, gradient } =
    trip
  const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0

  return (
    <Card hoverable className={cn('overflow-hidden', className)}>
      <div className="relative h-40 w-full">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="size-full object-cover" loading="lazy" />
        ) : (
          <div aria-hidden className={cn('size-full bg-linear-to-br', gradient)} />
        )}
        <span
          className={cn(
            'absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold capitalize backdrop-blur-sm',
            STATUS_STYLES[status] || STATUS_STYLES.completed,
          )}
        >
          {status}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">{name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {destination}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            {formatDate(startDate)} – {formatDate(endDate)}
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              {travelers}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete ${name}`}
                title="Delete trip"
                className="cursor-pointer rounded-lg p-1 text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            )}
          </span>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-muted">Budget</span>
            <span className="font-semibold text-ink">
              ₹{spent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${percent}% of budget used`}
              className={cn(
                'h-full rounded-full transition-all duration-300',
                percent >= 95 ? 'bg-red-500' : percent >= 75 ? 'bg-caramel-400' : 'bg-primary',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
