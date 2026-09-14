import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { ItineraryStopMapDetail } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopMapDetail"
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"

/**
 * Adapts an itinerary's sections into the shared map's section-shaped input. Stops with no
 * valid coordinates are dropped: `ItineraryStop.coordinates` is optional, because Metaphysics
 * makes latitude and longitude both nullable and a stop can be an editorial note with no
 * location. Such a stop still shows in the list — it just cannot be drawn.
 *
 * The predicate narrows the stop, not just its coordinates, so `MapPlace.coordinates` can stay
 * required below.
 */
export const itineraryStopsToMapSections = (itinerary: Itinerary): MapSection[] =>
  itinerary.sections.map((section) => ({
    id: section.id,
    title: section.title,
    places: section.stops
      .filter((stop): stop is ItineraryStop & { coordinates: { lat: number; lng: number } } =>
        isValidLatLng(stop.coordinates)
      )
      .map((stop) => ({
        id: stop.id,
        title: stop.title,
        coordinates: stop.coordinates,
        // The same destination the list row uses, rather than a second mapping of type to path.
        href: stopCardFields(stop, stop.cardItem).href ?? null,
        detail: <ItineraryStopMapDetail stop={stop} />,
        saveControl: stop.saveTarget ? (
          <CityEventSaveControl
            itemType={stop.saveTarget.itemType}
            itemID={stop.saveTarget.itemID}
            name={stop.title}
          />
        ) : undefined,
      })),
  }))
