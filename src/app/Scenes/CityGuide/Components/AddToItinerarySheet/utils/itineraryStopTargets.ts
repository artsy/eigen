import { StopInput } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"

/** An Artsy entity or a custom stop — whatever the sheet was opened for. */
export type StopTarget = StopInput & {
  /** Membership details returned by ItineraryStop for an already-resolved stop. */
  isOnMyItineraries?: boolean | null
  myItineraries?: readonly { readonly internalID: string }[] | null
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
