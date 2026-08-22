import { useEffect, useState } from 'react'
import { Compass, MapPinned, Plane, Sparkles, Wallet } from 'lucide-react'
import ThemeToggle from '../../common/ThemeToggle'

const HIGHLIGHTS = [
  { icon: MapPinned, label: 'Day-by-day itineraries' },
  { icon: Wallet, label: 'Budgets that behave' },
  { icon: Sparkles, label: 'Ideas from travellers' },
]

const DESTINATIONS = [
  { name: 'Kyoto', flag: '🌸' },
  { name: 'Reykjavík', flag: '🌋' },
  { name: 'Marrakech', flag: '🐪' },
  { name: 'Queenstown', flag: '🏔️' },
  { name: 'Santorini', flag: '🌊' },
  { name: 'Rio de Janeiro', flag: '🌴' },
]

const FLOATING_CHIPS = [
  { label: 'Paris', flag: '🗼', position: 'left-[5%] top-[16%]', animation: 'animate-floaty' },
  { label: 'Kyoto', flag: '⛩️', position: 'right-[6%] top-[24%]', animation: 'animate-floaty-delayed' },
  { label: 'Bali', flag: '🏝️', position: 'left-[8%] bottom-[20%]', animation: 'animate-floaty-delayed' },
  { label: 'Andes', flag: '🦙', position: 'right-[8%] bottom-[26%]', animation: 'animate-floaty' },
]

function useBoardingTicker() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % DESTINATIONS.length), 2800)
    return () => clearInterval(timer)
  }, [])
  return DESTINATIONS[index]
}

function FlightPath() {
  return (
    <svg
      viewBox="0 0 600 300"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 hidden h-[42vh] w-full md:block"
      aria-hidden
    >
      <path
        id="auth-flight-path"
        d="M -40 270 C 140 200, 300 40, 660 80"
        fill="none"
        strokeWidth="2"
        strokeDasharray="2 12"
        strokeLinecap="round"
        className="stroke-lav-400/50 dark:stroke-espresso-300/30"
      />
      <g fill="currentColor" className="text-lav-500/70 dark:text-espresso-300/45">
        <polygon points="0,-7 16,0 0,7 4,0" />
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
          <mpath href="#auth-flight-path" />
        </animateMotion>
      </g>
    </svg>
  )
}

export default function AuthLayout({ title, subtitle, children }) {
  const boarding = useBoardingTicker()

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-page px-4 py-10 sm:px-8">
      {/* sky backdrop */}
      <div aria-hidden className="absolute inset-0 bg-linear-to-br from-lav-100/70 via-transparent to-caramel-100/60 dark:from-lav-500/15 dark:via-transparent dark:to-caramel-500/15" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-lav-400)_1px,transparent_0)] bg-[size:28px_28px] opacity-25 dark:bg-[radial-gradient(circle_at_1px_1px,var(--color-espresso-300)_1px,transparent_0)] dark:opacity-15"
      />

      {/* glow blobs */}
      <div aria-hidden className="absolute -top-32 -left-24 size-96 rounded-full bg-lav-400/30 blur-3xl motion-reduce:animate-none dark:bg-lav-500/20" />
      <div aria-hidden className="absolute -bottom-28 -right-20 size-96 rounded-full bg-caramel-300/35 blur-3xl motion-reduce:animate-none dark:bg-caramel-500/15" />

      {/* drifting clouds */}
      <div aria-hidden className="absolute left-0 top-[22%] h-7 w-44 rounded-full bg-white/80 blur-xl animate-drift motion-reduce:hidden dark:bg-espresso-700/40" />
      <div aria-hidden className="absolute left-0 top-[58%] h-9 w-56 rounded-full bg-white/70 blur-xl animate-drift-fast motion-reduce:hidden dark:bg-espresso-700/30" />
      <div aria-hidden className="absolute left-0 top-[36%] h-6 w-36 rounded-full bg-lav-200/70 blur-lg animate-drift [animation-delay:-14s] motion-reduce:hidden dark:bg-lav-500/20" />

      <FlightPath />

      {/* floating destination chips */}
      {FLOATING_CHIPS.map(({ label, flag, position, animation }) => (
        <span
          key={label}
          aria-hidden
          className={`absolute hidden items-center gap-1.5 rounded-full border border-white/70 bg-white/55 px-3.5 py-1.5 text-xs font-semibold text-ink shadow-card backdrop-blur-md lg:flex ${position} ${animation} motion-reduce:animate-none dark:border-white/10 dark:bg-white/5`}
        >
          <span className="text-sm">{flag}</span>
          {label}
        </span>
      ))}

      <ThemeToggle className="fixed top-5 right-5 z-10" />

      {/* glass boarding pass */}
      <main className="relative z-10 w-full max-w-md">
        <div className="rounded-[28px] border border-white/70 bg-white/60 p-7 shadow-[0_24px_70px_-24px_rgb(143_108_228/0.45)] backdrop-blur-2xl sm:p-9 dark:border-white/10 dark:bg-espresso-900/55 dark:shadow-[0_24px_70px_-24px_rgb(0_0_0/0.65)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-lav-400 to-lav-600 text-white shadow-lg shadow-lav-500/30">
                <Compass className="size-6 animate-spin-slow motion-reduce:animate-none" aria-hidden />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink">
                Globe<span className="text-primary">Trotter</span>
              </span>
            </div>
            <span className="rounded-full border border-dashed border-line px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.18em] text-ink-muted uppercase">
              Boarding pass
            </span>
          </div>

          {/* perforation */}
          <div className="relative -mx-7 mt-6 sm:-mx-9" aria-hidden>
            <div className="border-t-2 border-dashed border-line" />
            <span className="absolute -top-3 -left-3.5 size-6 rounded-full bg-page ring-1 ring-line" />
            <span className="absolute -top-3 -right-3.5 size-6 rounded-full bg-page ring-1 ring-line" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-[10px] tracking-[0.14em] text-ink-muted uppercase">
            <div>
              <p className="opacity-70">Flight</p>
              <p className="mt-0.5 text-[11px] font-bold text-ink">GT·2026</p>
            </div>
            <div>
              <p className="opacity-70">Gate</p>
              <p className="mt-0.5 text-[11px] font-bold text-ink">Wanderlust</p>
            </div>
            <div>
              <p className="opacity-70">Seat</p>
              <p className="mt-0.5 text-[11px] font-bold text-ink">1A · Window</p>
            </div>
          </div>

          <h1 className="font-display mt-7 text-3xl font-bold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 mb-7 text-sm leading-relaxed text-ink-muted">{subtitle}</p>

          {children}

          <p className="mt-7 flex items-center justify-center gap-2 border-t border-line pt-4 text-xs text-ink-muted">
            <Plane className="size-3.5 text-primary" aria-hidden />
            Now boarding:
            <span key={boarding.name} className="inline-block font-semibold text-ink animate-ticker-in">
              {boarding.flag} {boarding.name}
            </span>
          </p>
        </div>

        {/* feature strip */}
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/45 px-3 py-1.5 text-xs font-medium text-ink-muted backdrop-blur-md dark:border-white/10 dark:bg-white/5"
            >
              <Icon className="size-3.5 text-primary" aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-center text-[11px] tracking-wide text-ink-muted/80">
          Odoo x LDCE Ahmedabad Hackathon · GlobeTrotter
        </p>
      </main>
    </div>
  )
}
