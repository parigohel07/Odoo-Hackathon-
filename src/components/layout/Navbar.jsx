import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, Compass, Home, Luggage, LogOut, Map, Menu, Search, Settings, Users, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from '../../common/ThemeToggle'
import { cn } from '../../common/cn'
import { useUser } from '../../context/user'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/trips', label: 'My Trips', icon: Luggage },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/budget', label: 'Budget', icon: Map },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useUser()

  const initials = (user.name || 'K')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const linkClasses = ({ isActive }) =>
    cn(
      'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-soft text-primary-strong'
        : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
    )

  const handleLogout = () => {
    setProfileOpen(false)
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950">
            <Compass className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Globe<span className="text-primary">Trotter</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClasses}>
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="relative hidden md:block" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-3 pl-1.5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-candy-400 to-lav-400 text-xs font-bold text-white">
                {initials}
              </span>
              <ChevronDown
                className={cn('size-4 text-ink-muted transition-transform', profileOpen && 'rotate-180')}
                aria-hidden
              />
            </button>
            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-card-hover"
              >
                <div className="border-b border-line px-4 py-2.5">
                  <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                  <p className="truncate text-xs text-ink-muted">{user.email}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigate('/profile')}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-2"
                >
                  <Users className="size-4 text-ink-muted" aria-hidden />
                  View profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigate('/settings')}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface-2"
                >
                  <Settings className="size-4 text-ink-muted" aria-hidden />
                  Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-surface-2"
                >
                  <LogOut className="size-4" aria-hidden />
                  Log out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted transition-colors hover:border-primary/40 hover:text-primary md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-page px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={linkClasses}>
                <Icon className="size-4" aria-hidden />
                {label}
              </NavLink>
            ))}
            <div className="my-2 border-t border-line" />
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <Users className="size-4" aria-hidden />
              Profile
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <Settings className="size-4" aria-hidden />
              Settings
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-surface-2"
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
