import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { ItineraryStopMapDetail } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopMapDetail"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import { itineraryStopHref } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopHref"
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"

/**
 * Adapts an itinerary's sections into the shared map's input. Stops with no valid
 * coordinates are dropped (still shown in the list) so `MapPlace.coordinates` can stay required.
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
        href: itineraryStopHref(stop.saveTarget),
        detail: <ItineraryStopMapDetail stop={stop} />,
        saveControl: stop.saveTarget ? (
          <ItineraryStopSaveControl stopId={stop.id} stopTitle={stop.title} />
        ) : undefined,
      })),
  }))
