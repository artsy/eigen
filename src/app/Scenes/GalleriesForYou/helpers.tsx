import { Location } from "app/utils/hooks/useLocation"

export const sortByDistance = (
  locations: { coordinates: Location; city?: string }[],
  target: Location
) => {
  return locations.sort(
    (a, b) => distanceTo(a.coordinates, target) - distanceTo(b.coordinates, target)
  )
}

const distanceTo = (a: Location, b: Location) => {
  return Math.sqrt(
    Math.pow(Number(a.lng) - Number(b.lng), 2) + Math.pow(Number(a.lat) - Number(b.lat), 2)
  )
}
