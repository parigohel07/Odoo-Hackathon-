import { Heart, MapPin } from 'lucide-react'
import { cn } from '../common/cn'

export default function DestinationCard({ destination, className = '' }) {
  const { name, country, imageUrl, gradient, tags = [] } = destination

  return (
    <article
      className={cn(
        'group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl border border-line shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name}, ${country}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div aria-hidden className={cn('size-full bg-linear-to-br transition-transform duration-300 group-hover:scale-105', gradient)} />
      )}

      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-espresso-950/80 via-espresso-950/10 to-transparent" />

      <button
        type="button"
        aria-label={`Save ${name} to favourites`}
        onClick={(event) => event.preventDefault()}
        className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35"
      >
        <Heart className="size-4" aria-hidden />
      </button>

      <div className="absolute right-4 bottom-4 left-4">
        <h3 className="flex items-center gap-1.5 font-display text-lg font-bold text-white">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {name}
        </h3>
        <p className="mt-0.5 text-sm text-white/70">{country}</p>
        {tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
