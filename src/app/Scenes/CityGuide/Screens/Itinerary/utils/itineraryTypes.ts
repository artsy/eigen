import { ItineraryScreenQuery$data } from "__generated__/ItineraryScreenQuery.graphql"

export type Itinerary = NonNullable<ItineraryScreenQuery$data["itinerary"]>
export type ItinerarySection = Itinerary["sections"][number]
export type ItineraryStop = ItinerarySection["stops"][number]

/** How a stop resolves to a saveable Artsy entity. null for a non-Artsy editorial place. */
export type ItinerarySaveTarget =
  | { type: "SHOW"; slug: string }
  /** Galleries and museums alike — both are Partners in Artsy's model. */
  | { type: "PARTNER"; slug: string }
  | { type: "FAIR"; slug: string }

/**
 * The badge shown on a stop. Editorial: whoever adds the stop picks it, because it is
 * finer-grained than the save target — a museum and a gallery are both Partners.
 */
export type ItineraryStopCategory = "MUSEUM" | "GALLERY" | "SHOW" | "FAIR"
