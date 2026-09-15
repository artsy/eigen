import { CityItineraryItemType } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"

/** How a stop's `item` union member maps onto the item type a caller passes in. */
const ITEM_TYPENAMES: Record<CityItineraryItemType, string> = {
  SHOW: "Show",
  FAIR: "Fair",
  LOCATION: "Location",
}

export interface StopTarget {
  itemType: CityItineraryItemType
  itemID: string
}

interface PayloadStop {
  readonly internalID: string
  readonly item?: { readonly __typename: string; readonly internalID?: string } | null
}

interface PayloadSection {
  readonly internalID: string
  readonly title?: string | null
  /** Absent on a section built locally for a just-created itinerary, which has none yet. */
  readonly stopsCount?: number | null
  readonly stops: readonly PayloadStop[]
}

export interface PayloadItinerary {
  readonly internalID: string
  readonly title: string
  readonly stopsCount?: number | null
  readonly heroImage?: { readonly url?: string | null } | null
  readonly sections: readonly PayloadSection[]
}

/**
 * The stop on this itinerary that points at the target entity, if it has one.
 *
 * Metaphysics has no "is this entity on my itinerary" field — `Show.isOnCityItinerary` was
 * asked for and does not exist — so the sheet works it out from the itineraries themselves.
 */
export const findStopForTarget = (itinerary: PayloadItinerary, target: StopTarget) =>
  itinerary.sections
    .flatMap((section) => section.stops)
    .find(
      (stop) =>
        stop.item?.__typename === ITEM_TYPENAMES[target.itemType] &&
        stop.item?.internalID === target.itemID
    )

/** The ids of the itineraries already holding this entity, which open ticked. */
export const itinerariesHoldingTarget = (
  itineraries: readonly PayloadItinerary[],
  target: StopTarget
) =>
  itineraries
    .filter((itinerary) => !!findStopForTarget(itinerary, target))
    .map((itinerary) => itinerary.internalID)

/** Which itineraries gained a tick and which lost one, once Done is pressed. */
export const selectionChanges = (
  initial: readonly string[],
  selected: readonly string[]
): { added: string[]; removed: string[] } => ({
  added: selected.filter((id) => !initial.includes(id)),
  removed: initial.filter((id) => !selected.includes(id)),
})
