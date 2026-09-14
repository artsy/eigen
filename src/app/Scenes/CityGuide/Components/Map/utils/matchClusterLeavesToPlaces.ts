import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"

/**
 * Maps a tapped cluster's leaf features (from `ShapeSource#getClusterLeaves`) back to the
 * `MapPlace`s the screen already holds, by matching each leaf's `id` property. A leaf whose
 * id has no match — or has no id at all — is skipped rather than rendered as a blank card,
 * since the rail can only show real places.
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
