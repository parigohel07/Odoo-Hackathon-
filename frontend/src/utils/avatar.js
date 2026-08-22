const AVATAR_GRADIENTS = [
  'from-lav-400 to-candy-300',
  'from-caramel-300 to-candy-400',
  'from-mint-400 to-lav-400',
  'from-candy-400 to-caramel-200',
  'from-lav-500 to-mint-300',
  'from-espresso-400 to-lav-300',
]

export function gradientFor(name) {
  let hash = 0
  for (const char of String(name || '')) hash = (hash * 31 + char.charCodeAt(0)) % 9973
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

export function initialsOf(name) {
  return String(name || '?')
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
