import { Location } from "app/utils/hooks/useLocation"

const MAX_DISTANCE = 6371

export const sortByDistance = (
  locations: { coordinates: Location; city?: string }[],
  userLocation: Location
) => {
  return locations.sort(
    (a, b) => distanceTo(userLocation, a.coordinates) - distanceTo(userLocation, b.coordinates)
  )
}

const distanceTo = (cord1: Location, cord2: Location) => {
  if (!cord1 || !cord2) {
    return MAX_DISTANCE
  }

  if (cord1.lat == cord2.lat && cord1.lng == cord2.lng) {
    return 0
  }

  const radlat1 = (Math.PI * cord1.lat) / 180
  const radlat2 = (Math.PI * cord2.lat) / 180

  const theta = cord1.lng - cord2.lng
  const radtheta = (Math.PI * theta) / 180

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)

  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515

  return dist
}
