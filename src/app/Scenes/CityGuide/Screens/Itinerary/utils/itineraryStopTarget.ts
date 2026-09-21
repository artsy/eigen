import { StopTarget } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"
import {
  itineraryStopCategory,
  itineraryStopCoordinates,
  itineraryStopSaveTarget,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import {
  ItinerarySection,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

/**
 * What a stop would be, if it were added to one of your own itineraries — the same shape
 * `ItineraryStopRow` builds inline for its own plus, pulled out here so this and the "Add Full
 * List" button can't drift apart.
 *
 * `null` for a stop whose entity didn't resolve: no entity to point at and no fields of its
 * own to copy, so there is nothing to add. `ItineraryStopRow` renders no plus for one either.
 */
export const itineraryStopTarget = (
  stop: ItineraryStop,
  shareToken?: string
): StopTarget | null => {
  const saveTarget = itineraryStopSaveTarget(stop)
  const isCustom = !stop.item && !saveTarget

  if (isCustom) {
    const coordinates = itineraryStopCoordinates(stop)

    return {
      sourceStopID: stop.internalID,
      sourceShareToken: shareToken,
      isOnMyItineraries: stop.isOnMyItineraries,
      myItineraries: stop.myItineraries,
      title: itineraryStopTitle(stop),
      address: stop.address ?? undefined,
      note: stop.note ?? undefined,
      sourceURL: stop.sourceURL ?? undefined,
      category: itineraryStopCategory(stop.category),
      isFreeAdmission: stop.isFreeAdmission ?? undefined,
      latitude: coordinates?.lat,
      longitude: coordinates?.lng,
    }
  }

  if (!saveTarget) return null

  return {
    itemType: saveTarget.itemType,
    itemID: saveTarget.itemID,
    isOnMyItineraries: stop.isOnMyItineraries,
    myItineraries: stop.myItineraries,
    sourceStopID: stop.internalID,
    sourceShareToken: shareToken,
  }
}

/** Every addable stop across all of an itinerary's sections, in reading order. */
export const itineraryStopTargets = (
  sections: readonly ItinerarySection[],
  shareToken?: string
): StopTarget[] =>
  sections
    .flatMap((section) => section.stops)
    .map((stop) => itineraryStopTarget(stop, shareToken))
    .filter((target): target is StopTarget => target !== null)
