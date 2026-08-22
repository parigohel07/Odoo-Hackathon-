// Pure helpers for the trip expense calculator. Trips created before the
// expense feature (or straight from mock data) may not carry members/expenses,
// so every getter falls back gracefully.

export function getTripMembers(trip) {
  if (!trip) return []
  if (Array.isArray(trip.members) && trip.members.length > 0) return trip.members
  const count = Math.max(1, Number(trip.travelers) || 1)
  return Array.from({ length: count }, (_, index) => (index === 0 ? 'You' : `Traveller ${index + 1}`))
}

export function getTripExpenses(trip) {
  return Array.isArray(trip?.expenses) ? trip.expenses : []
}

export function sumExpenses(expenses) {
  return expenses.reduce((total, expense) => total + (Number(expense.amount) || 0), 0)
}

export function getTripSpent(trip) {
  const expenses = getTripExpenses(trip)
  if (expenses.length > 0) return sumExpenses(expenses)
  return Number(trip?.spent) || 0
}

// How much `member` owes for one expense.
function shareOf(expense, member) {
  const participants = Array.isArray(expense.participants) ? expense.participants : []
  if (!participants.includes(member)) return 0
  if (expense.splitMode === 'custom') {
    return Number(expense.customShares?.[member]) || 0
  }
  return (Number(expense.amount) || 0) / Math.max(1, participants.length)
}

/**
 * Person-wise ledger for a trip.
 * @returns {{ name, paid, share, balance }[]} balance = paid - share
 *   (positive → gets money back, negative → owes the pot)
 */
export function computePersonLedger(members, expenses) {
  const stats = new Map(
    members.map((name) => [name, { name, paid: 0, share: 0, balance: 0 }]),
  )

  for (const expense of expenses) {
    const payer = stats.get(expense.paidBy)
    if (!payer) continue
    payer.paid += Number(expense.amount) || 0
    for (const member of members) {
      const entry = stats.get(member)
      entry.share += shareOf(expense, member)
    }
  }

  for (const entry of stats.values()) {
    entry.balance = entry.paid - entry.share
    entry.paid = round2(entry.paid)
    entry.share = round2(entry.share)
    entry.balance = round2(entry.balance)
  }
  return [...stats.values()]
}

/**
 * Minimal number of transfers to square everyone up (greedy matching).
 * @returns {{ from, to, amount }[]}
 */
export function simplifySettlements(ledger) {
  const debtors = ledger.filter((p) => p.balance < -0.5).map((p) => ({ ...p }))
  const creditors = ledger.filter((p) => p.balance > 0.5).map((p) => ({ ...p }))
  debtors.sort((a, b) => a.balance - b.balance)
  creditors.sort((a, b) => b.balance - a.balance)

  const transfers = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const owed = Math.min(-debtors[i].balance, creditors[j].balance)
    transfers.push({ from: debtors[i].name, to: creditors[j].name, amount: Math.round(owed) })
    debtors[i].balance += owed
    creditors[j].balance -= owed
    if (Math.abs(debtors[i].balance) < 0.5) i += 1
    if (creditors[j].balance < 0.5) j += 1
  }
  return transfers
}

export function computeCategoryTotals(expenses) {
  const totals = new Map()
  for (const expense of expenses) {
    const key = expense.category || 'other'
    totals.set(key, (totals.get(key) || 0) + (Number(expense.amount) || 0))
  }
  return [...totals.entries()]
    .map(([value, amount]) => ({ value, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function formatINR(amount, { sign = false } = {}) {
  const abs = Math.abs(Math.round(Number(amount) || 0))
  const formatted = `₹${abs.toLocaleString('en-IN')}`
  if (!sign) return formatted
  const value = Number(amount) || 0
  if (value > 0) return `+${formatted}`
  if (value < 0) return `−${formatted}`
  return formatted
}

function round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100
}
