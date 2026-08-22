import { Compass, MapPinned, Sparkles, Wallet } from 'lucide-react'
import ThemeToggle from '../../common/ThemeToggle'

const HIGHLIGHTS = [
  {
    icon: MapPinned,
    title: 'Day-by-day itineraries',
    text: 'Drag, drop and fine-tune every stop of your journey.',
  },
  {
    icon: Wallet,
    title: 'Budgets that behave',
    text: 'Track expenses per day and never overspend abroad.',
  },
  {
    icon: Sparkles,
    title: 'Ideas from the community',
    text: 'Browse itineraries shared by travellers like you.',
  },
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-espresso-950 lg:block">
        <div className="absolute -top-32 -left-24 size-96 rounded-full bg-candy-500/25 blur-3xl" />
        <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-lav-500/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/4 size-96 rounded-full bg-caramel-400/15 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-candy-500/30 dark:text-espresso-950">
              <Compass className="size-6" aria-hidden />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Globe<span className="text-candy-300">Trotter</span>
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="font-display text-4xl leading-tight font-bold text-white xl:text-5xl">
              Plan trips worth
              <span className="bg-linear-to-r from-candy-300 to-caramel-300 bg-clip-text text-transparent">
                {' '}
                remembering.
              </span>
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              One cozy place to design your route, split the budget and turn “someday” into boarding
              passes.
            </p>

            <ul className="mt-10 space-y-5">
              {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <Icon className="size-5 text-candy-200" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/60">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-wide text-white/40">
            Odoo x LDCE Ahmedabad Hackathon · GlobeTrotter
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-10 sm:px-8">
        <ThemeToggle className="fixed top-5 right-5 z-10" />

        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white dark:text-espresso-950">
              <Compass className="size-5" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Globe<span className="text-primary">Trotter</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 mb-8 text-sm text-ink-muted">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  )
}
