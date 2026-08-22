import { CircleAlert } from 'lucide-react'
import { cn } from './cn'

export default function Input({
  label,
  icon: Icon,
  trailing,
  error,
  id,
  className = '',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/[^a-z]+/g, '-')

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-ink-muted"
            aria-hidden
          />
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-11 w-full rounded-xl border bg-page text-sm text-ink transition-all placeholder:text-ink-muted/70',
            'focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none',
            Icon ? 'pl-10' : 'pl-4',
            trailing ? 'pr-11' : 'pr-4',
            error ? 'border-red-400 dark:border-red-500/60' : 'border-line',
          )}
          {...props}
        />
        {trailing && <div className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</div>}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}
