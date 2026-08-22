import { useState } from 'react'
import { CalendarDays, Check, IndianRupee, MapPin, Plus, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import PageContainer from '../../components/layout/PageContainer'
import Button from '../../common/Button'
import Card from '../../common/Card'
import Input from '../../common/Input'
import { cn } from '../../common/cn'
import { useTrips } from '../../context/trips'

const GRADIENTS = [
  { value: 'from-candy-300 via-lav-300 to-mint-200', label: 'Sunset' },
  { value: 'from-lav-300 via-candy-200 to-caramel-200', label: 'Blossom' },
  { value: 'from-caramel-300 via-candy-300 to-lav-300', label: 'Desert' },
  { value: 'from-mint-200 via-mint-300 to-lav-300', label: 'Lagoon' },
  { value: 'from-candy-400 via-caramel-300 to-mint-200', label: 'Tropic' },
  { value: 'from-lav-400 via-mint-300 to-candy-200', label: 'Aurora' },
]

const STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'upcoming', label: 'Upcoming' },
]

export default function CreateTrip() {
  const navigate = useNavigate()
  const { addTrip } = useTrips()
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 2,
    status: 'planning',
    gradient: GRADIENTS[0].value,
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const update = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, endDate: field === 'startDate' ? undefined : prev.endDate }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Give your trip a name.'
    if (form.destination.trim().length < 2) next.destination = 'Where are you headed?'
    if (!form.startDate) next.startDate = 'Pick a start date.'
    if (!form.endDate) next.endDate = 'Pick an end date.'
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      next.endDate = 'End date cannot be before the start date.'
    const budget = Number(form.budget)
    if (!form.budget || Number.isNaN(budget) || budget <= 0) next.budget = 'Enter a budget above zero.'
    const travelers = Number(form.travelers)
    if (!travelers || travelers < 1 || travelers > 20) next.travelers = 'Between 1 and 20 travellers.'
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setSaving(true)
    try {
      addTrip({
        name: form.name.trim(),
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
        budget: Number(form.budget),
        spent: 0,
        travelers: Number(form.travelers),
        imageUrl: '',
        gradient: form.gradient,
        notes: form.notes.trim(),
      })
      navigate('/trips')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'h-11 w-full rounded-xl border bg-page text-sm text-ink transition-all placeholder:text-ink-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none'

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer size="sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Create a trip</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Sketch the basics now — days, stops and expenses come next.
            </p>
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              label="Trip name"
              placeholder="Goa Beach Escape"
              value={form.name}
              onChange={update('name')}
              error={errors.name}
            />

            <Input
              label="Destination"
              icon={MapPin}
              placeholder="Goa, India"
              value={form.destination}
              onChange={update('destination')}
              error={errors.destination}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Start date"
                type="date"
                icon={CalendarDays}
                value={form.startDate}
                min={undefined}
                onChange={update('startDate')}
                error={errors.startDate}
              />
              <Input
                label="End date"
                type="date"
                icon={CalendarDays}
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={update('endDate')}
                error={errors.endDate}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Budget (₹)"
                type="number"
                min="1"
                step="100"
                icon={IndianRupee}
                placeholder="45000"
                value={form.budget}
                onChange={update('budget')}
                error={errors.budget}
              />
              <Input
                label="Travellers"
                type="number"
                min="1"
                max="20"
                icon={Users}
                value={form.travelers}
                onChange={update('travelers')}
                error={errors.travelers}
              />
            </div>

            <div>
              <p className="mb-1.5 block text-sm font-medium text-ink">Status</p>
              <div className="flex gap-2">
                {STATUSES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: value }))}
                    aria-pressed={form.status === value}
                    className={cn(
                      'cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                      form.status === value
                        ? 'bg-primary text-white shadow-sm shadow-primary/30 dark:text-espresso-950'
                        : 'border border-line bg-surface text-ink-muted hover:border-primary/40 hover:text-primary',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 block text-sm font-medium text-ink">Cover style</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {GRADIENTS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    title={label}
                    aria-label={`Cover style ${label}`}
                    aria-pressed={form.gradient === value}
                    onClick={() => setForm((prev) => ({ ...prev, gradient: value }))}
                    className={cn(
                      'relative h-14 cursor-pointer rounded-xl border-2 transition-all active:scale-95',
                      form.gradient === value ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-line',
                      'bg-linear-to-br',
                      value,
                    )}
                  >
                    {form.gradient === value && (
                      <Check className="absolute inset-0 m-auto size-5 text-white drop-shadow" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="trip-notes" className="mb-1.5 block text-sm font-medium text-ink">
                Notes <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <textarea
                id="trip-notes"
                rows={3}
                placeholder="Beach shacks on day one, spice plantation on day two…"
                value={form.notes}
                onChange={update('notes')}
                className={cn(inputClass, 'h-auto resize-none py-3')}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" to="/trips" disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                <Plus className="size-4" aria-hidden />
                Create trip
              </Button>
            </div>
          </form>
        </Card>
      </PageContainer>
    </div>
  )
}
