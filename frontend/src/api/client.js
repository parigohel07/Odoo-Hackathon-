const API_BASE_URL = 'http://127.0.0.1:8000'

export async function searchLocations(text) {
  const response = await fetch(
    `${API_BASE_URL}/search-location?text=${encodeURIComponent(text)}`
  )

  if (!response.ok) {
    throw new Error('Location search failed')
  }

  return response.json()
}

export async function getSuggestedSpots(latitude, longitude, limit = 10) {
  const response = await fetch(
    `${API_BASE_URL}/suggested-spots?latitude=${latitude}&longitude=${longitude}&limit=${limit}`
  )

  if (!response.ok) {
    throw new Error('Suggested spots search failed')
  }

  return response.json()
}