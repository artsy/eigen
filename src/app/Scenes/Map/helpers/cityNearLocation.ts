import { CityData } from "app/Scenes/City/CityPicker"

const CITY_RADIUS_M = 100 * 200 // 500km

// Helper: Haversine formula to calculate distance between two lat/lng points in meters
function distanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371000 // Earth radius in meters
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * @param {Object[]} cities - Array of city objects, each with { epicenter: { latitude, longitude }, ... }
 * @param {Object} location - Object with { latitude, longitude }
 * @returns {Object|null} - Closest city within 100km, or null
 */
export function cityNearLocation(cities: CityData[], location: { lat: number; lng: number }) {
  if (cities.length === 0) return null

  let closestCity = null
  let minDistance = Infinity

  for (const city of cities) {
    const { lat, lng } = city.coordinates
    const dist = distanceInMeters(lat, lng, location.lat, location.lng)
    if (dist < minDistance) {
      minDistance = dist
      closestCity = city
    }
  }

  return minDistance < CITY_RADIUS_M ? closestCity : null
}
