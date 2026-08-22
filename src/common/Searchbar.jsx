import { Search, X } from 'lucide-react'
import { cn } from './cn'

export default function Searchbar({
  value,
  onChange,
  onClear,
  placeholder = 'Search destinations, activities...',
  className = '',
}) {
  return (
    <div
      className={cn(
        'flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10',
        className,
      )}
    >
      <Search className="size-[18px] shrink-0 text-ink-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/70"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="cursor-pointer rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  )
}
