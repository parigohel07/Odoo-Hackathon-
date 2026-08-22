import { cn } from '../common/cn'

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="size-7" aria-hidden />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
