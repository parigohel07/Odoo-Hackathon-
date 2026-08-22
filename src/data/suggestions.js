export function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const TEMPLATES = [
  (p) => [`${p} Old Town Walking Tour`, 'Heritage'],
  (p) => [`${p} Local Food Market`, 'Food'],
  (p) => [`${p} Sunset Viewpoint`, 'Nature'],
  (p) => [`${p} Heritage Museum`, 'Heritage'],
  (p) => [`${p} Adventure Day Trip`, 'Adventure'],
  (p) => [`${p} Nightlife District`, 'Nightlife'],
  (p) => [`${p} Riverside Walk`, 'Relax'],
  (p) => [`${p} Handicraft Bazaar`, 'Shopping'],
  (p) => [`${p} Rooftop Cafe Hop`, 'Food'],
  (p) => [`${p} Nature Reserve Hike`, 'Nature'],
  (p) => [`${p} Old Fort Ruins`, 'Heritage'],
  (p) => [`${p} Street Art District`, 'Culture'],
]

export const TRENDING_PLACES = ['Goa', 'Kyoto', 'Reykjavik', 'Cape Town', 'Lisbon', 'Ubud']

export const ACTIVITY_CATEGORIES = [...new Set(TEMPLATES.map((t) => t('x')[1]))].sort()

export function generateSuggestions(place, count = 6, category = null) {
  const clean = (place || '').trim()
  if (!clean) return []
  let pool = TEMPLATES
  if (category && category !== 'all') {
    const filtered = TEMPLATES.filter((t) => t('x')[1] === category)
    if (filtered.length > 0) pool = filtered
  }
  const rand = seededRandom(hashString(`${clean}:${category || 'any'}`.toLowerCase()))
  const shuffled = [...pool].sort(() => rand() - 0.5).slice(0, count)
  return shuffled.map((templateFn, i) => {
    const [name, cat] = templateFn(clean)
    return {
      id: `${clean}-${cat}-${i}`.toLowerCase().replace(/\s+/g, '-'),
      name,
      category: cat,
      cost: Math.round((200 + rand() * 3000) / 50) * 50,
      rating: Math.round((3.6 + rand() * 1.4) * 10) / 10,
      duration: Math.round((1 + rand() * 4) * 10) / 10,
      place: clean,
    }
  })
}

export function mapEmbedUrl(placeNames) {
  const names = placeNames.filter(Boolean)
  if (names.length === 0) return null
  if (names.length === 1) return `https://www.google.com/maps?q=${encodeURIComponent(names[0])}&output=embed`
  return `https://www.google.com/maps/dir/${names.map(encodeURIComponent).join('/')}?output=embed`
}
