import { StopInput } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"

/** An Artsy entity or a custom stop — whatever the sheet was opened for. */
export type StopTarget = StopInput & {
  /** Membership details returned by ItineraryStop for an already-resolved stop. */
  isOnMyItineraries?: boolean | null
  myItineraries?: readonly { readonly internalID: string }[] | null
  /** For `addedStopToItinerary`'s `context_owner_slug` only — never part of `StopInput`, so
   *  `stopMutationInput` strips it before it can reach a mutation's `input`. */
  itemSlug?: string
}

/** A row in the sheet: what the listing knows about an itinerary. Sections aren't in it. */
export interface PayloadItinerary {
  readonly internalID: string
  readonly title: string
  readonly isCurated?: boolean | null
  readonly stopsCount?: number | null
  readonly heroImage?: { readonly url?: string | null } | null
}

/** Which itineraries gained a tick and which lost one, once Done is pressed. */
export const selectionChanges = (
  initial: readonly string[],
  selected: readonly string[]
): { added: string[]; removed: string[] } => ({
  added: selected.filter((id) => !initial.includes(id)),
  removed: initial.filter((id) => !selected.includes(id)),
})

/**
 * A target stripped to what `createItineraryStopInput`/`CustomStopInput`'s mutation-relevant
 * fields actually are — `isOnMyItineraries`, `myItineraries` and `itemSlug` are hints for the
 * sheet's own UI and tracking, not fields Gravity accepts, so they must never reach a
 * mutation's `input`.
 *
 * Pulled out as its own function rather than left as a destructure in a parameter list: that
 * destructure is exactly the kind of thing an array refactor silently drops.
 */
export const stopMutationInput = (target: StopTarget): StopInput => {
  const {
    isOnMyItineraries: _isOnMyItineraries,
    myItineraries: _myItineraries,
    itemSlug: _itemSlug,
    ...input
  } = target

  return input
}

/** How many of `targets` this itinerary already holds, for a "9 of 14 added" row hint. */
export const heldCount = (targets: readonly StopTarget[], itineraryID: string): number =>
  targets.filter(
    (target) => target.myItineraries?.some((itinerary) => itinerary.internalID === itineraryID)
  ).length
