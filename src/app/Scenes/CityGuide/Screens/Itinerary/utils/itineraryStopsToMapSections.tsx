import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  itineraryStopCategory,
  itinerarySectionTitle,
  itineraryStopCoordinates,
  itineraryStopImage,
  itineraryStopSaveTarget,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { itineraryStopHref } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopHref"
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"

/** Same shape `CustomStopSaveControl` and `ItineraryStopRow` build for a custom stop's plus. */
const customStopInput = (stop: ItineraryStop, coordinates: { lat: number; lng: number }) => ({
  title: itineraryStopTitle(stop),
  address: stop.address ?? undefined,
  note: stop.note ?? undefined,
  sourceURL: stop.sourceURL ?? undefined,
  category: itineraryStopCategory(stop.category),
  isFreeAdmission: stop.isFreeAdmission ?? undefined,
  latitude: coordinates.lat,
  longitude: coordinates.lng,
})

/**
 * Adapts an itinerary's sections into the shared map's input. Stops with no valid
 * coordinates are dropped (still shown in the list) so `MapPlace.coordinates` can stay required.
 */
export const itineraryStopsToMapSections = (
  itinerary: Itinerary,
  citySlug: string,
  cityName: string
): MapSection[] =>
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
        // Nothing resolved from Artsy: no entity to follow and no entity page to open. Same
        // test `ItineraryStopRow` uses for its own plus.
        const isCustom = !stop.item && !saveTarget

        return {
          id: stop.internalID,
          title,
          coordinates,
          href: itineraryStopHref(saveTarget),
          card: stopCardFields(stop, stop.item),
          image: itineraryStopImage(stop),
          saveControl: isCustom ? (
            <CustomStopSaveControl
              stop={customStopInput(stop, coordinates)}
              citySlug={citySlug}
              cityName={cityName}
            />
          ) : (
            saveTarget && <ItineraryStopSaveControl stopId={stop.internalID} stopTitle={title} />
          ),
        }
      }),
  }))
