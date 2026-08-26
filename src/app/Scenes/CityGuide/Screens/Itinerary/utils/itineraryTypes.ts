/** How a stop resolves to a saveable Artsy entity. null for a non-Artsy editorial place. */
export type ItinerarySaveTarget =
  | { type: "SHOW"; slug: string }
  /** Galleries and museums alike — both are Partners in Artsy's model. */
  | { type: "PARTNER"; slug: string }
  | { type: "FAIR"; slug: string }

export interface ItineraryStop {
  id: string
  title: string
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /**
   * Reserved, unused in this pass. ISO 8601. Carried so sorting and timezone-aware
   * behaviour do not need a schema change later. Never format from these — display
   * always comes from displayTime.
   */
  startAt?: string
  endAt?: string
  /** Freeform. May hold emoji ("🥂 🧀") or a short caption. */
  note?: string
  imageUrl: string
  coordinates: { lat: number; lng: number }
  /** null when the stop is not a saveable Artsy entity; no save control renders. */
  saveTarget: ItinerarySaveTarget | null
}

export interface ItinerarySection {
  /** Stable identity. Used for keys, lookups, and map filters. */
  id: string
  /** Opaque backend-authored display string. Never used as identity. */
  title: string
  stops: ItineraryStop[]
}

export interface Itinerary {
  id: string
  citySlug: string
  title: string
  subtitle: string
  heroImageUrl: string
  authorName: string
  description: string
  sections: ItinerarySection[]
}
