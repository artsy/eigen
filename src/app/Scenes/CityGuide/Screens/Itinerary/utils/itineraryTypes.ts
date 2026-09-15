import { StopCardItem } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"

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

export interface ItineraryStop {
  id: string
  title: string
  /** Display address. The row truncates it to one line; the preview shows it in full. */
  address?: string
  category?: ItineraryStopCategory
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /**
   * Reserved, unused in this pass — ISO 8601, carried so sorting/timezone behaviour needs no
   * later schema change. Never format from these; display always comes from displayTime.
   */
  startAt?: string
  endAt?: string
  /** Freeform. May hold emoji ("🥂 🧀") or a short caption. */
  note?: string
  /** Where the curator found this stop. The only thing a custom stop can link to. */
  sourceURL?: string
  /** `SHOW_EVENT` or `FAIR_EVENT` when the stop names an event, else absent. */
  eventType?: string
  /**
   * The event itself, when the stop names one. A show event carries its own kind (e.g.
   * "Opening Reception", "Artist Talk"); a fair event has a name but no kind.
   */
  event?: {
    title?: string | null
    /** The kind, on show events only. */
    kind?: string | null
    /** ISO, for deciding whether a reception is today. Never formatted from here. */
    startAt?: string | null
  }
  /**
   * Whether entry is free. The stop's own answer, which an author can set to override what
   * the entity says — so it wins over `Show.isFreeAdmission` on the card.
   */
  isFreeAdmission?: boolean
  imageUrl: string
  /**
   * Absent when the stop has no usable location — lat/lng are both nullable server-side. Map
   * converters filter on this rather than plot a 0,0 pin; the stop still belongs in the list.
   */
  coordinates?: { lat: number; lng: number }
  /** null when the stop is not a saveable Artsy entity; no save control renders. */
  saveTarget: ItinerarySaveTarget | null
  /**
   * What the stop resolved to, in the shape the card needs — separate from `saveTarget`,
   * which is only a type and slug. Absent for a custom stop.
   */
  cardItem?: StopCardItem
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
  /**
   * Editorial guides are curated; a user's own itinerary is not — the only ownership signal
   * available. Drives what the screen hides for your own: numbering, headings, byline.
   */
  isCurated: boolean
  citySlug: string
  title: string
  subtitle: string
  heroImageUrl: string
  authorName: string
  description: string
  sections: ItinerarySection[]
}
