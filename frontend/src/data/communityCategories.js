export const COMMUNITY_CATEGORIES = [
  { value: 'Heritage', emoji: '🏛️' },
  { value: 'Food', emoji: '🍜' },
  { value: 'Nature', emoji: '🌿' },
  { value: 'Adventure', emoji: '🧭' },
  { value: 'Nightlife', emoji: '🌃' },
  { value: 'Relax', emoji: '🧘' },
  { value: 'Shopping', emoji: '🛍️' },
  { value: 'Culture', emoji: '🎭' },
  { value: 'Tips', emoji: '💡' },
]

const CATEGORY_MAP = new Map(COMMUNITY_CATEGORIES.map((c) => [c.value, c]))

export function getCategoryMeta(value) {
  return CATEGORY_MAP.get(value) || { value: value || 'Story', emoji: '📌' }
}

export function authorBadge(postCount) {
  if (postCount >= 6) return { label: 'Trail Legend', emoji: '🏆' }
  if (postCount >= 3) return { label: 'Storyteller', emoji: '🌟' }
  if (postCount >= 1) return { label: 'Explorer', emoji: '🥾' }
  return null
}
