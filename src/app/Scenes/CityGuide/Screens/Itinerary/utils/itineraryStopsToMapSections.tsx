import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  itinerarySectionTitle,
  itineraryStopCoordinates,
  itineraryStopImage,
  itineraryStopSaveTarget,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { itineraryStopHref } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopHref"
import { Itinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"

/**
 * Adapts an itinerary's sections into the shared map's input. Stops with no valid
 * coordinates are dropped (still shown in the list) so `MapPlace.coordinates` can stay required.
 */
export const itineraryStopsToMapSections = (itinerary: Itinerary): MapSection[] =>
  itinerary.sections.map((section, index) => ({
    id: section.internalID,
    title: itinerarySectionTitle(section, index),
    places: section.stops
      .map((stop) => ({ stop, coordinates: itineraryStopCoordinates(stop) }))
      .filter(
        (
          entry
        ): entry is { stop: (typeof entry)["stop"]; coordinates: { lat: number; lng: number } } =>
          isValidLatLng(entry.coordinates)
      )
      .map(({ stop, coordinates }) => {
        const saveTarget = itineraryStopSaveTarget(stop)
        const title = itineraryStopTitle(stop)

        return {
          id: stop.internalID,
          title,
          coordinates,
          href: itineraryStopHref(saveTarget),
          card: stopCardFields(stop, stop.item),
          image: itineraryStopImage(stop),
          saveControl: saveTarget ? (
            <ItineraryStopSaveControl stopId={stop.internalID} stopTitle={title} />
          ) : undefined,
        }
      }),
  }))
