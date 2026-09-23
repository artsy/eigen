import { ItineraryScreenQuery$data } from "__generated__/ItineraryScreenQuery.graphql"
import { CityItineraryItemType } from "app/Scenes/CityGuide/hooks/useCityItineraryStops"
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

export type Itinerary = NonNullable<ItineraryScreenQuery$data["itinerary"]>
export type ItinerarySection = Itinerary["sections"][number]
export type ItineraryStop = ItinerarySection["stops"][number]

/**
 * A section's drag-to-reorder listeners, which the screen wires into the single scroll view
 * every section shares so drax can track its offset and auto-scroll it.
 */
export interface ItineraryScrollHandlers {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onContentSizeChange: (width: number, height: number) => void
}

/**
 * What a stop points at, in the shape `createItineraryStop` takes, so the plus can add the
 * same entity to one of your own itineraries. null for a place with no Artsy entity.
 */
export interface ItinerarySaveTarget {
  itemType: CityItineraryItemType
  /** The entity's own id, which is what a stop stores. */
  itemID: string
  /** For tracking only. Absent for a `LOCATION`, which has no slug of its own. */
  itemSlug?: string
}

/**
 * The badge shown on a stop. Editorial: whoever adds the stop picks it, because it is
 * finer-grained than the save target — a museum and a gallery are both Partners.
 */
export type ItineraryStopCategory =
  | "MUSEUM"
  | "GALLERY"
  | "SHOW"
  | "FAIR"
  | "CAFE"
  | "RESTAURANT"
  | "BAR"
  | "HOTEL"
  | "SHOP"
  | "PARK"
  | "LANDMARK"
  | "OTHER"
