export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food & Drinks', emoji: '🍜', tint: 'bg-candy-100 text-candy-600 dark:bg-candy-500/15 dark:text-candy-300' },
  { value: 'transport', label: 'Transport', emoji: '🚕', tint: 'bg-lav-100 text-lav-600 dark:bg-lav-500/15 dark:text-lav-300' },
  { value: 'stay', label: 'Stay', emoji: '🏨', tint: 'bg-mint-100 text-mint-600 dark:bg-mint-500/15 dark:text-mint-300' },
  { value: 'tickets', label: 'Entry Fees', emoji: '🎟️', tint: 'bg-caramel-100 text-caramel-600 dark:bg-caramel-500/15 dark:text-caramel-300' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️', tint: 'bg-candy-100 text-candy-700 dark:bg-candy-500/15 dark:text-candy-200' },
  { value: 'fun', label: 'Fun & Adventure', emoji: '🎡', tint: 'bg-lav-100 text-lav-500 dark:bg-lav-500/15 dark:text-lav-200' },
  { value: 'other', label: 'Other', emoji: '✨', tint: 'bg-surface-2 text-ink-muted' },
]

const CATEGORY_MAP = new Map(EXPENSE_CATEGORIES.map((c) => [c.value, c]))

export function getCategory(value) {
  return CATEGORY_MAP.get(value) || CATEGORY_MAP.get('other')
}
