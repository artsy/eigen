import { OwnerType } from "@artsy/cohesion"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CustomStopSaveControl } from "app/Scenes/CityGuide/Components/CustomStopSaveControl"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import {
  itineraryStopCategory,
  itinerarySectionTitle,
  itineraryStopCoordinates,
  itineraryStopImage,
  itineraryStopSaveTarget,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { stopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"

/** Same shape `CustomStopSaveControl` and `ItineraryStopRow` build for a custom stop's plus. */
const customStopInput = (
  stop: ItineraryStop,
  coordinates: { lat: number; lng: number },
  shareToken?: string | null
) => ({
  sourceStopID: stop.internalID,
  sourceShareToken: shareToken ?? undefined,
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
 * coordinates are dropped (still shown in the list) so `MapPlace.coordinates` can stay
 * required. A section can come out of this with no places at all; `MapView` is what decides
 * such a section is not worth a filter pill.
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
        const card = stopCardFields(stop, stop.item)

        return {
          id: stop.internalID,
          title,
          coordinates,
          // Same destination the list row uses, rather than a second mapping of type to path.
          href: card.href ?? null,
          card,
          image: itineraryStopImage(stop),
          saveControl: isCustom ? (
            <CustomStopSaveControl
              stop={customStopInput(stop, coordinates, itinerary.shareToken)}
              citySlug={citySlug}
              cityName={cityName}
              contextScreenOwnerType={OwnerType.cityGuideGuide}
              contextScreenOwnerId={itinerary.internalID}
              contextScreenOwnerSlug={itinerary.slug ?? undefined}
              isCuratedGuide={itinerary.isCurated}
            />
          ) : (
            saveTarget && (
              <CityEventSaveControl
                itemType={saveTarget.itemType}
                itemID={saveTarget.itemID}
                itemSlug={saveTarget.itemSlug}
                name={title}
                sourceStopID={stop.internalID}
                sourceShareToken={itinerary.shareToken}
                contextScreenOwnerType={OwnerType.cityGuideGuide}
                contextScreenOwnerId={itinerary.internalID}
                contextScreenOwnerSlug={itinerary.slug ?? undefined}
                isCuratedGuide={itinerary.isCurated}
              />
            )
          ),
        }
      }),
  }))
