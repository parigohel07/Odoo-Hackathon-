import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from './cn'

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-strong active:scale-[0.98] dark:text-espresso-950',
  secondary:
    'bg-primary-soft text-primary-strong hover:brightness-97 active:scale-[0.98]',
  outline:
    'border border-line bg-surface text-ink hover:border-primary/40 hover:text-primary active:scale-[0.98]',
  ghost: 'text-ink-muted hover:bg-primary-soft hover:text-primary',
  danger: 'bg-red-500 text-white shadow-sm shadow-red-500/30 hover:bg-red-600 active:scale-[0.98]',
}

const SIZES = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  to,
  className = '',
  children,
  disabled,
  ...props
}) {
  const classes = cn(
    'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60',
    VARIANTS[variant],
    SIZES[size],
    className,
  )

  const content = (
    <>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}
