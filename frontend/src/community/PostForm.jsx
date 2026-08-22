import { useState } from 'react'
import { CircleAlert, Send, Users } from 'lucide-react'
import Button from '../common/Button'
import { COMMUNITY_CATEGORIES } from '../data/communityCategories'
import { cn } from '../common/cn'

export default function PostForm({ initial, submitLabel = 'Post to community', onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    place: initial?.place || '',
    category: initial?.category || COMMUNITY_CATEGORIES[0].value,
    content: initial?.content || '',
    buddyWanted: Boolean(initial?.buddyWanted),
  })
  const [errors, setErrors] = useState({})

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (form.title.trim().length < 4) next.title = 'Give it a proper headline.'
    if (form.place.trim().length < 2) next.place = 'Where did this happen?'
    if (form.content.trim().length < 10) next.content = 'Tell us a bit more (at least 10 characters).'
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    onSubmit({
      title: form.title.trim(),
      place: form.place.trim(),
      category: form.category,
      content: form.content.trim(),
      buddyWanted: form.buddyWanted,
    })
  }

  const inputClass =
    'w-full rounded-xl border bg-page px-3.5 py-2.5 text-sm text-ink transition-all placeholder:text-ink-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">Title</label>
          <input
            placeholder="e.g. Sunrise trek up Mt Batur"
            value={form.title}
            onChange={update('title')}
            className={cn(inputClass, errors.title ? 'border-red-400' : 'border-line')}
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden />
              {errors.title}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">Place</label>
          <input
            placeholder="e.g. Bali, Indonesia"
            value={form.place}
            onChange={update('place')}
            className={cn(inputClass, errors.place ? 'border-red-400' : 'border-line')}
          />
          {errors.place && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-500">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden />
              {errors.place}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">Category</label>
          <select value={form.category} onChange={update('category')} className={cn(inputClass, 'cursor-pointer border-line appearance-none')}>
            {COMMUNITY_CATEGORIES.map(({ value, emoji }) => (
              <option key={value} value={value}>{emoji} {value}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">Vibe check</label>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, buddyWanted: !prev.buddyWanted }))}
            aria-pressed={form.buddyWanted}
            className={cn(
              'flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98]',
              form.buddyWanted
                ? 'border-lav-300 bg-lav-100 text-lav-600 dark:bg-lav-500/15 dark:text-lav-300'
                : 'border-line bg-surface text-ink-muted hover:border-lav-300/60 hover:text-lav-500',
            )}
          >
            <Users className="size-4" aria-hidden />
            {form.buddyWanted ? '👋 Looking for travel buddies!' : 'Just sharing — no buddies needed'}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">Your experience</label>
        <textarea
          rows={4}
          placeholder="What did you do, what should other travelers know…"
          value={form.content}
          onChange={update('content')}
          className={cn(inputClass, 'resize-none', errors.content ? 'border-red-400' : 'border-line')}
        />
        {errors.content && (
          <p className="flex items-center gap-1 text-xs font-medium text-red-500">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden />
            {errors.content}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          <Send className="size-4" aria-hidden />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
