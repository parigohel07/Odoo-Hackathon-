import { useEffect, useState } from 'react'
import { Bell, Globe, Moon, Palette, ShieldCheck, Sun, Trash2 } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import Button from '../common/Button'
import Card from '../common/Card'
import { cn } from '../common/cn'
import { useTheme } from '../context/theme'
import { useTrips } from '../context/trips'

const NOTIFICATION_KEY = 'globetrotter-notifications'
const CURRENCY_KEY = 'globetrotter-currency'

function loadPreference(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored !== null ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { trips } = useTrips()
  const [notifications, setNotifications] = useState(() => loadPreference(NOTIFICATION_KEY, true))
  const [currency, setCurrency] = useState(() => loadPreference(CURRENCY_KEY, 'INR'))

  useEffect(() => {
    window.localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    window.localStorage.setItem(CURRENCY_KEY, JSON.stringify(currency))
  }, [currency])

  const handleClearData = () => {
    window.localStorage.removeItem('globetrotter-trips')
    window.location.reload()
  }

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer size="md">
        <header className="mb-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Settings</h1>
          <p className="mt-2 text-sm text-ink-muted">Tune GlobeTrotter to your taste. Preferences are saved on this device.</p>
        </header>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
              <Palette className="size-5 text-primary" aria-hidden />
              Appearance
            </h2>
            <p className="mt-1 text-sm text-ink-muted">Currently using {theme} mode.</p>
            <div className="mt-4 flex gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => theme !== value && toggleTheme()}
                  aria-pressed={theme === value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
                    theme === value
                      ? 'bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                      : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
              <Bell className="size-5 text-primary" aria-hidden />
              Notifications
            </h2>
            <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-page px-4 py-3">
              <span className="text-sm font-medium text-ink">Trip reminders and budget alerts</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
                className="size-4 cursor-pointer accent-candy-500"
              />
            </label>
          </Card>

          <Card className="p-6">
            <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
              <Globe className="size-5 text-primary" aria-hidden />
              Region &amp; currency
            </h2>
            <label htmlFor="currency" className="mt-4 block text-sm font-medium text-ink">
              Preferred currency for new budgets
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="mt-1.5 w-full max-w-xs rounded-xl border border-line bg-page px-3 py-2.5 text-sm text-ink focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
            >
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </Card>

          <Card className="border-red-500/30 p-6 dark:border-red-500/40">
            <h2 className="font-display flex items-center gap-2 text-lg font-bold text-ink">
              <ShieldCheck className="size-5 text-red-500" aria-hidden />
              Danger zone
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Remove all {trips.length} saved trip{trips.length === 1 ? '' : 's'} from this device. This cannot be undone.
            </p>
            <div className="mt-4">
              <Button variant="danger" onClick={handleClearData}>
                <Trash2 className="size-4" aria-hidden />
                Clear all trips
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  )
}
