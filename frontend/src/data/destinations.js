export const MY_COUNTRY_PLACES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export const VISA_INFO = {
  Italy: 'Apply beforehand (Schengen visa)',
  Japan: 'Apply beforehand',
  China: 'Apply beforehand',
  'South Korea': 'Apply beforehand (e-Visa)',
  France: 'Apply beforehand (Schengen visa)',
  Thailand: 'Visa on arrival',
  Switzerland: 'Apply beforehand (Schengen visa)',
  'United States': 'Apply beforehand',
  'United Kingdom': 'Apply beforehand',
  UAE: 'Visa on arrival*',
  Singapore: 'Apply beforehand',
  Australia: 'Apply beforehand (eVisitor)',
}

export const INTERNATIONAL_PLACES = Object.keys(VISA_INFO)

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export function getTripDetails(place, isInternational) {
  const rand = seededRandom(hashString(place.toLowerCase()))
  const minDays = isInternational ? 4 + Math.round(rand() * 3) : 2 + Math.round(rand() * 3)
  const maxDays = minDays + 2 + Math.round(rand() * 3)
  const dailyBase = isInternational ? 6000 : 1500
  const minBudget = Math.round((dailyBase * minDays) / 500) * 500
  const maxBudget = Math.round((dailyBase * 2.2 * maxDays) / 500) * 500
  return {
    days: `${minDays}–${maxDays} days`,
    budget: `${inr(minBudget)} – ${inr(maxBudget)} per person`,
    visa: isInternational ? VISA_INFO[place] : null,
  }
}
