import { cn } from './cn'

export default function Card({ hoverable = false, className = '', children }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-card',
        hoverable && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
    >
      {children}
    </div>
  )
}
