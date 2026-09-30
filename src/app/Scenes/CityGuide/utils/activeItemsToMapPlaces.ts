import { CityEventRowContext } from "app/Scenes/CityGuide/Components/CityEventRows"
import { MapPlace } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { fairsToMapSections } from "app/Scenes/CityGuide/utils/fairsToMapSections"
import { showsToMapSections } from "app/Scenes/CityGuide/utils/showsToMapSections"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"

/**
 * Turns the shows and fairs behind a tapped pin (or a cluster's leaves) into preview-card places,
 * in the order they were tapped. A fair carries `profile`, which a show's fragment never selects.
 */
export const activeItemsToMapPlaces = (
  items: Array<Fair | Show>,
  context: CityEventRowContext
): MapPlace[] => {
  if (items.length === 0) {
    return []
  }

  const fairs = items.filter((item): item is Fair => "profile" in item)
  const shows = items.filter((item): item is Show => !("profile" in item))

  const placesById = new Map<string, MapPlace>()
  const sections = [
    ...showsToMapSections([{ id: "shows", title: "", items: shows }], context),
    ...fairsToMapSections([{ id: "fairs", title: "", items: fairs }], context),
  ]
  sections.forEach((section) => section.places.forEach((place) => placesById.set(place.id, place)))

  return items.flatMap((item) => {
    const place = placesById.get(item.id)
    return place ? [place] : []
  })
}
