import { cn } from '../common/cn'

export default function ItineraryItem({ item, className = '' }) {
  const { time, title, note, location, cost } = item

  return (
    <li
      className={cn(
        'flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-primary/40',
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 rounded-lg bg-primary-soft px-2 py-1 text-xs font-semibold text-primary-strong">
        {time}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        {location && <p className="mt-0.5 truncate text-xs text-ink-muted">{location}</p>}
        {note && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">{note}</p>}
      </div>

      {typeof cost === 'number' && (
        <span className="shrink-0 text-xs font-semibold text-ink">₹{cost.toLocaleString('en-IN')}</span>
      )}
    </li>
  )
}
