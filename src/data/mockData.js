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
  name: 'Aarav Mehta',
  email: 'aarav.mehta@example.com',
  initials: 'AM',
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
    spent: 47250,
    travelers: 3,
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
    travelers: 2,
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
