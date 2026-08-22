import { useState } from 'react'
import { CalendarDays, Check, Eye, MapPin, Save, Users } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import Button from '../common/Button'
import Card from '../common/Card'
import Input from '../common/Input'
import { cn } from '../common/cn'
import { useUser } from '../context/user'
import { useTrips } from '../context/trips'

function formatDate(iso) {
  if (!iso) return '?'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function TripMiniList({ items, emptyText }) {
  if (items.length === 0) return <p className="text-sm text-ink-muted">{emptyText}</p>
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((trip) => (
        <li key={trip.id} className="relative overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-card">
          <span aria-hidden className={cn('absolute inset-y-0 left-0 w-1.5 bg-linear-to-b', trip.gradient)} />
          <p className="truncate pl-2 text-sm font-semibold text-ink">{trip.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 pl-2 text-xs text-ink-muted">
            <MapPin className="size-3" aria-hidden />
            {trip.destination}
          </p>
          <p className="mt-1 flex items-center gap-1.5 pl-2 text-xs text-ink-muted">
            <CalendarDays className="size-3" aria-hidden />
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default function Profile() {
  const { user, updateUser } = useUser()
  const { trips } = useTrips()
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio || '' })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const initials = (user.name || 'K')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const preplanned = trips.filter((trip) => trip.status === 'upcoming' || trip.status === 'planning')
  const previous = trips.filter((trip) => trip.status === 'completed')

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    return next
  }

  const handleSave = (event) => {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    updateUser({ name: form.name.trim(), email: form.email.trim(), bio: form.bio.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer size="md">
        <header className="mb-8">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Profile</h1>
          <p className="mt-2 text-sm text-ink-muted">How you appear across Khooshii and on shared itineraries.</p>
        </header>

        <Card className="mb-8 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-5">
            <span className="font-display flex size-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-candy-400 to-lav-400 text-2xl font-bold text-white">
              {initials}
            </span>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-display text-2xl font-semibold tabular-nums text-ink">{trips.length}</p>
                <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Trips</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold tabular-nums text-ink">{preplanned.length}</p>
                <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Preplanned</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold tabular-nums text-ink">{previous.length}</p>
                <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Completed</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} noValidate className="space-y-5">
            <Input label="Name" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }) }} error={errors.name} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: undefined }) }} error={errors.email} />
            <div>
              <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-ink">Bio</label>
              <textarea
                id="bio"
                rows={2}
                placeholder="Collecting sunsets, one city at a time."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="h-auto w-full resize-none rounded-xl border border-line bg-page px-4 py-3 text-sm text-ink transition-all placeholder:text-ink-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
                {saved ? 'Saved' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>

        <section className="mb-8">
          <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <Eye className="size-5 text-primary" aria-hidden />
            Preplanned trips
          </h2>
          <TripMiniList items={preplanned} emptyText="Nothing planned yet — your next adventure awaits." />
        </section>

        <section>
          <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-semibold text-ink">
            <Users className="size-5 text-primary" aria-hidden />
            Previous trips
          </h2>
          <TripMiniList items={previous} emptyText="No completed trips yet." />
        </section>
      </PageContainer>
    </div>
  )
}
