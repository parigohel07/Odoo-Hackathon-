// ---------------------------------------------------------------------------
// IMAGE CONTRACT
// Destination/trip imagery is NOT bundled in this frontend. Images will be
// served by the backend database later. Mock objects therefore expose an
// `imageUrl` field (empty for now) plus a `gradient` fallback used until real
// URLs exist. Expected backend reference: e.g. GET /api/images/:id returning
// a CDN URL, or an Unsplash-style source (https://images.unsplash.com/...)
// stored per record. UI must always render `imageUrl || gradient` fallback.
// ---------------------------------------------------------------------------

export const DEMO_USER = {
  id: 'u-001',
  name: 'Khooshi',
  email: 'khooshi@example.com',
  initials: 'K',
  bio: 'Collecting sunsets, one city at a time.',
}

export const TRIPS = [
  {
    id: 't-001',
    name: 'Goa Beach Escape',
    destination: 'Goa, India',
    startDate: '2026-09-12',
    endDate: '2026-09-18',
    status: 'upcoming',
    budget: 45000,
    spent: 12000,
    travelers: 2,
    mode: 'group',
    members: ['Khooshi', 'Aarav'],
    expenses: [
      { id: 'e-goa-1', title: 'Beach shack dinner', amount: 2400, category: 'food', paidBy: 'Khooshi', participants: ['Khooshi', 'Aarav'], splitMode: 'equal' },
      { id: 'e-goa-2', title: 'Scooter rentals', amount: 1600, category: 'transport', paidBy: 'Aarav', participants: ['Khooshi', 'Aarav'], splitMode: 'equal' },
      { id: 'e-goa-3', title: 'Water sports at Baga', amount: 4000, category: 'fun', paidBy: 'Khooshi', participants: ['Khooshi', 'Aarav'], splitMode: 'equal' },
      { id: 'e-goa-4', title: 'Fort Aguada tickets', amount: 1500, category: 'tickets', paidBy: 'Aarav', participants: ['Khooshi', 'Aarav'], splitMode: 'equal' },
      { id: 'e-goa-5', title: 'Souvenirs & magnets', amount: 2500, category: 'shopping', paidBy: 'Khooshi', participants: ['Khooshi', 'Aarav'], splitMode: 'equal' },
    ],
    imageUrl: '',
    gradient: 'from-candy-300 via-lav-300 to-mint-200',
  },
  {
    id: 't-002',
    name: 'Himalayan Trek',
    destination: 'Manali, India',
    startDate: '2026-10-05',
    endDate: '2026-10-12',
    status: 'planning',
    budget: 30000,
    spent: 3500,
    travelers: 4,
    mode: 'group',
    members: ['Khooshi', 'Meera', 'Dev', 'Ishaan'],
    expenses: [
      { id: 'e-man-1', title: 'Volvo bus tickets', amount: 2000, category: 'transport', paidBy: 'Khooshi', participants: ['Khooshi', 'Meera', 'Dev', 'Ishaan'], splitMode: 'equal' },
      { id: 'e-man-2', title: 'Trail snacks', amount: 600, category: 'food', paidBy: 'Meera', participants: ['Khooshi', 'Meera', 'Dev', 'Ishaan'], splitMode: 'equal' },
      { id: 'e-man-3', title: 'Permit fees', amount: 900, category: 'tickets', paidBy: 'Dev', participants: ['Khooshi', 'Meera', 'Dev', 'Ishaan'], splitMode: 'equal' },
    ],
    imageUrl: '',
    gradient: 'from-lav-300 via-candy-200 to-caramel-200',
  },
  {
    id: 't-003',
    name: 'Rajasthan Heritage Tour',
    destination: 'Jaipur, India',
    startDate: '2026-04-02',
    endDate: '2026-04-08',
    status: 'completed',
    budget: 50000,
    spent: 15300,
    travelers: 3,
    mode: 'group',
    members: ['Khooshi', 'Meera', 'Dev'],
    expenses: [
      { id: 'e-jai-1', title: 'Amber Fort & palace entry', amount: 4500, category: 'tickets', paidBy: 'Khooshi', participants: ['Khooshi', 'Meera', 'Dev'], splitMode: 'equal' },
      { id: 'e-jai-2', title: 'Intercity train tickets', amount: 9000, category: 'transport', paidBy: 'Dev', participants: ['Khooshi', 'Meera', 'Dev'], splitMode: 'equal' },
      { id: 'e-jai-3', title: 'Rajasthani thali night', amount: 1800, category: 'food', paidBy: 'Meera', participants: ['Khooshi', 'Meera', 'Dev'], splitMode: 'equal' },
    ],
    imageUrl: '',
    gradient: 'from-caramel-300 via-candy-300 to-lav-300',
  },
  {
    id: 't-004',
    name: 'Kerala Backwaters',
    destination: 'Alleppey, India',
    startDate: '2025-12-20',
    endDate: '2025-12-27',
    status: 'completed',
    budget: 38000,
    spent: 40100,
    travelers: 1,
    mode: 'solo',
    members: ['Khooshi'],
    expenses: [
      { id: 'e-ker-1', title: 'Houseboat stay (2 nights)', amount: 22000, category: 'stay', paidBy: 'Khooshi', participants: ['Khooshi'], splitMode: 'equal' },
      { id: 'e-ker-2', title: 'Kerala meals & toddy shop', amount: 6400, category: 'food', paidBy: 'Khooshi', participants: ['Khooshi'], splitMode: 'equal' },
      { id: 'e-ker-3', title: 'Kayaking through canals', amount: 2600, category: 'fun', paidBy: 'Khooshi', participants: ['Khooshi'], splitMode: 'equal' },
      { id: 'e-ker-4', title: 'Ayurvedic spa', amount: 4800, category: 'other', paidBy: 'Khooshi', participants: ['Khooshi'], splitMode: 'equal' },
      { id: 'e-ker-5', title: 'Spices & tea souvenirs', amount: 4300, category: 'shopping', paidBy: 'Khooshi', participants: ['Khooshi'], splitMode: 'equal' },
    ],
    imageUrl: '',
    gradient: 'from-mint-200 via-mint-300 to-lav-300',
  },
]

export function mockLogin({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve(DEMO_USER)
      } else {
        reject(new Error('Invalid credentials. Password must be at least 6 characters.'))
      }
    }, 700)
  })
}

export function mockRegister({ name, email }) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...DEMO_USER, name, email }), 700)
  })
}
