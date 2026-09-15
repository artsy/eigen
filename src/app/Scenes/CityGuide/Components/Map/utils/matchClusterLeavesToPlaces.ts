import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"

/**
 * Maps a tapped cluster's leaf features back to the `MapPlace`s the screen already holds,
 * by `id`. A leaf with no match (or no id) is skipped rather than rendered as a blank card.
 */
export const matchClusterLeavesToPlaces = (leafFeatures: any[], places: MapPlace[]): MapPlace[] => {
  const placesById = new Map(places.map((place) => [place.id, place]))

  const matched: MapPlace[] = []

  leafFeatures.forEach((leaf) => {
    const id = leaf?.properties?.id

    if (!id) return

    const place = placesById.get(id)

    if (place) {
      matched.push(place)
    }
  })

  return matched
}
