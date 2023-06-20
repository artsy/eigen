import { Location } from "app/utils/hooks/useLocation"

export const sortByDistance = (coordinates: Location[], target: Location): Location[] => {
  return coordinates
    .map((coordinate) => ({
      coordinate,
      distance: Math.sqrt(
        Math.pow(Number(coordinate.lng) - Number(target.lng), 2) +
          Math.pow(Number(coordinate.lat) - Number(target.lat), 2)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ coordinate }) => coordinate)
}
