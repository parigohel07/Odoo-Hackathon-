import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/theme'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`flex size-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:border-primary/40 hover:text-primary ${className}`}
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  )
}
